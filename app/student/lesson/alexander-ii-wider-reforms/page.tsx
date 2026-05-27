import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityLabel, getActivityRouteSlug, isTrackableActivity } from '@/lib/activityTypeRegistry';
import { alexanderIIWiderReformsPathwaySlug, alexanderIIWiderReformsLessonTitle } from '@/lib/pathwayAlexanderIIWiderReformsContent';
import styles from '../1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
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

type Activity = { id: string; activity_type: string; title: string };
type Response = { activity_id: string; status: string; score: number | null; response_json: any };

function orderActivities(activities: Activity[]) {
  return [...activities].sort((first, second) => {
    const firstIndex = preferredActivityOrder.indexOf(first.activity_type);
    const secondIndex = preferredActivityOrder.indexOf(second.activity_type);
    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex);
  });
}

function getActivityHref(activityType: string) {
  if (activityType === 'lesson_content') return `${config.routeBase}/lesson`;
  return `${config.routeBase}/${getActivityRouteSlug(activityType)}`;
}

function isComplete(activityType: string, response: Response | undefined) {
  if (!isTrackableActivity(activityType)) return false;
  if (!response) return false;
  return response.status === 'complete' || response.status === 'submitted';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIWiderReformsPathwayPage() {
  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><h1>Supabase is not configured</h1></section></main>;
  }

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', alexanderIIWiderReformsLessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;

  if (!lesson) {
    return <main className={styles.shell}><section className={styles.mainCard}><h1>Lesson not found</h1><p>Run the Alexander II wider reforms seed.</p></section></main>;
  }

  const { data: activities } = await supabase
    .from('activities')
    .select('id, activity_type, title')
    .eq('lesson_id', lesson.id);

  const orderedActivities = orderActivities((activities ?? []) as Activity[]);
  const activityIds = orderedActivities.map((activity) => activity.id);

  const { data: responses } = activityIds.length
    ? await supabase
        .from('student_responses')
        .select('activity_id, status, score, response_json')
        .eq('student_id', DEMO_STUDENT_ID)
        .in('activity_id', activityIds)
    : { data: [] };

  const responseByActivityType = orderedActivities.reduce<Record<string, Response | undefined>>((acc, activity) => {
    acc[activity.activity_type] = (responses ?? []).find((response: Response) => response.activity_id === activity.id);
    return acc;
  }, {});

  const displayItems = orderedActivities.map((activity) => ({
    ...activity,
    href: getActivityHref(activity.activity_type),
    label: getActivityLabel(activity.activity_type),
    complete: isComplete(activity.activity_type, responseByActivityType[activity.activity_type]),
    trackable: isTrackableActivity(activity.activity_type),
  }));

  const nextItem = displayItems.find((item) => item.trackable && !item.complete) ?? null;
  const trackableItems = displayItems.filter((item) => item.trackable);
  const completedCount = trackableItems.filter((item) => item.complete).length;
  const progressPercentage = trackableItems.length ? Math.round((completedCount / trackableItems.length) * 100) : 0;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.navButton} href={config.routeBase}>← Pathway</Link>
        <div className={styles.topTitle}><span>Guided study route</span><strong>{config.title}</strong></div>
        <Link className={styles.navButton} href={nextItem?.href ?? config.routeBase}>Next</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.summary}>
          <p className={styles.eyebrow}>Independent pathway</p>
          <h1>{config.title}</h1>
          <p>Judge how far Alexander II modernised Russia through wider reform while preserving autocracy.</p>
        </header>

        <section className={styles.route}>
          <div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>
          <div className={styles.routeList}>
            {displayItems.map((item, index) => (
              <Link className={`${styles.routeItem} ${item.complete ? styles.complete : ''}`} href={item.href} key={item.id}>
                <span className={styles.routeMark}>{item.complete ? '✓' : index + 1}</span>
                <span className={styles.routeText}><strong>{item.label}</strong><span>{item.title}</span></span>
                <span className={styles.routeStatus}>{item.complete ? 'Done' : 'To do'}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
