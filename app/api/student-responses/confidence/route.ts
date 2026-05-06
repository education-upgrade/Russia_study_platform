import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type ConfidenceSaveRequest = {
  activityId: string;
  prompt: string;
  confidence: number;
  leastSecureArea: string;
  reflection: string;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured.' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as ConfidenceSaveRequest;

  if (!body.activityId) {
    return NextResponse.json({ error: 'Missing activityId.' }, { status: 400 });
  }

  if (!body.confidence || body.confidence < 1 || body.confidence > 5) {
    return NextResponse.json({ error: 'Choose a confidence score from 1 to 5.' }, { status: 400 });
  }

  if (!body.leastSecureArea) {
    return NextResponse.json({ error: 'Choose the area you feel least secure on.' }, { status: 400 });
  }

  const responsePayload = {
    prompt: body.prompt,
    confidence: body.confidence,
    leastSecureArea: body.leastSecureArea,
    reflection: body.reflection,
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
        response_type: 'confidence_exit_ticket',
        response_json: responsePayload,
        score: body.confidence,
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
      response_type: 'confidence_exit_ticket',
      response_json: responsePayload,
      score: body.confidence,
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
