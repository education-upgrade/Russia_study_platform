-- Seed: Why serfdom had to end pathway (Week 4)
-- Safe isolated insert for lesson + five activities only.

insert into lessons (id, title, enquiry_question, estimated_minutes)
select
  'a2b8f20e-1858-4261-9a2b-000000000701',
  'Why did Alexander II decide serfdom had to end?',
  'Why did Alexander II decide serfdom had to end?',
  45
where not exists (
  select 1 from lessons where title = 'Why did Alexander II decide serfdom had to end?'
);

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1858-4261-9a2b-000000000711', l.id, 'lesson_content', 'Lesson notes: Why serfdom had to end', 'AO1 contextual understanding', 'secure', 12, '{"sections":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II decide serfdom had to end?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1858-4261-9a2b-000000000712', l.id, 'flashcards', 'Flashcards: Why serfdom had to end', 'AO1 recall', 'secure', 10, '{"cards":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II decide serfdom had to end?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'flashcards')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1858-4261-9a2b-000000000713', l.id, 'quiz', 'Retrieval quiz: Why serfdom had to end', 'AO1 retrieval', 'secure', 8, '{"questions":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II decide serfdom had to end?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'quiz')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1858-4261-9a2b-000000000714', l.id, 'peel_response', 'PEEL response: Why end serfdom?', 'AO1 explanation and judgement', 'secure', 12, '{"question":"Explain why Alexander II decided serfdom had to end. Which pressure was most significant?","stretchQuestion":"Economic pressure was the main reason for ending serfdom. Assess the validity of this view.","scaffold":[]}'::jsonb
from lessons l
where l.title = 'Why did Alexander II decide serfdom had to end?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1858-4261-9a2b-000000000715', l.id, 'confidence_exit_ticket', 'Confidence check: Why serfdom had to end', 'Reflection and metacognition', 'secure', 5, '{"prompt":"How confident are you explaining why Alexander II decided serfdom had to end?"}'::jsonb
from lessons l
where l.title = 'Why did Alexander II decide serfdom had to end?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket')
limit 1;
