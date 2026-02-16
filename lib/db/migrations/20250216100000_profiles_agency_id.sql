-- Add agency_id to profiles: user belongs to one agency; one agency has many users.
-- Run after 20250216000000_profiles.sql and after agencies table exists.

alter table public.profiles
  add column if not exists agency_id uuid references public.agencies(id) on delete set null;

create index if not exists idx_profiles_agency_id on public.profiles(agency_id);

comment on column public.profiles.agency_id is 'Agency this user belongs to; one agency can have many users.';
