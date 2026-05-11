-- Seed: Power, ideology and control pathway (Week 3)
-- Safe isolated insert for lesson + five activities only.

insert into lessons (id, title, enquiry_question, estimated_minutes)
select
  'a2b8f20e-1857-4261-9a2b-000000000601',
  'How did autocracy, Orthodoxy and nationality help control Russia?',
  'How did autocracy, Orthodoxy and nationality help control Russia?',
  45
where not exists (
  select 1 from lessons where title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
);

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1857-4261-9a2b-000000000611', l.id, 'lesson_content', 'Lesson notes: Power, ideology and control', 'AO1 contextual understanding', 'secure', 12, '{"sections":[]}'::jsonb
from lessons l
where l.title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1857-4261-9a2b-000000000612', l.id, 'flashcards', 'Flashcards: Power, ideology and control', 'AO1 recall', 'secure', 10, '{"cards":[]}'::jsonb
from lessons l
where l.title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'flashcards')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1857-4261-9a2b-000000000613', l.id, 'quiz', 'Retrieval quiz: Power, ideology and control', 'AO1 retrieval', 'secure', 8, '{"questions":[]}'::jsonb
from lessons l
where l.title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'quiz')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1857-4261-9a2b-000000000614', l.id, 'peel_response', 'PEEL response: How autocracy worked', 'AO1 explanation and judgement', 'secure', 12, '{"question":"Explain how autocracy worked in Tsarist Russia.","stretchQuestion":"Assess how far Orthodoxy and nationality strengthened autocracy.","scaffold":[]}'::jsonb
from lessons l
where l.title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'a2b8f20e-1857-4261-9a2b-000000000615', l.id, 'confidence_exit_ticket', 'Confidence check: Power, ideology and control', 'Reflection and metacognition', 'secure', 5, '{"prompt":"How confident are you explaining how autocracy, Orthodoxy and nationality helped control Russia?"}'::jsonb
from lessons l
where l.title = 'How did autocracy, Orthodoxy and nationality help control Russia?'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket')
limit 1;
