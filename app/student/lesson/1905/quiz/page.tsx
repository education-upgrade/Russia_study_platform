import Link from 'next/link';
import QuizActivity from '@/components/QuizActivity';
import { supabase } from '@/lib/supabase';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? '1905 lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuizPage() {
  const { activity, error } = await getActivity('quiz');

  return (
    <main className="page-shell activity-focus-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">1905 pathway / Retrieval quiz</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/lesson/1905">Back to pathway</Link>
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
        </div>
      </div>

      <section className="activity-focus-hero lavender">
        <div>
          <p className="eyebrow">Focused activity screen</p>
          <h1>{activity?.title ?? '1905 retrieval quiz'}</h1>
          <p>Complete the quiz without notes first. The score saves as evidence for your teacher and helps decide what to revisit next.</p>
        </div>
        <aside className="activity-focus-meta">
          <span className="badge">{activity?.estimated_minutes ?? 10} mins</span>
          <span className="badge">{activity?.skill_focus ?? 'Retrieval practice'}</span>
          {activity?.difficulty && <span className="badge">{activity.difficulty}</span>}
        </aside>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && Array.isArray(activity.content_json?.questions) && (
        <section className="activity-focus-card">
          <QuizActivity activityId={activity.id} questions={activity.content_json.questions} />
        </section>
      )}

      <section className="activity-bottom-nav">
        <Link className="button secondary" href="/student/lesson/1905/lesson">Previous: lesson notes</Link>
        <Link className="button" href="/student/lesson/1905/flashcards">Next: flashcards</Link>
      </section>
    </main>
  );
}
