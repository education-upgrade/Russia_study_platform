-- MVP public-read policies for seeded course content.
-- Run this in Supabase SQL Editor if the app can connect but shows 0 rows while SQL Editor shows data.
-- This allows the browser anon key to read course/unit/lesson/activity content.

alter table courses enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table activities enable row level security;

drop policy if exists "Allow public read courses" on courses;
drop policy if exists "Allow public read units" on units;
drop policy if exists "Allow public read lessons" on lessons;
drop policy if exists "Allow public read activities" on activities;

create policy "Allow public read courses"
on courses for select
to anon, authenticated
using (true);

create policy "Allow public read units"
on units for select
to anon, authenticated
using (true);

create policy "Allow public read lessons"
on lessons for select
to anon, authenticated
using (true);

create policy "Allow public read activities"
on activities for select
to anon, authenticated
using (true);
