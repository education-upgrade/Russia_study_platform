-- Seed: Alexander II wider reforms pathway
-- Safe isolated insert for lesson + five activities only.

insert into lessons (
  id,
  title,
  enquiry_question,
  estimated_minutes
)
select
  'a2b8f20e-1870-4261-9a2b-000000000401',
  'How far did Alexander II modernise Russia through reform?',
  'How far did Alexander II modernise Russia through reform?',
  45
where not exists (
  select 1 from lessons
  where title = 'How far did Alexander II modernise Russia through reform?'
);

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1870-4261-9a2b-000000000411',
  l.id,
  'lesson_content',
  'Lesson notes: Alexander II wider reforms',
  'AO1 contextual understanding',
  'secure',
  12,
  '{"sections":[]}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1870-4261-9a2b-000000000412',
  l.id,
  'flashcards',
  'Flashcards: Alexander II wider reforms',
  'AO1 recall',
  'secure',
  10,
  '{"cards":[]}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'flashcards'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1870-4261-9a2b-000000000413',
  l.id,
  'quiz',
  'Retrieval quiz: Alexander II wider reforms',
  'AO1 retrieval',
  'secure',
  8,
  '{"questions":[]}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'quiz'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1870-4261-9a2b-000000000414',
  l.id,
  'peel_response',
  'PEEL response: Alexander II wider reforms',
  'AO1 explanation and judgement',
  'secure',
  12,
  '{"question":"Explain one way in which Alexander II modernised Russia through reform."}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1870-4261-9a2b-000000000415',
  l.id,
  'confidence_exit_ticket',
  'Confidence check: Alexander II wider reforms',
  'Reflection and metacognition',
  'secure',
  5,
  '{"prompt":"How confident are you explaining Alexander II’s wider reforms?"}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket'
)
limit 1;
