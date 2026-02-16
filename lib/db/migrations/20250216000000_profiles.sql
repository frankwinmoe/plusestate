-- Profiles table for user roles (e.g. admin). Run in Supabase SQL editor.
-- Requires auth.users to exist (Supabase Auth).

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: RLS so users can read their own profile (for role checks via anon client).
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Service role bypasses RLS by default; no policy needed for admin client.

-- Trigger to set updated_at
create or replace function public.set_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- Create profile on signup (Supabase Auth hook or trigger)
-- Option A: trigger on auth.users (requires service role or migration role)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- First admin: after running this migration, set one user to admin, e.g.:
-- update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
