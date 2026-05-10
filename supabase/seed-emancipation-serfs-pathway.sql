-- Seed: Emancipation of the serfs pathway
-- Purpose: Register the Emancipation module in Supabase so it can be assigned from the teacher dashboard.
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
  'a2b8f20e-1861-4261-9a2b-000000000301',
  'How far did emancipation improve the lives of Russian peasants?',
  'How far did emancipation improve the lives of Russian peasants?',
  45
where not exists (
  select 1 from lessons
  where title = 'How far did emancipation improve the lives of Russian peasants?'
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
  'a2b8f20e-1861-4261-9a2b-000000000311',
  l.id,
  'lesson_content',
  'Lesson notes: Emancipation of the serfs',
  'AO1 contextual understanding',
  'secure',
  12,
  '{"sections":[]}'::jsonb
from lessons l
where l.title = 'How far did emancipation improve the lives of Russian peasants?'
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
  'a2b8f20e-1861-4261-9a2b-000000000312',
  l.id,
  'flashcards',
  'Flashcards: Emancipation of the serfs key knowledge',
  'AO1 recall',
  'secure',
  10,
  '{"cards":[]}'::jsonb
from lessons l
where l.title = 'How far did emancipation improve the lives of Russian peasants?'
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
  'a2b8f20e-1861-4261-9a2b-000000000313',
  l.id,
  'quiz',
  'Retrieval quiz: Emancipation of the serfs',
  'AO1 retrieval',
  'secure',
  8,
  '{"questions":[]}'::jsonb
from lessons l
where l.title = 'How far did emancipation improve the lives of Russian peasants?'
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
  'a2b8f20e-1861-4261-9a2b-000000000314',
  l.id,
  'peel_response',
  'PEEL response: Did emancipation improve peasant lives?',
  'AO1 explanation and judgement',
  'secure',
  12,
  '{"question":"Explain one way in which emancipation improved the lives of Russian peasants.","stretchQuestion":"Emancipation improved the legal position of peasants more than their living standards. Assess the validity of this view in one paragraph.","scaffold":[]}'::jsonb
from lessons l
where l.title = 'How far did emancipation improve the lives of Russian peasants?'
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
  'a2b8f20e-1861-4261-9a2b-000000000315',
  l.id,
  'confidence_exit_ticket',
  'Confidence check: Emancipation of the serfs',
  'Reflection and metacognition',
  'secure',
  5,
  '{"prompt":"How confident are you explaining the impact of emancipation on Russian peasants?"}'::jsonb
from lessons l
where l.title = 'How far did emancipation improve the lives of Russian peasants?'
  and not exists (
    select 1 from activities a
    where a.lesson_id = l.id
      and a.activity_type = 'confidence_exit_ticket'
  )
limit 1;
