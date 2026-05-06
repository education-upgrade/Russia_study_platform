-- Temporary MVP/demo policies for saving and reading demo student responses.
-- Run this in Supabase SQL Editor while testing the demo student flow.
-- These policies are intentionally broad for the prototype because authentication is not wired yet.
-- Replace with authenticated role-based policies before using real students.

alter table student_responses enable row level security;

drop policy if exists "Allow demo insert student responses" on student_responses;
drop policy if exists "Allow demo update student responses" on student_responses;
drop policy if exists "Allow demo read student responses" on student_responses;

create policy "Allow demo insert student responses"
on student_responses for insert
to anon, authenticated
with check (true);

create policy "Allow demo update student responses"
on student_responses for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow demo read student responses"
on student_responses for select
to anon, authenticated
using (true);
