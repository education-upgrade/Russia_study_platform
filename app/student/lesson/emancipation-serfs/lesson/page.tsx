import Link from 'next/link';
import LessonChunkActivity from '@/components/LessonChunkActivity';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { emancipationSerfsPathwaySlug, pathwayEmancipationSerfsLessonSections } from '@/lib/pathwayEmancipationSerfsContent';
import styles from '../../1905/lesson/page.module.css';

type Activity = { id: string; title: string; skill_focus: string | null; difficulty: string | null; estimated_minutes: number | null; content_json: any; };
const config = getPathwayConfig(emancipationSerfsPathwaySlug);

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.', enquiry: null };
  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id, enquiry_question').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Emancipation lesson not found.', enquiry: null };
  const { data: activity, error } = await supabase.from('activities').select('id, title, skill_focus, difficulty, estimated_minutes, content_json').eq('lesson_id', lesson.id).eq('activity_type', activityType).limit(1).maybeSingle<Activity>();
  return { activity, error: error?.message ?? '', enquiry: lesson.enquiry_question as string | null };
}

function cleanLessonTitle(title: string | undefined | null) {
  if (!title) return 'Emancipation of the serfs';
  return title.replace(/^Lesson introduction:\s*/i, '').replace(/^Lesson notes:\s*/i, '').replace(/^Introduction:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmancipationSerfsLessonPage() {
  const { activity, error, enquiry } = await getActivity('lesson_content');
  const savedSections = Array.isArray(activity?.content_json?.sections) ? activity?.content_json.sections : [];
  const sections = savedSections.length >= 5 ? savedSections : pathwayEmancipationSerfsLessonSections;
  const pageTitle = cleanLessonTitle(activity?.title);
  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.backLink} href={config.routeBase}>← Pathway</Link><div className={styles.titleBlock}><p>Chunked lesson</p><h1>{pageTitle}</h1></div><Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link></div>
      <section className={styles.panel}>
        {error && <div className={styles.error}><strong>Activity not available:</strong> {error}</div>}
        {activity ? <LessonChunkActivity activityId={activity.id} title={pageTitle} enquiry={enquiry ?? config.lessonTitle} sections={sections} estimatedMinutes={activity.estimated_minutes ?? 12} skillFocus={activity.skill_focus ?? 'AO1 contextual understanding'} difficulty={activity.difficulty ?? 'secure'} nextHref={`${config.routeBase}/flashcards`} nextLabel="Next: flashcards" /> : <article className={styles.fallbackCard}><h2>{pageTitle}</h2><p>The lesson activity could not be loaded yet.</p><Link className={styles.primaryButton} href={config.routeBase}>Return to pathway</Link></article>}
      </section>
    </main>
  );
}
