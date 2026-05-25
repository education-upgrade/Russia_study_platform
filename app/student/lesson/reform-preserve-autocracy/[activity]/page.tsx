import Link from 'next/link';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityRouteSlug } from '@/lib/activityTypeRegistry';
import {
  reformPreserveAutocracyPathwaySlug,
  reformPreserveAutocracySeedLessonTitle,
  pathwayReformPreserveAutocracyTimelineContent,
  pathwayReformPreserveAutocracyCardSortContent,
  pathwayReformPreserveAutocracyPeelContent,
  pathwayReformPreserveAutocracyConfidenceContent,
} from '@/lib/pathwayReformPreserveAutocracyContent';
import styles from '../../1905/flashcards/page.module.css';

type Activity = {
  id: string;
  title: string;
  activity_type: string;
  content_json: any;
};

const config = getPathwayConfig(reformPreserveAutocracyPathwaySlug);

const preferredActivityOrder = [
  'lesson_content',
  'timeline',
  'card_sort',
  'peel_response',
  'confidence_exit_ticket',
];

const fallbackContentByActivityType: Record<string, any> = {
  timeline: pathwayReformPreserveAutocracyTimelineContent,
  card_sort: pathwayReformPreserveAutocracyCardSortContent,
  peel_response: pathwayReformPreserveAutocracyPeelContent,
  confidence_exit_ticket: pathwayReformPreserveAutocracyConfidenceContent,
};

function getActivityTypeFromSlug(activitySlug: string) {
  return preferredActivityOrder.find((activityType) => getActivityRouteSlug(activityType) === activitySlug) ?? null;
}

function orderActivities(activities: Activity[]) {
  return [...activities].sort((first, second) => {
    const firstIndex = preferredActivityOrder.indexOf(first.activity_type);
    const secondIndex = preferredActivityOrder.indexOf(second.activity_type);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
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

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', reformPreserveAutocracySeedLessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return { activities: [], error: lessonError?.message ?? 'Lesson not found. Run the reform preserve autocracy seed.' };

  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, title, activity_type, content_json')
    .eq('lesson_id', lesson.id);

  return { activities: (activities ?? []) as Activity[], error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReformPreserveAutocracyActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity: activitySlug } = await params;
  const activityType = getActivityTypeFromSlug(activitySlug);

  if (!activityType) {
    return (
      <main className={styles.shell}>
        <section className="card warm">
          <h1>Activity not found</h1>
          <p>This activity is not part of the approved pathway structure.</p>
          <Link href={config.routeBase}>Return to pathway</Link>
        </section>
      </main>
    );
  }

  const { activities, error } = await getLessonActivities();
  const activity = activities.find((item) => item.activity_type === activityType) ?? null;
  const content = activity?.content_json ?? {};
  const title = activity?.title ?? config.title;
  const nextHref = getNextHref(activities, activityType);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href={config.routeBase}>← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>{activitySlug}</p>
          <h1>{title}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {!error && !activity && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not seeded yet</h2>
          <p>The route exists, but this activity row has not been found in Supabase.</p>
          <Link href={config.routeBase}>Return to pathway</Link>
        </section>
      )}

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
