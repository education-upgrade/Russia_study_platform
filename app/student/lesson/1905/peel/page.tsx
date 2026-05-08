import Link from 'next/link';
import PeelResponseActivity from '@/components/PeelResponseActivity';
import { supabase } from '@/lib/supabase';
import { pathway1905PeelContent } from '@/lib/pathway1905Content';
import styles from './page.module.css';

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

function cleanPeelTitle(title: string | undefined | null) {
  if (!title) return '1905 Revolution writing practice';
  return title.replace(/^PEEL response:\s*/i, '').replace(/^PEEL:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PeelPage() {
  const { activity, error } = await getActivity('peel_response');
  const content = activity?.content_json ?? {};
  const pageTitle = cleanPeelTitle(activity?.title);
  const scaffold = Array.isArray(content.scaffold) ? content.scaffold : pathway1905PeelContent.scaffold;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1905">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Writing task</p>
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
          <PeelResponseActivity
            activityId={activity.id}
            question={content.question ?? pathway1905PeelContent.question}
            stretchQuestion={content.stretchQuestion ?? pathway1905PeelContent.stretchQuestion}
            scaffold={scaffold}
          />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/1905/flashcards">Previous: flashcards</Link>
        <span>Submit the PEEL response to unlock the confidence check.</span>
      </section>
    </main>
  );
}
