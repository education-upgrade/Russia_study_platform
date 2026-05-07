-- Multi-class guided study platform foundation
-- Run this in Supabase SQL Editor after the existing 1905 and guided-study seed files.
-- It is deliberately backwards-compatible with the current demo app and safe to rerun.

create extension if not exists "pgcrypto";

create table if not exists app_profiles (
  id uuid primary key,
  display_name text not null,
  role text not null check (role in ('teacher', 'student')),
  year_group text,
  email text,
  created_at timestamptz not null default now()
);

alter table app_profiles add column if not exists display_name text;
alter table app_profiles add column if not exists role text;
alter table app_profiles add column if not exists year_group text;
alter table app_profiles add column if not exists email text;
alter table app_profiles add column if not exists created_at timestamptz not null default now();

create table if not exists teacher_classes (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  year_group text not null check (year_group in ('Y12', 'Y13')),
  course_code text not null default 'AQA-7042-1H',
  teacher_id uuid references app_profiles(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now()
);

alter table teacher_classes add column if not exists class_name text;
alter table teacher_classes add column if not exists year_group text;
alter table teacher_classes add column if not exists course_code text not null default 'AQA-7042-1H';
alter table teacher_classes add column if not exists teacher_id uuid references app_profiles(id) on delete set null;
alter table teacher_classes add column if not exists status text not null default 'active';
alter table teacher_classes add column if not exists created_at timestamptz not null default now();

create table if not exists class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references teacher_classes(id) on delete cascade,
  student_id uuid not null references app_profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'removed')),
  created_at timestamptz not null default now(),
  unique (class_id, student_id)
);

alter table class_memberships add column if not exists class_id uuid references teacher_classes(id) on delete cascade;
alter table class_memberships add column if not exists student_id uuid references app_profiles(id) on delete cascade;
alter table class_memberships add column if not exists status text not null default 'active';
alter table class_memberships add column if not exists created_at timestamptz not null default now();
create unique index if not exists ux_class_memberships_class_student on class_memberships(class_id, student_id);

create table if not exists course_units (
  id uuid primary key default gen_random_uuid(),
  course_code text not null default 'AQA-7042-1H',
  year_group text not null check (year_group in ('Y12', 'Y13')),
  unit_order int not null,
  unit_title text not null,
  period_label text not null,
  unique (course_code, unit_order)
);

alter table course_units add column if not exists course_code text not null default 'AQA-7042-1H';
alter table course_units add column if not exists year_group text;
alter table course_units add column if not exists unit_order int;
alter table course_units add column if not exists unit_title text;
alter table course_units add column if not exists period_label text;
create unique index if not exists ux_course_units_course_order on course_units(course_code, unit_order);

create table if not exists study_pathways (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  course_code text not null default 'AQA-7042-1H',
  year_group text not null check (year_group in ('Y12', 'Y13')),
  unit_title text not null,
  pathway_title text not null,
  enquiry_question text,
  pathway_order int not null default 1,
  recommended_activity_order text[] not null default array['lesson_content','quiz','flashcards','peel_response','confidence_exit_ticket'],
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now()
);

alter table study_pathways add column if not exists slug text;
alter table study_pathways add column if not exists course_code text not null default 'AQA-7042-1H';
alter table study_pathways add column if not exists year_group text;
alter table study_pathways add column if not exists unit_title text;
alter table study_pathways add column if not exists pathway_title text;
alter table study_pathways add column if not exists enquiry_question text;
alter table study_pathways add column if not exists pathway_order int not null default 1;
alter table study_pathways add column if not exists recommended_activity_order text[] not null default array['lesson_content','quiz','flashcards','peel_response','confidence_exit_ticket'];
alter table study_pathways add column if not exists status text not null default 'active';
alter table study_pathways add column if not exists created_at timestamptz not null default now();
create unique index if not exists ux_study_pathways_slug on study_pathways(slug);

alter table guided_study_assignments
  add column if not exists class_id uuid references teacher_classes(id) on delete set null;

alter table guided_study_assignments
  add column if not exists teacher_id uuid references app_profiles(id) on delete set null;

alter table guided_study_assignments
  add column if not exists assigned_student_ids uuid[];

alter table guided_study_assignments
  add column if not exists recipient_count int not null default 1;

create index if not exists idx_guided_study_assignments_class_id on guided_study_assignments(class_id);
create index if not exists idx_guided_study_assignments_student_id on guided_study_assignments(assigned_student_id);
create index if not exists idx_student_responses_student_id on student_responses(student_id);
create index if not exists idx_student_responses_activity_id on student_responses(activity_id);

insert into app_profiles (id, display_name, role, year_group, email)
values
  ('11111111-1111-1111-1111-111111111111', 'Demo Teacher', 'teacher', null, 'teacher@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Demo Student', 'student', 'Y12', 'student@example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Year 12 Student 2', 'student', 'Y12', null),
  ('44444444-4444-4444-4444-444444444444', 'Year 13 Student 1', 'student', 'Y13', null)
on conflict (id) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  year_group = excluded.year_group,
  email = excluded.email;

insert into teacher_classes (id, class_name, year_group, course_code, teacher_id, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Year 12 Russia demo class', 'Y12', 'AQA-7042-1H', '11111111-1111-1111-1111-111111111111', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Year 13 Russia demo class', 'Y13', 'AQA-7042-1H', '11111111-1111-1111-1111-111111111111', 'active')
on conflict (id) do update set
  class_name = excluded.class_name,
  year_group = excluded.year_group,
  course_code = excluded.course_code,
  teacher_id = excluded.teacher_id,
  status = excluded.status;

insert into class_memberships (class_id, student_id, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'active')
on conflict (class_id, student_id) do update set status = excluded.status;

insert into course_units (course_code, year_group, unit_order, unit_title, period_label)
values
  ('AQA-7042-1H', 'Y12', 1, 'Trying to preserve autocracy, 1855–1894', '1855–1894'),
  ('AQA-7042-1H', 'Y12', 2, 'The collapse of autocracy, 1894–1917', '1894–1917'),
  ('AQA-7042-1H', 'Y13', 3, 'The emergence of Communist dictatorship, 1917–1941', '1917–1941'),
  ('AQA-7042-1H', 'Y13', 4, 'The Stalinist dictatorship and reaction, 1941–1964', '1941–1964')
on conflict (course_code, unit_order) do update set
  year_group = excluded.year_group,
  unit_title = excluded.unit_title,
  period_label = excluded.period_label;

insert into study_pathways (slug, course_code, year_group, unit_title, pathway_title, enquiry_question, pathway_order, status)
values
  ('1905-revolution', 'AQA-7042-1H', 'Y12', 'The collapse of autocracy, 1894–1917', '1905 Revolution', 'Was the 1905 Revolution a turning point for Tsarist Russia?', 1, 'active')
on conflict (slug) do update set
  course_code = excluded.course_code,
  year_group = excluded.year_group,
  unit_title = excluded.unit_title,
  pathway_title = excluded.pathway_title,
  enquiry_question = excluded.enquiry_question,
  pathway_order = excluded.pathway_order,
  status = excluded.status;
