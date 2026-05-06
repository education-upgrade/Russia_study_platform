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

  const responsePayload = {
    answers: body.answers,
    score: body.score,
    maxScore: body.maxScore,
    percentage: body.percentage,
    incorrectQuestionIds: body.incorrectQuestionIds,
  };

  const { data: existing } = await supabase
    .from('student_responses')
    .select('id')
    .eq('student_id', DEMO_STUDENT_ID)
    .eq('assignment_id', DEMO_ASSIGNMENT_ID)
    .eq('activity_id', body.activityId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing?.id) {
    const { error } = await supabase
      .from('student_responses')
      .update({
        response_type: 'quiz',
        response_json: responsePayload,
        score: body.score,
        status: 'complete',
        last_saved_at: now,
        submitted_at: now,
      })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'updated', savedAt: now });
  }

  const { error } = await supabase
    .from('student_responses')
    .insert({
      student_id: DEMO_STUDENT_ID,
      assignment_id: DEMO_ASSIGNMENT_ID,
      activity_id: body.activityId,
      response_type: 'quiz',
      response_json: responsePayload,
      score: body.score,
      status: 'complete',
      started_at: now,
      last_saved_at: now,
      submitted_at: now,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'created', savedAt: now });
}
