import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.assignmentId || !body?.activityType) {
    return NextResponse.json({ error: 'Assignment and activity are required.' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('save_assignment_activity_progress', {
    assignment_id_input: body.assignmentId,
    activity_type_input: body.activityType,
    status_input: body.status ?? 'in_progress',
    score_input: body.score ?? null,
    max_score_input: body.maxScore ?? null,
    confidence_input: body.confidence ?? null,
    position_input: body.position ?? {},
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ progress: data });
}
