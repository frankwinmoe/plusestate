-- Profiles: add email and full_name for displaying team members (synced from auth.users).
-- Run after 20250216100000_profiles_agency_id.sql.

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text;

create index if not exists idx_profiles_email on public.profiles(email);

-- Update handle_new_user to set email/full_name on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, email, full_name)
  values (
    new.id,
    'user',
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Sync email/full_name when auth.users is updated (e.g. user changes email)
create or replace function public.sync_profile_from_auth()
returns trigger as $$
begin
  update public.profiles
  set email = new.email,
      full_name = coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', full_name),
      updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_sync_profile on auth.users;
create trigger on_auth_user_sync_profile
  after update of email, raw_user_meta_data on auth.users
  for each row execute function public.sync_profile_from_auth();
