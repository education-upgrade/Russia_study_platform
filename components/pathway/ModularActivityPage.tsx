import Link from 'next/link';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityRouteSlug, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import styles from '@/app/student/lesson/1905/flashcards/page.module.css';

type Activity = {
  id: string;
  title: string;
  activity_type: string;
  content_json: any;
};

type Props = {
  pathwaySlug: string;
  activitySlug: string;
  fallbackContentByActivityType?: Record<string, any>;
};

function orderActivities(activities: Activity[]) {
  const types = orderSupportedActivityTypes(activities.map((activity) => activity.activity_type));
  return types
    .map((type) => activities.find((activity) => activity.activity_type === type))
    .filter(Boolean) as Activity[];
}

function getActivityTypeFromSlug(activitySlug: string, activities: Activity[]) {
  return activities.find((activity) => getActivityRouteSlug(activity.activity_type) === activitySlug)?.activity_type ?? null;
}

function getNextHref(routeBase: string, activities: Activity[], currentActivityType: string) {
  const ordered = orderActivities(activities).filter((activity) => activity.activity_type !== 'lesson_content');
  const currentIndex = ordered.findIndex((activity) => activity.activity_type === currentActivityType);
  const nextActivity = currentIndex === -1 ? null : ordered[currentIndex + 1];
  return nextActivity ? `${routeBase}/${getActivityRouteSlug(nextActivity.activity_type)}` : undefined;
}

async function loadActivities(pathwaySlug: string) {
  const config = getPathwayConfig(pathwaySlug);
  if (!supabase) return { activities: [] as Activity[], error: 'Supabase is not configured.' };

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', config.lessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (!lesson) return { activities: [] as Activity[], error: 'Lesson not found.' };

  const { data, error } = await supabase
    .from('activities')
    .select('id, title, activity_type, content_json')
    .eq('lesson_id', lesson.id);

  return { activities: (data ?? []) as Activity[], error: error?.message ?? '' };
}

export default async function ModularActivityPage({ pathwaySlug, activitySlug, fallbackContentByActivityType = {} }: Props) {
  const config = getPathwayConfig(pathwaySlug);
  const { activities, error } = await loadActivities(pathwaySlug);
  const orderedActivities = orderActivities(activities);
  const activityType = getActivityTypeFromSlug(activitySlug, orderedActivities);

  if (!activityType) {
    return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={config.routeBase}>Return to pathway</Link></section></main>;
  }

  const activity = orderedActivities.find((item) => item.activity_type === activityType) ?? null;
  const nextHref = getNextHref(config.routeBase, orderedActivities, activityType);

  return (
    <main className={styles.shell}>
      {error && <section className="card warm"><h2>Activity not available</h2><p>{error}</p></section>}
      {activity && (
        <section className={styles.panel}>
          <GenericActivityRenderer
            activityId={activity.id}
            activityType={activity.activity_type}
            content={activity.content_json ?? {}}
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
