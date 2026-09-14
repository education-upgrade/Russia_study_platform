import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { gradeRecallAnswer } from '@/lib/recall/logic';
import { recallQuestionById } from '@/lib/recall/bank';

type AnswerRequest = { sessionId?: string; questionId?: string; answer?: unknown };
const REWARD_INTERVAL = 50;

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as AnswerRequest;
  if (!body.sessionId || !body.questionId) {
    return NextResponse.json({ error: 'Missing session or question.' }, { status: 400 });
  }

  const question = recallQuestionById.get(body.questionId);
  if (!question) return NextResponse.json({ error: 'Unknown recall question.' }, { status: 400 });

  const isCorrect = gradeRecallAnswer(question, body.answer);
  const { data, error } = await supabase.rpc('save_recall_answer_fast', {
    session_id_input: body.sessionId,
    question_id_input: question.id,
    topic_id_input: question.topicId,
    response_json_input: { answer: body.answer ?? null },
    is_correct_input: isCorrect,
  });

  if (error) {
    const message = error.message || 'Your answer could not be saved.';
    const status = message.includes('not found') ? 404 : message.includes('not part') ? 400 : message.includes('Student access') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  const saved = Array.isArray(data) ? data[0] : data;
  if (!saved) return NextResponse.json({ error: 'Your answer could not be saved.' }, { status: 500 });

  const rewardUnlocked = Boolean(saved.inserted_new)
    && isCorrect
    && saved.total_correct > 0
    && saved.total_correct % REWARD_INTERVAL === 0;

  return NextResponse.json({
    saved: true,
    isCorrect,
    correctAnswer: question.answerLabel,
    feedback: question.feedback,
    answeredCount: saved.answered_count,
    score: saved.score,
    complete: saved.complete,
    nextQuestionId: saved.next_question_id,
    totalCorrect: saved.total_correct,
    currentLevel: saved.current_level,
    rewardUnlocked,
  });
}
