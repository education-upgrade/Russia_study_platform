import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_TEACHER_ID = '11111111-1111-1111-1111-111111111111';
const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_CLASS_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEFAULT_PATHWAY_SLUG = '1905-revolution';
const DEFAULT_LESSON_TITLE = 'Was the 1905 Revolution a turning point for Tsarist Russia?';
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'flashcards', 'quiz', 'peel_response', 'confidence_exit_ticket'];

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson content',
  flashcards: 'Flashcards',
  quiz: 'Retrieval quiz',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence exit ticket',
};

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

type ClassRow = {
  id: string;
  class_name: string;
};

type LessonRow = {
  id: string;
  title: string;
};

function orderRequiredActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
  });
}

async function getClassStudents(classId: string) {
  if (!supabase) return [DEMO_STUDENT_ID];

  const { data, error } = await supabase
    .from('class_memberships')
    .select('student_id')
    .eq('class_id', classId)
    .eq('status', 'active');

  if (error || !data?.length) return [DEMO_STUDENT_ID];
  return data.map((row) => row.student_id as string);
}

async function getClassName(classId: string) {
  if (!supabase) return 'Year 12 Russia demo class';

  const { data, error } = await supabase
    .from('teacher_classes')
    .select('id, class_name')
    .eq('id', classId)
    .limit(1)
    .maybeSingle<ClassRow>();

  if (error || !data) return 'Year 12 Russia demo class';
  return data.class_name;
}

async function getLessonByTitle(lessonTitle: string) {
  if (!supabase) return { lesson: null, error: 'Supabase is not configured.' };

  const { data, error } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('title', lessonTitle)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) return { lesson: null, error: error.message };
  const lesson = Array.isArray(data) && data.length > 0 ? (data[0] as LessonRow) : null;
  return { lesson, error: lesson ? '' : `${lessonTitle} lesson not found. Run the seed SQL for this topic first.` };
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const body = (await request.json()) as GuidedStudyRequest;
  const pathwaySlug = body.pathwaySlug || DEFAULT_PATHWAY_SLUG;
  const lessonTitle = body.lessonTitle || DEFAULT_LESSON_TITLE;
  const requiredActivityTypes = orderRequiredActivityTypes(
    body.requiredActivityTypes?.length
      ? body.requiredActivityTypes
      : PATHWAY_ACTIVITY_ORDER
  );

  if (!body.mode) {
    return NextResponse.json({ error: 'Choose a guided study mode.' }, { status: 400 });
  }

  const invalidActivities = requiredActivityTypes.filter((activityType) => !activityLabels[activityType]);
  if (invalidActivities.length > 0) {
    return NextResponse.json({ error: `Unknown activity type: ${invalidActivities.join(', ')}` }, { status: 400 });
  }

  const { lesson, error: lessonError } = await getLessonByTitle(lessonTitle);

  if (lessonError || !lesson) {
    return NextResponse.json({ error: lessonError ?? `${lessonTitle} lesson not found.` }, { status: 500 });
  }

  const classId = body.classId || DEMO_CLASS_ID;
  const className = await getClassName(classId);
  const studentIds = body.studentIds?.length ? body.studentIds : await getClassStudents(classId);
  const firstStudentId = studentIds[0] ?? DEMO_STUDENT_ID;

  const assignmentPayload = {
    pathway_slug: pathwaySlug,
    lesson_title: lesson.title,
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

  const { data, error } = await supabase
    .from('guided_study_assignments')
    .insert(assignmentPayload)
    .select('id, created_at, recipient_count')
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      {
        error: error?.message ?? 'Assignment could not be created.',
        setupHint: 'If this mentions class_id, teacher_id or assigned_student_ids, run supabase/multi-class-platform.sql in Supabase SQL Editor.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'created',
    assignmentId: data.id,
    createdAt: data.created_at,
    recipientCount: data.recipient_count ?? studentIds.length,
    pathwaySlug,
    lessonTitle: lesson.title,
  });
}
