-- Follow-up to the Stage 2 legacy hardening migration.
-- Remove the actual historic policy names that exist in production and reduce
-- direct browser grants to the minimum required read-only content access.

-- Obsolete demo guided-study policies.
drop policy if exists "Demo can create guided study assignments" on public.guided_study_assignments;
drop policy if exists "Demo can read guided study assignments" on public.guided_study_assignments;
drop policy if exists "Demo can update guided study assignments" on public.guided_study_assignments;

-- Obsolete demo student-response policies.
drop policy if exists "Allow demo insert student responses" on public.student_responses;
drop policy if exists "Allow demo read student responses" on public.student_responses;
drop policy if exists "Allow demo update student responses" on public.student_responses;

-- Virtual activity materialisation is now server-only.
drop policy if exists "Allow app to materialise virtual activities" on public.activities;

-- Legacy prototype tables are not directly available to browser roles.
revoke all privileges on public.classes from anon, authenticated;
revoke all privileges on public.guided_study_assignments from anon, authenticated;
revoke all privileges on public.student_responses from anon, authenticated;

-- Activities remain read-only curriculum content for browser roles.
revoke all privileges on public.activities from anon, authenticated;
grant select on public.activities to anon, authenticated;
