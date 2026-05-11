-- Seed: Reform to preserve autocracy pathway

insert into lessons (id, title, enquiry_question, estimated_minutes)
select
  'b2b8f20e-1858-4261-9a2b-000000000701',
  'Reform to preserve autocracy',
  'To what extent were Alexander II reforms designed to preserve autocracy?',
  50
where not exists (
  select 1 from lessons where title = 'Reform to preserve autocracy'
);

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'b2b8f20e-1858-4261-9a2b-000000000711', l.id, 'lesson_content', 'Lesson notes: Reform to preserve autocracy', 'AO1 conceptual understanding', 'secure', 15, '{"sections":[]}'::jsonb
from lessons l
where l.title = 'Reform to preserve autocracy'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'b2b8f20e-1858-4261-9a2b-000000000712', l.id, 'timeline', 'Timeline: Reform and reaction', 'Chronology', 'secure', 10, '{"events":[]}'::jsonb
from lessons l
where l.title = 'Reform to preserve autocracy'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'timeline')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'b2b8f20e-1858-4261-9a2b-000000000713', l.id, 'card_sort', 'Card sort: Reform or repression?', 'Analysis', 'secure', 10, '{"cards":[]}'::jsonb
from lessons l
where l.title = 'Reform to preserve autocracy'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'card_sort')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'b2b8f20e-1858-4261-9a2b-000000000714', l.id, 'peel_response', 'PEEL response: Reform to preserve autocracy', 'AO1 judgement', 'secure', 10, '{"question":"Alexander II reformed in order to preserve autocracy. Assess the validity of this view.","scaffold":[]}'::jsonb
from lessons l
where l.title = 'Reform to preserve autocracy'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'b2b8f20e-1858-4261-9a2b-000000000715', l.id, 'confidence_exit_ticket', 'Confidence check: Reform and autocracy', 'Reflection', 'secure', 5, '{"prompt":"Can you explain how reform and autocracy coexisted under Alexander II?"}'::jsonb
from lessons l
where l.title = 'Reform to preserve autocracy'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket')
limit 1;
