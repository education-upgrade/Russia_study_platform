-- Allow teachers to resolve the names of students in classes they teach.
-- The existing profiles policy only permits users to read their own row, which
-- caused teacher dashboards to receive no student profile rows and fall back to
-- labels such as "Student 1".

-- Repair any older profile rows whose name was left blank even though Supabase
-- Auth contains the full name captured during sign-up.
update public.profiles as profile
set
  full_name = trim(auth_user.raw_user_meta_data ->> 'full_name'),
  updated_at = timezone('utc', now())
from auth.users as auth_user
where profile.id = auth_user.id
  and trim(coalesce(profile.full_name, '')) = ''
  and trim(coalesce(auth_user.raw_user_meta_data ->> 'full_name', '')) <> '';

-- Keep access narrow: a teacher may read a student's profile only where an
-- active membership connects that student to a class taught by the caller.
drop policy if exists "Teachers can read profiles for their students" on public.profiles;
create policy "Teachers can read profiles for their students"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.class_memberships as membership
    where membership.student_id = profiles.id
      and membership.status = 'active'
      and public.is_class_teacher(membership.class_id)
  )
);
