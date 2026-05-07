import Link from 'next/link';
import FlashcardActivity from '@/components/FlashcardActivity';
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

export default async function FlashcardsPage() {
  const { activity, error } = await getActivity('flashcards');

  return (
    <main className="page-shell activity-focus-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">1905 pathway / Flashcards</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/lesson/1905">Back to pathway</Link>
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
        </div>
      </div>

      <section className="activity-focus-hero warm">
        <div>
          <p className="eyebrow">Focused activity screen</p>
          <h1>{activity?.title ?? '1905 flashcards'}</h1>
          <p>Work through one card at a time. Reveal the answer, rate it honestly, then move on. This page is separated from the pathway to reduce scrolling and overload.</p>
        </div>
        <aside className="activity-focus-meta">
          <span className="badge">{activity?.estimated_minutes ?? 10} mins</span>
          <span className="badge">{activity?.skill_focus ?? 'Core evidence'}</span>
          {activity?.difficulty && <span className="badge">{activity.difficulty}</span>}
        </aside>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && Array.isArray(activity.content_json?.cards) && (
        <section className="activity-focus-card">
          <FlashcardActivity activityId={activity.id} cards={activity.content_json.cards} />
        </section>
      )}

      <section className="activity-bottom-nav">
        <Link className="button secondary" href="/student/lesson/1905/quiz">Previous: quiz</Link>
        <Link className="button" href="/student/lesson/1905/peel">Next: PEEL response</Link>
      </section>
    </main>
  );
}
