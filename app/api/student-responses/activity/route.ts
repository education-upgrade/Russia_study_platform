import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type ActivitySaveRequest = {
  activityId: string;
  responseType: string;
  response?: Record<string, unknown>;
  responseJson?: Record<string, unknown>;
  score?: number | null;
  status?: 'in_progress' | 'complete' | 'submitted';
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const body = (await request.json()) as ActivitySaveRequest;

  if (!body.activityId) {
    return NextResponse.json({ error: 'Missing activityId.' }, { status: 400 });
  }

  if (!body.responseType) {
    return NextResponse.json({ error: 'Missing responseType.' }, { status: 400 });
  }

  const responseStatus = body.status ?? 'complete';
  const now = new Date().toISOString();
  const responsePayload = body.response ?? body.responseJson ?? {};

  const rowPayload = {
    assignment_id: DEMO_ASSIGNMENT_ID,
    response_type: body.responseType,
    response_json: {
      ...responsePayload,
      status: responseStatus,
    },
    score: typeof body.score === 'number' ? body.score : null,
    status: responseStatus,
    last_saved_at: now,
    submitted_at: responseStatus === 'complete' || responseStatus === 'submitted' ? now : null,
  };

  const { data: existingRows, error: existingError } = await supabase
    .from('student_responses')
    .select('id')
    .eq('student_id', DEMO_STUDENT_ID)
    .eq('activity_id', body.activityId);

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const existingIds = (existingRows ?? []).map((row) => row.id);

  if (existingIds.length > 0) {
    const { error } = await supabase
      .from('student_responses')
      .update(rowPayload)
      .in('id', existingIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'updated', savedAt: now, updatedRows: existingIds.length, responseStatus });
  }

  const { error } = await supabase
    .from('student_responses')
    .insert({
      student_id: DEMO_STUDENT_ID,
      activity_id: body.activityId,
      started_at: now,
      ...rowPayload,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'created', savedAt: now, updatedRows: 1, responseStatus });
}
