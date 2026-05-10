import Link from 'next/link';
import FlashcardActivity from '@/components/FlashcardActivity';
import QuizActivity from '@/components/QuizActivity';
import PeelResponseActivity from '@/components/PeelResponseActivity';
import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import {
  emancipationSerfsPathwaySlug,
  pathwayEmancipationSerfsFlashcards,
  pathwayEmancipationSerfsQuizQuestions,
  pathwayEmancipationSerfsPeelContent,
  pathwayEmancipationSerfsConfidenceContent,
} from '@/lib/pathwayEmancipationSerfsContent';
import styles from '../../1905/flashcards/page.module.css';

type Activity = { id: string; title: string; content_json: any; };
const config = getPathwayConfig(emancipationSerfsPathwaySlug);
const activityTypeMap: Record<string, string> = { flashcards: 'flashcards', quiz: 'quiz', peel: 'peel_response', confidence: 'confidence_exit_ticket' };

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };
  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Emancipation lesson not found.' };
  const { data: activity, error } = await supabase.from('activities').select('id, title, content_json').eq('lesson_id', lesson.id).eq('activity_type', activityType).limit(1).maybeSingle<Activity>();
  return { activity, error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmancipationActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity: activitySlug } = await params;
  const activityType = activityTypeMap[activitySlug];
  if (!activityType) return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={config.routeBase}>Return to pathway</Link></section></main>;

  const { activity, error } = await getActivity(activityType);
  const content = activity?.content_json ?? {};
  const title = activity?.title?.replace(/^Flashcards:\s*/i, '').replace(/^Retrieval quiz:\s*/i, '').replace(/^PEEL response:\s*/i, '').replace(/^Confidence check:\s*/i, '') ?? config.title;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.backLink} href={config.routeBase}>← Pathway</Link><div className={styles.titleBlock}><p>{activitySlug}</p><h1>{title}</h1></div><Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link></div>
      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}
      {activity && activitySlug === 'flashcards' && <section className={styles.panel}><FlashcardActivity activityId={activity.id} cards={Array.isArray(content.cards) && content.cards.length >= 10 ? content.cards : pathwayEmancipationSerfsFlashcards} nextHref={`${config.routeBase}/quiz`} /></section>}
      {activity && activitySlug === 'quiz' && <section className={styles.panel}><QuizActivity activityId={activity.id} questions={Array.isArray(content.questions) && content.questions.length >= 10 ? content.questions : pathwayEmancipationSerfsQuizQuestions} nextHref={`${config.routeBase}/peel`} /></section>}
      {activity && activitySlug === 'peel' && <section className={styles.panel}><PeelResponseActivity activityId={activity.id} question={content.question ?? pathwayEmancipationSerfsPeelContent.question} stretchQuestion={content.stretchQuestion ?? pathwayEmancipationSerfsPeelContent.stretchQuestion} scaffold={Array.isArray(content.scaffold) ? content.scaffold : pathwayEmancipationSerfsPeelContent.scaffold} nextHref={`${config.routeBase}/confidence`} /></section>}
      {activity && activitySlug === 'confidence' && <section className={styles.panel}><ConfidenceExitTicketActivity activityId={activity.id} prompt={content.prompt ?? pathwayEmancipationSerfsConfidenceContent.prompt} scale={Array.isArray(content.scale) ? content.scale : pathwayEmancipationSerfsConfidenceContent.scale} leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : pathwayEmancipationSerfsConfidenceContent.leastSecureOptions} /></section>}
    </main>
  );
}
