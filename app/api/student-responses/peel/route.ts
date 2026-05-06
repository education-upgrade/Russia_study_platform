import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type PeelSaveRequest = {
  activityId: string;
  question: string;
  point: string;
  evidence: string;
  explain: string;
  link: string;
  fullResponse: string;
  wordCount: number;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as PeelSaveRequest;

  if (!body.activityId) {
    return NextResponse.json({ error: 'Missing activityId.' }, { status: 400 });
  }

  const hasAnyWriting = [body.point, body.evidence, body.explain, body.link, body.fullResponse]
    .some((value) => value && value.trim().length > 0);

  if (!hasAnyWriting) {
    return NextResponse.json({ error: 'Write something before submitting your PEEL response.' }, { status: 400 });
  }

  const responsePayload = {
    question: body.question,
    point: body.point,
    evidence: body.evidence,
    explain: body.explain,
    link: body.link,
    fullResponse: body.fullResponse,
    wordCount: body.wordCount,
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
        response_type: 'peel_response',
        response_json: responsePayload,
        score: null,
        status: 'submitted',
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
      response_type: 'peel_response',
      response_json: responsePayload,
      score: null,
      status: 'submitted',
      started_at: now,
      last_saved_at: now,
      submitted_at: now,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'created', savedAt: now });
}
