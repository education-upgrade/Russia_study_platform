-- Seed: Alexander II essay skills pathway

insert into lessons (id, title, enquiry_question, estimated_minutes)
select
  'c2b8f20e-1858-4261-9a2b-000000000701',
  'Alexander II essay skills',
  'How do we build a strong 25-mark judgement on Alexander II?',
  60
where not exists (
  select 1 from lessons where title = 'Alexander II essay skills'
);

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'c2b8f20e-1858-4261-9a2b-000000000711', l.id, 'lesson_content', 'Essay structure walkthrough', 'AO1 exam structure', 'stretch', 12, '{"sections":[]}'::jsonb
from lessons l
where l.title = 'Alexander II essay skills'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'lesson_content')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'c2b8f20e-1858-4261-9a2b-000000000712', l.id, 'exam_planning', '25-mark planning grid', 'Planning and judgement', 'stretch', 12, '{"question":"Alexander II’s reforms were driven mainly by fear of revolution. Assess the validity of this view.","planningGrid":[]}'::jsonb
from lessons l
where l.title = 'Alexander II essay skills'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'exam_planning')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'c2b8f20e-1858-4261-9a2b-000000000713', l.id, 'model_answer_analysis', 'Model paragraph analysis', 'AO1 analysis', 'stretch', 10, '{"paragraphs":[]}'::jsonb
from lessons l
where l.title = 'Alexander II essay skills'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'model_answer_analysis')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'c2b8f20e-1858-4261-9a2b-000000000714', l.id, 'peel_response', 'Write a PEEL paragraph', 'AO1 written argument', 'stretch', 18, '{"question":"How far were Alexander II’s reforms genuine attempts to modernise Russia?","sentenceStarters":[]}'::jsonb
from lessons l
where l.title = 'Alexander II essay skills'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'peel_response')
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select 'c2b8f20e-1858-4261-9a2b-000000000715', l.id, 'confidence_exit_ticket', 'Essay confidence reflection', 'Metacognition', 'stretch', 5, '{"prompt":"How confident are you planning and structuring a 25-mark Russia essay?"}'::jsonb
from lessons l
where l.title = 'Alexander II essay skills'
and not exists (select 1 from activities a where a.lesson_id = l.id and a.activity_type = 'confidence_exit_ticket')
limit 1;
