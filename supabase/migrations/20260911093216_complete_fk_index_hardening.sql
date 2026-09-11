-- Complete foreign-key index coverage and remove redundant indexes.

create index if not exists assignment_activities_activity_idx on public.assignment_activities(activity_id);
create index if not exists assignment_activities_assignment_idx on public.assignment_activities(assignment_id);
create index if not exists assignments_class_idx on public.assignments(class_id);
create index if not exists assignments_teacher_idx on public.assignments(teacher_id);
create index if not exists classes_course_idx on public.classes(course_id);
create index if not exists classes_teacher_idx on public.classes(teacher_id);
create index if not exists student_responses_assignment_idx on public.student_responses(assignment_id);
create index if not exists teacher_classes_teacher_idx on public.teacher_classes(teacher_id);

drop index if exists public.ux_course_units_course_order;
drop index if exists public.idx_guided_study_assignments_class_id;
drop index if exists public.ux_study_pathways_slug;
