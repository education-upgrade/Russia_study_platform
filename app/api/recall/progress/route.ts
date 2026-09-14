import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { recallQuestions, recallTopics } from '@/lib/recall/questions';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'student') return NextResponse.json({ error: 'Student access is required.' }, { status: 403 });

  const [{ data: stats, error: statsError }, { data: sessions, error: sessionError }] = await Promise.all([
    supabase
      .from('student_recall_question_stats')
      .select('question_id, topic_id, attempts, correct_count, consecutive_correct, last_result, last_seen_at')
      .eq('student_id', user.id),
    supabase
      .from('recall_sessions')
      .select('id, question_count, answered_count, score, status, completed_at, started_at')
      .eq('student_id', user.id)
      .order('started_at', { ascending: false })
      .limit(50),
  ]);

  if (statsError || sessionError) return NextResponse.json({ error: statsError?.message ?? sessionError?.message }, { status: 500 });

  const statRows = stats ?? [];
  const attempts = statRows.reduce((sum, row) => sum + row.attempts, 0);
  const correct = statRows.reduce((sum, row) => sum + row.correct_count, 0);
  const secureQuestions = statRows.filter((row) => row.consecutive_correct >= 3).length;
  const weakQuestions = statRows.filter((row) => row.attempts > 0 && (row.last_result === false || row.consecutive_correct < 2 || row.correct_count / row.attempts < 0.75)).length;

  const topicProgress = recallTopics.map((topic) => {
    const topicQuestions = recallQuestions.filter((question) => question.topicId === topic.id);
    const topicStats = statRows.filter((row) => row.topic_id === topic.id);
    const topicAttempts = topicStats.reduce((sum, row) => sum + row.attempts, 0);
    const topicCorrect = topicStats.reduce((sum, row) => sum + row.correct_count, 0);
    const secure = topicStats.filter((row) => row.consecutive_correct >= 3).length;
    return {
      ...topic,
      questionCount: topicQuestions.length,
      seen: topicStats.length,
      secure,
      accuracy: topicAttempts ? Math.round((topicCorrect / topicAttempts) * 100) : null,
    };
  });

  return NextResponse.json({
    totalQuestions: recallQuestions.length,
    questionsSeen: statRows.length,
    secureQuestions,
    weakQuestions,
    attempts,
    correct,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
    completedSessions: (sessions ?? []).filter((session) => session.status === 'complete').length,
    topicProgress,
    recentSessions: (sessions ?? []).slice(0, 5),
  });
}
