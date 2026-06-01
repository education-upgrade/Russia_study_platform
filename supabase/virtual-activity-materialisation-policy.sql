-- Allows the app to materialise virtual activity rows when a student first opens/saves
-- a content-driven activity that does not yet have a seeded Supabase activities row.
-- This supports the content-driven architecture where routes can be built from
-- assignment + registry + fallback content, while persistence still uses UUID activity rows.

alter table activities enable row level security;

drop policy if exists "Allow app to materialise virtual activities" on activities;

create policy "Allow app to materialise virtual activities"
on activities
for insert
to anon, authenticated
with check (true);
