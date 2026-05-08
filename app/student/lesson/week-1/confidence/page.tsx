import Link from 'next/link';
import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
import { supabase } from '@/lib/supabase';
import { week1Russia1855ConfidenceContent } from '@/lib/week1Russia1855Content';
import styles from '../../1905/confidence/page.module.css';

type Activity = { id: string; title: string; skill_focus: string | null; difficulty: string | null; estimated_minutes: number | null; content_json: any; };
const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };
  const { data: lesson, error: lessonError } = await supabase.from('lessons').select('id').eq('title', LESSON_TITLE).single();
  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Week 1 lesson not found.' };
  const { data: activity, error } = await supabase.from('activities').select('id, title, skill_focus, difficulty, estimated_minutes, content_json').eq('lesson_id', lesson.id).eq('activity_type', activityType).single<Activity>();
  return { activity, error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Week1ConfidencePage() {
  const { activity, error } = await getActivity('confidence_exit_ticket');
  const content = activity?.content_json ?? {};
  const pageTitle = activity?.title?.replace(/^Confidence exit ticket:\s*/i, '').replace(/^Confidence check:\s*/i, '').replace(/^Exit ticket:\s*/i, '') ?? 'Russia in 1855';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.backLink} href="/student/lesson/week-1">← Pathway</Link><div className={styles.titleBlock}><p>Final reflection</p><h1>{pageTitle}</h1></div><Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link></div>
      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}
      {activity && <section className={styles.panel}><ConfidenceExitTicketActivity activityId={activity.id} prompt={content.prompt ?? week1Russia1855ConfidenceContent.prompt} scale={Array.isArray(content.scale) ? content.scale : undefined} leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : week1Russia1855ConfidenceContent.leastSecureOptions} /></section>}
      <section className={styles.footer}><Link href="/student/lesson/week-1/peel">Previous: PEEL response</Link><Link href="/student/lesson/week-1">Finish pathway →</Link></section>
    </main>
  );
}
