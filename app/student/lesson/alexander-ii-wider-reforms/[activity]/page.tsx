import Link from 'next/link';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityRouteSlug } from '@/lib/activityTypeRegistry';
import {
  alexanderIIWiderReformsPathwaySlug,
  alexanderIIWiderReformsLessonTitle,
  pathwayAlexanderIIWiderReformsFlashcards,
  pathwayAlexanderIIWiderReformsQuizQuestions,
  pathwayAlexanderIIWiderReformsPeelContent,
  pathwayAlexanderIIWiderReformsConfidenceContent,
} from '@/lib/pathwayAlexanderIIWiderReformsContent';
import styles from '../../1905/flashcards/page.module.css';

const config = getPathwayConfig(alexanderIIWiderReformsPathwaySlug);

const preferredActivityOrder = [
  'lesson_content',
  'flashcards',
  'quiz',
  'judgement_ranking',
  'ao3_interpretation',
  'peel_response',
  'confidence_exit_ticket',
];

const fallbackContentByActivityType: Record<string, any> = {
  flashcards: { cards: pathwayAlexanderIIWiderReformsFlashcards },
  quiz: { questions: pathwayAlexanderIIWiderReformsQuizQuestions },
  peel_response: pathwayAlexanderIIWiderReformsPeelContent,
  confidence_exit_ticket: pathwayAlexanderIIWiderReformsConfidenceContent,
  judgement_ranking: {
    question: 'Rank Alexander II wider reforms from most to least significant.',
    factors: [
      { id: 'judicial', title: 'Judicial reform', detail: 'Modernised the court system.' },
      { id: 'military', title: 'Military reform', detail: 'Improved the army after the Crimean War.' },
      { id: 'zemstva', title: 'Zemstva reform', detail: 'Improved local administration but remained limited.' },
      { id: 'education', title: 'Education reform', detail: 'Expanded educational opportunity.' }
    ]
  },
  ao3_interpretation: {
    question: 'Assess the interpretations about modernisation under Alexander II.',
    interpretations: [
      { historian: 'Interpretation A', argument: 'Alexander II modernised Russia through reform.' },
      { historian: 'Interpretation B', argument: 'The reforms were significant but limited by autocracy.' }
    ]
  }
};

type Activity = {
  id: string;
  title: string;
  activity_type: string;
  content_json: any;
};

function getActivityTypeFromSlug(activitySlug: string) {
  return preferredActivityOrder.find((activityType) => getActivityRouteSlug(activityType) === activitySlug) ?? null;
}

function orderActivities(activities: Activity[]) {
  return [...activities].sort((first, second) => {
    const firstIndex = preferredActivityOrder.indexOf(first.activity_type);
    const secondIndex = preferredActivityOrder.indexOf(second.activity_type);
    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex);
  });
}

function getNextHref(activities: Activity[], currentActivityType: string) {
  const orderedActivities = orderActivities(activities).filter((activity) => activity.activity_type !== 'lesson_content');
  const currentIndex = orderedActivities.findIndex((activity) => activity.activity_type === currentActivityType);
  const nextActivity = currentIndex === -1 ? null : orderedActivities[currentIndex + 1];
  return nextActivity ? `${config.routeBase}/${getActivityRouteSlug(nextActivity.activity_type)}` : undefined;
}

async function getLessonActivities() {
  if (!supabase) return { activities: [], error: 'Supabase is not configured.' };

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', alexanderIIWiderReformsLessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (!lesson) return { activities: [], error: 'Lesson not found.' };

  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, title, activity_type, content_json')
    .eq('lesson_id', lesson.id);

  return { activities: (activities ?? []) as Activity[], error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIWiderReformsActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity: activitySlug } = await params;
  const activityType = getActivityTypeFromSlug(activitySlug);

  if (!activityType) {
    return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={config.routeBase}>Return to pathway</Link></section></main>;
  }

  const { activities, error } = await getLessonActivities();
  const activity = activities.find((item) => item.activity_type === activityType) ?? null;
  const content = activity?.content_json ?? {};
  const nextHref = getNextHref(activities, activityType);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href={config.routeBase}>← Pathway</Link>
        <div className={styles.titleBlock}><p>{activitySlug}</p><h1>{activity?.title ?? config.title}</h1></div>
        <Link className={styles.dashboardLink} href={config.routeBase}>Pathway</Link>
      </div>

      {error && <section className="card warm"><h2>Activity not available</h2><p>{error}</p></section>}

      {activity && (
        <section className={styles.panel}>
          <GenericActivityRenderer
            activityId={activity.id}
            activityType={activity.activity_type}
            content={content}
            routeBase={config.routeBase}
            pathwayTitle={config.title}
            nextHref={nextHref}
            fallbackContent={fallbackContentByActivityType[activity.activity_type]}
          />
        </section>
      )}
    </main>
  );
}
