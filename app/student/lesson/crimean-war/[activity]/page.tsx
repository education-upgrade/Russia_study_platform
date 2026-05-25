import Link from 'next/link';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { crimeanWarPathwaySlug, pathwayCrimeanWarFlashcards, pathwayCrimeanWarQuizQuestions, pathwayCrimeanWarPeelContent, pathwayCrimeanWarConfidenceContent } from '@/lib/pathwayCrimeanWarContent';
import styles from '../../1905/flashcards/page.module.css';

type Activity = { id: string; title: string; content_json: any; };
const config = getPathwayConfig(crimeanWarPathwaySlug);
const activityTypeMap: Record<string, string> = { flashcards: 'flashcards', quiz: 'quiz', peel: 'peel_response', confidence: 'confidence_exit_ticket' };
const nextHrefByType: Record<string, string | undefined> = { flashcards: `${config.routeBase}/quiz`, quiz: `${config.routeBase}/peel`, peel_response: `${config.routeBase}/confidence`, confidence_exit_ticket: undefined };
const fallbackByType: Record<string, any> = { flashcards: { cards: pathwayCrimeanWarFlashcards }, quiz: { questions: pathwayCrimeanWarQuizQuestions }, peel_response: pathwayCrimeanWarPeelContent, confidence_exit_ticket: pathwayCrimeanWarConfidenceContent };

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };
  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Lesson not found.' };
  const { data: activity, error } = await supabase.from('activities').select('id, title, content_json').eq('lesson_id', lesson.id).eq('activity_type', activityType).limit(1).maybeSingle<Activity>();
  return { activity, error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ activity: string }> }) {
  const { activity: activitySlug } = await params;
  const activityType = activityTypeMap[activitySlug];
  if (!activityType) return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={config.routeBase}>Return to pathway</Link></section></main>;

  const { activity, error } = await getActivity(activityType);
  const content = activity?.content_json ?? {};
  const title = activity?.title ?? config.title;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.backLink} href={config.routeBase}>← Pathway</Link><div className={styles.titleBlock}><p>{activitySlug}</p><h1>{title}</h1></div><Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link></div>
      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}
      {activity && <section className={styles.panel}><GenericActivityRenderer activityId={activity.id} activityType={activityType} content={content} routeBase={config.routeBase} pathwayTitle={config.title} nextHref={nextHrefByType[activityType]} fallbackContent={fallbackByType[activityType]} /></section>}
    </main>
  );
}
