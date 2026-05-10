import Link from 'next/link';
import PeelResponseActivity from '@/components/PeelResponseActivity';
import { supabase } from '@/lib/supabase';
import { alexanderIIReformLessonTitle, pathwayAlexanderIIReformPeelContent } from '@/lib/pathwayAlexanderIIReformContent';
import styles from '../../1905/peel/page.module.css';

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

function cleanPeelTitle(title: string | undefined | null) {
  if (!title) return 'Alexander II reform writing practice';
  return title.replace(/^PEEL response:\s*/i, '').replace(/^PEEL:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIReformPeelPage() {
  const { activity, error } = await getActivity('peel_response');
  const content = activity?.content_json ?? {};
  const pageTitle = cleanPeelTitle(activity?.title);
  const scaffold = Array.isArray(content.scaffold) ? content.scaffold : pathwayAlexanderIIReformPeelContent.scaffold;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/alexander-ii-reform">← Pathway</Link>
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
            question={content.question ?? pathwayAlexanderIIReformPeelContent.question}
            stretchQuestion={content.stretchQuestion ?? pathwayAlexanderIIReformPeelContent.stretchQuestion}
            scaffold={scaffold}
            nextHref="/student/lesson/alexander-ii-reform/confidence"
          />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/alexander-ii-reform/quiz">Previous: quiz</Link>
        <span>Submit the PEEL response before completing the confidence check.</span>
      </section>
    </main>
  );
}
