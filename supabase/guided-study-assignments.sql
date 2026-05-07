-- Guided study assignment table for the Russia Study Platform MVP.
-- Run this in the Supabase SQL Editor after the existing setup.

create table if not exists guided_study_assignments (
  id uuid primary key default gen_random_uuid(),
  pathway_slug text not null default '1905-revolution',
  lesson_title text not null,
  mode text not null default 'full_guided_study',
  required_activity_types text[] not null default array['lesson_content','quiz','flashcards','peel_response','confidence_exit_ticket'],
  deadline_at timestamptz,
  instructions text,
  assigned_student_id uuid not null default '22222222-2222-2222-2222-222222222222',
  assigned_class text not null default 'Year 12 Russia demo class',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guided_study_assignments_student_idx
  on guided_study_assignments (assigned_student_id, status, created_at desc);

create index if not exists guided_study_assignments_pathway_idx
  on guided_study_assignments (pathway_slug, status);

insert into guided_study_assignments (
  pathway_slug,
  lesson_title,
  mode,
  required_activity_types,
  deadline_at,
  instructions,
  assigned_student_id,
  assigned_class,
  status
)
select
  '1905-revolution',
  'Was the 1905 Revolution a turning point for Tsarist Russia?',
  'full_guided_study',
  array['lesson_content','quiz','flashcards','peel_response','confidence_exit_ticket'],
  now() + interval '7 days',
  'Complete the full 1905 guided study pathway before the next review lesson. Focus especially on flashcard revisit cards and the PEEL judgement link.',
  '22222222-2222-2222-2222-222222222222',
  'Year 12 Russia demo class',
  'active'
where not exists (
  select 1 from guided_study_assignments
  where pathway_slug = '1905-revolution'
    and assigned_student_id = '22222222-2222-2222-2222-222222222222'
    and status = 'active'
);
