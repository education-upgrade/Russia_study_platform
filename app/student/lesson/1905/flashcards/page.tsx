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
    <main className="page-shell activity-focus-shell flashcard-page-shell">
      <div className="flashcard-page-topbar">
        <Link className="flashcard-back-link" href="/student/lesson/1905">← Pathway</Link>
        <div>
          <p className="eyebrow">Flashcards</p>
          <h1>{activity?.title ?? '1905 Revolution key knowledge'}</h1>
        </div>
        <Link className="flashcard-dashboard-link" href="/student/dashboard">Dashboard</Link>
      </div>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && Array.isArray(activity.content_json?.cards) && (
        <section className="flashcard-fullscreen-panel">
          <FlashcardActivity activityId={activity.id} cards={activity.content_json.cards} />
        </section>
      )}

      <section className="flashcard-route-footer">
        <Link href="/student/lesson/1905/quiz">Previous: quiz</Link>
        <Link href="/student/lesson/1905/peel">Next: PEEL response →</Link>
      </section>
    </main>
  );
}
