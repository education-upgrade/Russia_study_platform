-- User profiles and application roles for the Russia Study Platform.
-- New public registrations deliberately default to the student role.
-- Teacher and admin roles must be assigned by a trusted administrator.

create type public.app_role as enum ('student', 'teacher', 'admin');
create type public.account_status as enum ('active', 'suspended');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'student',
  status public.account_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'Application profile linked one-to-one with auth.users.';
comment on column public.profiles.role is 'Application role. Public sign-up always defaults to student.';

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

-- Profile creation and privileged fields are controlled by database triggers and
-- trusted administrative processes, not directly by browser clients.
revoke insert, update, delete on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'student'::public.app_role,
    'active'::public.account_status
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

-- Create profiles for accounts that existed before this migration.
insert into public.profiles (id, full_name, role, status)
select
  users.id,
  coalesce(users.raw_user_meta_data ->> 'full_name', ''),
  'student'::public.app_role,
  'active'::public.account_status
from auth.users as users
on conflict (id) do nothing;
