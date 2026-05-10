import Link from 'next/link';
import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
import { supabase } from '@/lib/supabase';
import { alexanderIIReformLessonTitle, pathwayAlexanderIIReformConfidenceContent } from '@/lib/pathwayAlexanderIIReformContent';
import styles from '../../1905/confidence/page.module.css';

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
    .eq('title', alexanderIIReformLessonTitle)
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Alexander II reform lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '' };
}

function cleanConfidenceTitle(title: string | undefined | null) {
  if (!title) return 'Alexander II reform';
  return title
    .replace(/^Confidence exit ticket:\s*/i, '')
    .replace(/^Confidence check:\s*/i, '')
    .replace(/^Exit ticket:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIReformConfidencePage() {
  const { activity, error } = await getActivity('confidence_exit_ticket');
  const content = activity?.content_json ?? {};
  const pageTitle = cleanConfidenceTitle(activity?.title);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/alexander-ii-reform">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Final reflection</p>
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
          <ConfidenceExitTicketActivity
            activityId={activity.id}
            prompt={content.prompt ?? pathwayAlexanderIIReformConfidenceContent.prompt}
            scale={Array.isArray(content.scale) ? content.scale : pathwayAlexanderIIReformConfidenceContent.scale}
            leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : pathwayAlexanderIIReformConfidenceContent.leastSecureOptions}
          />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/alexander-ii-reform/peel">Previous: PEEL response</Link>
        <Link href="/student/lesson/alexander-ii-reform">Finish pathway →</Link>
      </section>
    </main>
  );
}
