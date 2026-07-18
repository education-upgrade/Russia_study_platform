import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getActivityLabel, isSupportedActivityType, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import '@/lib/unit6RegistryActivation';
import { pathwayRegistry } from '@/lib/pathwayRegistry';

const DEMO_TEACHER_ID = '11111111-1111-1111-1111-111111111111';
const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_CLASS_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEFAULT_PATHWAY_SLUG = 'russia-1855';
const DEFAULT_ACTIVITY_TYPES = [
  'lesson_content',
  'timeline',
  'flashcards',
  'quiz',
  'judgement_ranking',
  'ao3_interpretation',
  'peel_response',
  'confidence_exit_ticket',
];

type GuidedStudyRequest = {
  mode: string;
  requiredActivityTypes: string[];
  deadlineAt?: string;
  instructions?: string;
  classId?: string;
  studentIds?: string[];
  pathwaySlug?: string;
  lessonTitle?: string;
};

type ClassRow = { id: string; class_name: string };

function orderRequiredActivityTypes(activityTypes: string[]) {
  return orderSupportedActivityTypes(activityTypes.filter(isSupportedActivityType));
}

async function getClassStudents(classId: string) {
  if (!supabase) return [DEMO_STUDENT_ID];
  const { data, error } = await supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('status', 'active');
  if (error || !data?.length) return [DEMO_STUDENT_ID];
  return data.map((row) => row.student_id as string);
}

async function getClassName(classId: string) {
  if (!supabase) return 'Year 12 Russia demo class';
  const { data, error } = await supabase.from('teacher_classes').select('id, class_name').eq('id', classId).limit(1).maybeSingle<ClassRow>();
  if (error || !data) return 'Year 12 Russia demo class';
  return data.class_name;
}

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });

  const body = (await request.json()) as GuidedStudyRequest;
  const pathwaySlug = body.pathwaySlug || DEFAULT_PATHWAY_SLUG;
  const pathway = pathwayRegistry[pathwaySlug];
  const requestedTypes = body.requiredActivityTypes?.length ? body.requiredActivityTypes : DEFAULT_ACTIVITY_TYPES;
  const invalidActivities = requestedTypes.filter((activityType) => !isSupportedActivityType(activityType));

  if (!body.mode) return NextResponse.json({ error: 'Choose a guided study mode.' }, { status: 400 });
  if (!pathway) return NextResponse.json({ error: `Unknown pathway: ${pathwaySlug}` }, { status: 400 });
  if (invalidActivities.length > 0) return NextResponse.json({ error: `Unknown activity type: ${invalidActivities.join(', ')}` }, { status: 400 });

  const requiredActivityTypes = orderRequiredActivityTypes(requestedTypes);
  if (requiredActivityTypes.length === 0) return NextResponse.json({ error: 'Choose at least one supported activity.' }, { status: 400 });

  const classId = body.classId || DEMO_CLASS_ID;
  const className = await getClassName(classId);
  const studentIds = body.studentIds?.length ? body.studentIds : await getClassStudents(classId);
  const firstStudentId = studentIds[0] ?? DEMO_STUDENT_ID;

  const assignmentPayload = {
    pathway_slug: pathway.pathwaySlug,
    lesson_title: pathway.lessonTitle,
    mode: body.mode,
    required_activity_types: requiredActivityTypes,
    deadline_at: body.deadlineAt || null,
    instructions: body.instructions || null,
    assigned_student_id: firstStudentId,
    assigned_student_ids: studentIds,
    assigned_class: className,
    class_id: classId,
    teacher_id: DEMO_TEACHER_ID,
    recipient_count: studentIds.length,
    status: 'active',
  };

  const { data, error } = await supabase.from('guided_study_assignments').insert(assignmentPayload).select('id, created_at, recipient_count').limit(1).maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Assignment could not be created.', setupHint: 'If this mentions class_id, teacher_id or assigned_student_ids, run supabase/multi-class-platform.sql in Supabase SQL Editor.' }, { status: 500 });
  }

  return NextResponse.json({
    status: 'created',
    assignmentId: data.id,
    createdAt: data.created_at,
    recipientCount: data.recipient_count ?? studentIds.length,
    pathwaySlug: pathway.pathwaySlug,
    lessonTitle: pathway.lessonTitle,
    requiredActivityTypes,
    route: requiredActivityTypes.map(getActivityLabel).join(' → '),
  });
}
