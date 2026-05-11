import Link from 'next/link';
import LessonChunkActivity from '@/components/LessonChunkActivity';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { crimeanWarPathwaySlug, pathwayCrimeanWarLessonSections } from '@/lib/pathwayCrimeanWarContent';
import styles from '../../1905/lesson/page.module.css';

type Activity = { id: string; title: string; skill_focus: string | null; difficulty: string | null; estimated_minutes: number | null; content_json: any; };
const config = getPathwayConfig(crimeanWarPathwaySlug);

async function getActivity() {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.', enquiry: null };
  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id, enquiry_question').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Crimean War lesson not found.', enquiry: null };
  const { data: activity, error } = await supabase.from('activities').select('id, title, skill_focus, difficulty, estimated_minutes, content_json').eq('lesson_id', lesson.id).eq('activity_type', 'lesson_content').limit(1).maybeSingle<Activity>();
  return { activity, error: error?.message ?? '', enquiry: lesson.enquiry_question as string | null };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const { activity, error, enquiry } = await getActivity();
  const sections = Array.isArray(activity?.content_json?.sections) && activity.content_json.sections.length >= 5 ? activity.content_json.sections : pathwayCrimeanWarLessonSections;
  const title = activity?.title?.replace(/^Lesson notes:\s*/i, '') ?? 'The Crimean War';

  return <main className={styles.shell}><div className={styles.topbar}><Link className={styles.backLink} href={config.routeBase}>← Pathway</Link><div className={styles.titleBlock}><p>Chunked lesson</p><h1>{title}</h1></div><Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link></div><section className={styles.panel}>{error && <div className={styles.error}><strong>Activity not available:</strong> {error}</div>}{activity && <LessonChunkActivity activityId={activity.id} title={title} enquiry={enquiry ?? config.lessonTitle} sections={sections} estimatedMinutes={activity.estimated_minutes ?? 12} skillFocus={activity.skill_focus ?? 'AO1 contextual understanding'} difficulty={activity.difficulty ?? 'secure'} nextHref={`${config.routeBase}/flashcards`} nextLabel="Next: flashcards" />}</section></main>;
}
