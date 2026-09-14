import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { recallQuestions, recallTopics } from '@/lib/recall/bank';

const REWARD_INTERVAL = 50;

export async function GET() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'student') return NextResponse.json({ error: 'Student access is required.' }, { status: 403 });
  const [{ data: stats, error: statsError }, { data: sessions, error: sessionError }, { data: recallTotals, error: totalsError }] = await Promise.all([
    supabase.from('student_recall_question_stats').select('question_id, topic_id, attempts, correct_count, consecutive_correct, last_result, last_seen_at').eq('student_id', user.id),
    supabase.from('recall_sessions').select('id, question_count, answered_count, score, status, completed_at, started_at').eq('student_id', user.id).order('started_at', { ascending: false }).limit(50),
    supabase.from('student_recall_stats').select('total_attempts, total_correct, current_level').eq('student_id', user.id).maybeSingle(),
  ]);
  if (statsError || sessionError || totalsError) return NextResponse.json({ error: statsError?.message ?? sessionError?.message ?? totalsError?.message }, { status: 500 });
  const statRows = stats ?? [];
  const derivedAttempts = statRows.reduce((sum, row) => sum + row.attempts, 0);
  const derivedCorrect = statRows.reduce((sum, row) => sum + row.correct_count, 0);
  const attempts = recallTotals?.total_attempts ?? derivedAttempts;
  const correct = recallTotals?.total_correct ?? derivedCorrect;
  const level = recallTotals?.current_level ?? Math.floor(correct / REWARD_INTERVAL) + 1;
  const nextRewardAt = level * REWARD_INTERVAL;
  const correctToNextReward = Math.max(0, nextRewardAt - correct);
  const rewardProgressPercent = Math.max(0, Math.min(100, ((correct - ((level - 1) * REWARD_INTERVAL)) / REWARD_INTERVAL) * 100));
  const secureQuestions = statRows.filter((row) => row.consecutive_correct >= 3).length;
  const weakQuestions = statRows.filter((row) => row.attempts > 0 && (row.last_result === false || row.consecutive_correct < 2 || row.correct_count / row.attempts < 0.75)).length;
  const topicProgress = recallTopics.map((topic) => {
    const topicQuestions = recallQuestions.filter((question) => question.topicId === topic.id);
    const topicStats = statRows.filter((row) => row.topic_id === topic.id);
    const topicAttempts = topicStats.reduce((sum, row) => sum + row.attempts, 0);
    const topicCorrect = topicStats.reduce((sum, row) => sum + row.correct_count, 0);
    const secure = topicStats.filter((row) => row.consecutive_correct >= 3).length;
    return { ...topic, questionCount: topicQuestions.length, seen: topicStats.length, secure, accuracy: topicAttempts ? Math.round((topicCorrect / topicAttempts) * 100) : null };
  });
  return NextResponse.json({ totalQuestions: recallQuestions.length, questionsSeen: statRows.length, secureQuestions, weakQuestions, attempts, correct, accuracy: attempts ? Math.round((correct / attempts) * 100) : null, completedSessions: (sessions ?? []).filter((session) => session.status === 'complete').length, level, rewardInterval: REWARD_INTERVAL, nextRewardAt, correctToNextReward, rewardProgressPercent, topicProgress, recentSessions: (sessions ?? []).slice(0, 5) });
}
