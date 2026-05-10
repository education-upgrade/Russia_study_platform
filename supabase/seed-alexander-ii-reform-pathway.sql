-- Seed: Alexander II reform pathway
-- Purpose: Register the Alexander II reform module in Supabase so it can be assigned from the teacher dashboard.
-- Safe scope: inserts this lesson and its five activities only if they do not already exist.
-- It does not alter dashboards, RLS, progress tracking or existing student responses.

-- 1) Lesson row
insert into lessons (
  id,
  title,
  enquiry_question,
  estimated_minutes
)
select
  'a2b8f20e-1855-4261-9a2b-000000000201',
  'Why did Alexander II believe Russia needed reform?',
  'Why did Alexander II believe Russia needed reform?',
  45
where not exists (
  select 1 from lessons
  where title = 'Why did Alexander II believe Russia needed reform?'
);

-- 2) Activity rows
insert into activities (
  id,
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  'a2b8f20e-1855-4261-9a2b-000000000211',
  l.id,
  'lesson_content',
  'Lesson notes: Alexander II and the need for reform',
  'AO1 contextual understanding',
  'secure',
  12,
  '{"sections":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II believe Russia needed reform?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'lesson_content'
  )
limit 1;

insert into activities (
  id,
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  'a2b8f20e-1855-4261-9a2b-000000000212',
  l.id,
  'flashcards',
  'Flashcards: Alexander II reform key knowledge',
  'AO1 recall',
  'secure',
  10,
  '{"cards":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II believe Russia needed reform?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'flashcards'
  )
limit 1;

insert into activities (
  id,
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  'a2b8f20e-1855-4261-9a2b-000000000213',
  l.id,
  'quiz',
  'Retrieval quiz: Alexander II reform',
  'AO1 retrieval',
  'secure',
  8,
  '{"questions":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II believe Russia needed reform?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'quiz'
  )
limit 1;

insert into activities (
  id,
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  'a2b8f20e-1855-4261-9a2b-000000000214',
  l.id,
  'peel_response',
  'PEEL response: Why did the Crimean War encourage reform?',
  'AO1 explanation and judgement',
  'secure',
  12,
  '{"question":"Explain why the Crimean War encouraged Alexander II to reform Russia.","stretchQuestion":"The Crimean War was the main reason Alexander II reformed Russia. Assess the validity of this view in one paragraph.","scaffold":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II believe Russia needed reform?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'peel_response'
  )
limit 1;

insert into activities (
  id,
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  'a2b8f20e-1855-4261-9a2b-000000000215',
  l.id,
  'confidence_exit_ticket',
  'Confidence check: Alexander II reform',
  'Reflection and metacognition',
  'secure',
  5,
  '{"prompt":"How confident are you explaining why Alexander II believed Russia needed reform?"}'::jsonb
from lessons l
where l.title = 'Why did Alexander II believe Russia needed reform?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'confidence_exit_ticket'
  )
limit 1;
