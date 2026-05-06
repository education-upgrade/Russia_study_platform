-- MVP schema draft for the Russia Study Platform
-- This schema supports the first 1905 Revolution assignment loop.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  exam_board text not null,
  specification text not null
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  teacher_id uuid references users(id),
  course_id uuid references courses(id),
  academic_year text,
  created_at timestamptz not null default now()
);

create table if not exists class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  student_id uuid references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(class_id, student_id)
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  title text not null,
  period text,
  theme text,
  sequence_order integer,
  year_group text
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id),
  title text not null,
  enquiry_question text,
  estimated_minutes integer,
  lesson_type text default 'guided_study'
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id),
  lesson_id uuid references lessons(id),
  activity_type text not null,
  title text not null,
  skill_focus text,
  difficulty text,
  estimated_minutes integer,
  content_json jsonb not null default '{}'::jsonb
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id),
  teacher_id uuid references users(id),
  title text not null,
  due_date date,
  assignment_type text not null default 'guided_study',
  created_at timestamptz not null default now()
);

create table if not exists assignment_activities (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references assignments(id) on delete cascade,
  activity_id uuid references activities(id),
  required boolean not null default true,
  sequence_order integer not null default 1
);

create table if not exists student_responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  assignment_id uuid references assignments(id) on delete cascade,
  activity_id uuid references activities(id),
  response_type text not null,
  response_json jsonb not null default '{}'::jsonb,
  score numeric,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'draft', 'submitted', 'complete', 'late', 'missing')),
  started_at timestamptz,
  last_saved_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);
