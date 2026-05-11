-- Seed: Crimean War pathway
-- Safe isolated insert for lesson + five activities only.

insert into lessons (
  id,
  title,
  enquiry_question,
  estimated_minutes
)
select
  'a2b8f20e-1856-4261-9a2b-000000000501',
  'Why did the Crimean War expose the weaknesses of Tsarist Russia?',
  'Why did the Crimean War expose the weaknesses of Tsarist Russia?',
  45
where not exists (
  select 1 from lessons
  where title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
);

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1856-4261-9a2b-000000000511',
  l.id,
  'lesson_content',
  'Lesson notes: The Crimean War',
  'AO1 contextual understanding',
  'secure',
  12,
  '{"sections":[]}'::jsonb
from lessons l
where l.title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1856-4261-9a2b-000000000512',
  l.id,
  'flashcards',
  'Flashcards: The Crimean War',
  'AO1 recall',
  'secure',
  10,
  '{"cards":[]}'::jsonb
from lessons l
where l.title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'flashcards'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1856-4261-9a2b-000000000513',
  l.id,
  'quiz',
  'Retrieval quiz: The Crimean War',
  'AO1 retrieval',
  'secure',
  8,
  '{"questions":[]}'::jsonb
from lessons l
where l.title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'quiz'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1856-4261-9a2b-000000000514',
  l.id,
  'peel_response',
  'PEEL response: Why did defeat expose weakness?',
  'AO1 explanation and judgement',
  'secure',
  12,
  '{"question":"Explain why defeat in the Crimean War exposed weakness in Tsarist Russia."}'::jsonb
from lessons l
where l.title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response'
)
limit 1;

insert into activities (
  id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json
)
select
  'a2b8f20e-1856-4261-9a2b-000000000515',
  l.id,
  'confidence_exit_ticket',
  'Confidence check: The Crimean War',
  'Reflection and metacognition',
  'secure',
  5,
  '{"prompt":"How confident are you explaining why the Crimean War exposed Russia’s weaknesses?"}'::jsonb
from lessons l
where l.title = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?'
and not exists (
  select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket'
)
limit 1;
