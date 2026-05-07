import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson content',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence exit ticket',
};

type GuidedStudyRequest = {
  mode: string;
  requiredActivityTypes: string[];
  deadlineAt?: string;
  instructions?: string;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const body = (await request.json()) as GuidedStudyRequest;
  const requiredActivityTypes = body.requiredActivityTypes?.length
    ? body.requiredActivityTypes
    : ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

  if (!body.mode) {
    return NextResponse.json({ error: 'Choose a guided study mode.' }, { status: 400 });
  }

  const invalidActivities = requiredActivityTypes.filter((activityType) => !activityLabels[activityType]);
  if (invalidActivities.length > 0) {
    return NextResponse.json({ error: `Unknown activity type: ${invalidActivities.join(', ')}` }, { status: 400 });
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json(
      { error: lessonError?.message ?? '1905 lesson not found. Run the lesson seed SQL first.' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('guided_study_assignments')
    .insert({
      pathway_slug: '1905-revolution',
      lesson_title: lesson.title,
      mode: body.mode,
      required_activity_types: requiredActivityTypes,
      deadline_at: body.deadlineAt || null,
      instructions: body.instructions || null,
      assigned_student_id: DEMO_STUDENT_ID,
      assigned_class: 'Year 12 Russia demo class',
      status: 'active',
    })
    .select('id, created_at')
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        setupHint: 'If this mentions guided_study_assignments, run supabase/guided-study-assignments.sql in Supabase SQL Editor.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: 'created', assignmentId: data.id, createdAt: data.created_at });
}
