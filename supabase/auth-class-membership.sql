-- Auth and class-code membership layer for the Russia Study Platform
-- This migration moves the platform toward the final school-email + class-code model.

-- Existing application users remain the profile table for now.
-- auth_user_id will later link each profile to auth.users(id).
alter table users add column if not exists auth_user_id uuid unique;
alter table users add column if not exists school_name text;
alter table users add column if not exists display_name text;
alter table users add column if not exists last_seen_at timestamptz;

update users
set display_name = name
where display_name is null;

-- Classes need a shareable join code for students.
alter table classes add column if not exists class_code text unique;
alter table classes add column if not exists status text not null default 'active' check (status in ('active', 'archived'));
alter table classes add column if not exists updated_at timestamptz not null default now();

-- Backfill demo class code if the demo class exists.
update classes
set class_code = 'RUSSIA12'
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  and class_code is null;

-- Memberships need status so students can be removed without deleting their evidence.
alter table class_memberships add column if not exists status text not null default 'active' check (status in ('active', 'removed', 'pending'));
alter table class_memberships add column if not exists joined_at timestamptz not null default now();
alter table class_memberships add column if not exists removed_at timestamptz;

create index if not exists idx_classes_class_code on classes(class_code);
create index if not exists idx_class_memberships_student on class_memberships(student_id);
create index if not exists idx_class_memberships_class_status on class_memberships(class_id, status);

-- Guided-study assignments should be able to target classes and individual students.
alter table guided_study_assignments add column if not exists class_id uuid references classes(id);
alter table guided_study_assignments add column if not exists teacher_id uuid references users(id);
alter table guided_study_assignments add column if not exists assigned_student_ids uuid[];
alter table guided_study_assignments add column if not exists recipient_count integer not null default 1;

create index if not exists idx_guided_study_assignments_class on guided_study_assignments(class_id);
create index if not exists idx_guided_study_assignments_teacher on guided_study_assignments(teacher_id);

-- Helper view for teacher dashboards. This can be replaced by a secured RPC later.
create or replace view teacher_class_roster as
select
  c.id as class_id,
  c.class_name,
  c.class_code,
  c.teacher_id,
  c.course_id,
  c.academic_year,
  cm.student_id,
  u.name as student_name,
  coalesce(u.display_name, u.name) as student_display_name,
  u.email as student_email,
  cm.status as membership_status,
  cm.joined_at
from classes c
join class_memberships cm on cm.class_id = c.id
join users u on u.id = cm.student_id
where c.status = 'active';
