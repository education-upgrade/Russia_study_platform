import Link from 'next/link';
import FlashcardActivity from '@/components/FlashcardActivity';
import { supabase } from '@/lib/supabase';
import { alexanderIIReformLessonTitle, pathwayAlexanderIIReformFlashcards } from '@/lib/pathwayAlexanderIIReformContent';
import styles from '../../1905/flashcards/page.module.css';

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

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', alexanderIIReformLessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Alexander II reform lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .limit(1)
    .maybeSingle<Activity>();

  return { activity, error: error?.message ?? '' };
}

function cleanFlashcardTitle(title: string | undefined | null) {
  if (!title) return 'Alexander II reform key knowledge';
  return title.replace(/^Flashcards:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIReformFlashcardsPage() {
  const { activity, error } = await getActivity('flashcards');
  const pageTitle = cleanFlashcardTitle(activity?.title);
  const savedCards = Array.isArray(activity?.content_json?.cards) ? activity.content_json.cards : [];
  const cards = savedCards.length >= 10 ? savedCards : pathwayAlexanderIIReformFlashcards;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/alexander-ii-reform">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Recall deck</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && (
        <section className={styles.panel}>
          <FlashcardActivity activityId={activity.id} cards={cards} nextHref="/student/lesson/alexander-ii-reform/quiz" />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/alexander-ii-reform/lesson">Previous: lesson notes</Link>
        <span>Study the deck before completing the quiz.</span>
      </section>
    </main>
  );
}
