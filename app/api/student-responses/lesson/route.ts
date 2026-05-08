import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const DEMO_ASSIGNMENT_ID = '44444444-4444-4444-4444-444444444444';

type LessonSaveRequest = {
  activityId: string;
  answers: Record<string, string>;
  currentSection: number;
  totalSections: number;
  finished: boolean;
  sectionHeadings?: string[];
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const body = (await request.json()) as LessonSaveRequest;

  if (!body.activityId) {
    return NextResponse.json({ error: 'Missing activityId.' }, { status: 400 });
  }

  if (!body.totalSections || body.totalSections < 1) {
    return NextResponse.json({ error: 'Missing lesson section count.' }, { status: 400 });
  }

  const answers = body.answers ?? {};
  const completedAnswers = Object.values(answers).filter((answer) => String(answer ?? '').trim().length >= 8).length;
  const completionPercentage = Math.round((completedAnswers / body.totalSections) * 100);
  const status = body.finished || completedAnswers >= body.totalSections ? 'complete' : 'in_progress';
  const now = new Date().toISOString();

  const responsePayload = {
    answers,
    sectionHeadings: body.sectionHeadings ?? [],
    currentSection: body.currentSection,
    totalSections: body.totalSections,
    completedAnswers,
    completionPercentage,
    finished: body.finished,
  };

  const { data: existing } = await supabase
    .from('student_responses')
    .select('id')
    .eq('student_id', DEMO_STUDENT_ID)
    .eq('assignment_id', DEMO_ASSIGNMENT_ID)
    .eq('activity_id', body.activityId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('student_responses')
      .update({
        response_type: 'lesson_content',
        response_json: responsePayload,
        score: completedAnswers,
        status,
        last_saved_at: now,
        submitted_at: status === 'complete' ? now : null,
      })
      .eq('id', existing.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: 'updated', savedAt: now, ...responsePayload });
  }

  const { error } = await supabase
    .from('student_responses')
    .insert({
      student_id: DEMO_STUDENT_ID,
      assignment_id: DEMO_ASSIGNMENT_ID,
      activity_id: body.activityId,
      response_type: 'lesson_content',
      response_json: responsePayload,
      score: completedAnswers,
      status,
      started_at: now,
      last_saved_at: now,
      submitted_at: status === 'complete' ? now : null,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ status: 'created', savedAt: now, ...responsePayload });
}
