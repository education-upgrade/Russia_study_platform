import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type QuizSaveRequest = {
  activityId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  percentage: number;
  incorrectQuestionIds: string[];
  status?: 'in_progress' | 'complete';
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as QuizSaveRequest;

  if (!body.activityId) {
    return NextResponse.json(
      { error: 'Missing activityId.' },
      { status: 400 }
    );
  }

  const responseStatus = body.status === 'complete' ? 'complete' : 'in_progress';
  const now = new Date().toISOString();

  const responsePayload = {
    answers: body.answers,
    score: body.score,
    maxScore: body.maxScore,
    percentage: body.percentage,
    incorrectQuestionIds: body.incorrectQuestionIds,
    status: responseStatus,
  };

  const { data: existing } = await supabase
    .from('student_responses')
    .select('id')
    .eq('student_id', DEMO_STUDENT_ID)
    .eq('assignment_id', DEMO_ASSIGNMENT_ID)
    .eq('activity_id', body.activityId)
    .maybeSingle();

  const rowPayload = {
    response_type: 'quiz',
    response_json: responsePayload,
    score: body.score,
    status: responseStatus,
    last_saved_at: now,
    submitted_at: responseStatus === 'complete' ? now : null,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from('student_responses')
      .update(rowPayload)
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'updated', savedAt: now, responseStatus });
  }

  const { error } = await supabase
    .from('student_responses')
    .insert({
      student_id: DEMO_STUDENT_ID,
      assignment_id: DEMO_ASSIGNMENT_ID,
      activity_id: body.activityId,
      started_at: now,
      ...rowPayload,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'created', savedAt: now, responseStatus });
}
