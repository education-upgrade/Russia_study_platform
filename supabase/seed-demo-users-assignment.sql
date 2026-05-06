-- Demo seed data for testing the first saved quiz response.
-- Run this after schema.sql, seed-1905-mvp.sql and public-content-policies.sql.
-- It creates one demo teacher, one demo student, one demo class and one demo assignment.

insert into users (id, name, email, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Demo Teacher', 'teacher.demo@education-upgrade.local', 'teacher'),
  ('22222222-2222-2222-2222-222222222222', 'Demo Student', 'student.demo@education-upgrade.local', 'student')
on conflict (email) do nothing;

insert into classes (id, class_name, teacher_id, course_id, academic_year)
select
  '33333333-3333-3333-3333-333333333333',
  'Year 12 Russia Demo',
  '11111111-1111-1111-1111-111111111111',
  c.id,
  '2025-2026'
from courses c
where c.specification = '7042 Component 1H'
on conflict (id) do nothing;

insert into class_memberships (class_id, student_id)
values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222')
on conflict (class_id, student_id) do nothing;

insert into assignments (id, class_id, teacher_id, title, due_date, assignment_type)
values (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '1905 Revolution MVP Pathway',
  current_date + interval '7 days',
  'guided_study'
)
on conflict (id) do nothing;

insert into assignment_activities (assignment_id, activity_id, required, sequence_order)
select
  '44444444-4444-4444-4444-444444444444',
  a.id,
  true,
  row_number() over (order by a.estimated_minutes asc, a.title asc)
from activities a
join lessons l on l.id = a.lesson_id
where l.title = 'Was the 1905 Revolution a turning point for Tsarist Russia?'
and not exists (
  select 1
  from assignment_activities aa
  where aa.assignment_id = '44444444-4444-4444-4444-444444444444'
  and aa.activity_id = a.id
);
