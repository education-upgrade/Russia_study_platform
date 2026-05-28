import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityLabel, getActivityRouteSlug, isTrackableActivity, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import styles from '@/app/student/lesson/1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

type Activity = {
  id: string;
  activity_type: string;
  title: string;
};

type Response = {
  activity_id: string;
  status: string;
  score: number | null;
  response_json: any;
};

type Assignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
};

type ModularPathwayPageProps = {
  pathwaySlug: string;
  fallbackInstructions?: string;
};

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActivityHref(routeBase: string, activityType: string) {
  return `${routeBase}/${getActivityRouteSlug(activityType)}`;
}

function isComplete(activityType: string, response: Response | undefined) {
  if (!isTrackableActivity(activityType)) return false;
  if (!response) return false;

  if (activityType === 'flashcards') {
    const json = response.response_json ?? {};
    const ratedCount = Number(json.ratedCount ?? 0);
    const totalCards = Number(json.totalCards ?? 0);
    return response.status === 'complete' || (totalCards > 0 && ratedCount >= totalCards);
  }

  return response.status === 'complete' || response.status === 'submitted';
}

function getLatestResponseByActivityType(activities: Activity[], responses: Response[]) {
  return activities.reduce<Record<string, Response | undefined>>((acc, activity) => {
    acc[activity.activity_type] = responses.find((response) => response.activity_id === activity.id);
    return acc;
  }, {});
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ModularPathwayPage({ pathwaySlug, fallbackInstructions }: ModularPathwayPageProps) {
  const config = getPathwayConfig(pathwaySlug);

  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><h1>Supabase is not configured</h1></section></main>;
  }

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', config.lessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;

  if (lessonError || !lesson) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <div className={styles.summary}>
            <p className={styles.eyebrow}>Student pathway</p>
            <h1>{config.title} not found</h1>
            <p>{lessonError?.message ?? `Run the ${config.title} Supabase seed file.`}</p>
          </div>
        </section>
      </main>
    );
  }

  const { data: assignmentData } = await supabase
    .from('guided_study_assignments')
    .select('id, mode, required_activity_types, deadline_at, instructions')
    .eq('assigned_student_id', DEMO_STUDENT_ID)
    .eq('status', 'active')
    .eq('pathway_slug', pathwaySlug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<Assignment>();

  const assignment = assignmentData ?? null;

  const { data: activities } = await supabase
    .from('activities')
    .select('id, activity_type, title')
    .eq('lesson_id', lesson.id);

  const lessonActivities = (activities ?? []) as Activity[];
  const seededActivityTypes = lessonActivities.map((activity) => activity.activity_type);
  const assignmentActivityTypes = assignment?.required_activity_types?.length ? assignment.required_activity_types : [];
  const activityTypes = orderSupportedActivityTypes(Array.from(new Set([...seededActivityTypes, ...assignmentActivityTypes])));

  const orderedActivities = activityTypes
    .map((activityType) => lessonActivities.find((activity) => activity.activity_type === activityType))
    .filter(Boolean) as Activity[];

  const activityIds = orderedActivities.map((activity) => activity.id);

  const { data: responseRows } = activityIds.length
    ? await supabase
        .from('student_responses')
        .select('activity_id, status, score, response_json')
        .eq('student_id', DEMO_STUDENT_ID)
        .in('activity_id', activityIds)
    : { data: [] };

  const responseByActivityType = getLatestResponseByActivityType(orderedActivities, (responseRows ?? []) as Response[]);

  const routeItems = orderedActivities.map((activity) => ({
    ...activity,
    href: getActivityHref(config.routeBase, activity.activity_type),
    label: getActivityLabel(activity.activity_type),
    complete: isComplete(activity.activity_type, responseByActivityType[activity.activity_type]),
    trackable: isTrackableActivity(activity.activity_type),
  }));

  const trackableItems = routeItems.filter((item) => item.trackable);
  const completedCount = trackableItems.filter((item) => item.complete).length;
  const progressPercentage = trackableItems.length ? Math.round((completedCount / trackableItems.length) * 100) : 0;
  const nextItem = routeItems.find((item) => item.trackable && !item.complete) ?? null;

  return (
    <main className={styles.shell}>
      <section className={styles.mainCard}>
        <header className={styles.summary}>
          <p className={styles.eyebrow}>{assignment ? 'Teacher-set pathway' : 'Independent pathway'}</p>
          <h1>{config.title}</h1>
          <p>{assignment?.instructions ?? fallbackInstructions ?? 'Complete one task at a time. Use the pathway to build knowledge, judgement and confidence.'}</p>
          <div className={styles.metaRow}>
            <span className={styles.pill}>{assignment ? formatMode(assignment.mode) : 'practice mode'}</span>
            <span className={styles.pill}>{formatDate(assignment?.deadline_at ?? null)}</span>
            <span className={styles.pill}>{completedCount}/{trackableItems.length} evidence tasks</span>
          </div>
        </header>

        <section className={styles.nextPanel}>
          <div>
            <p className={styles.eyebrow}>{nextItem ? 'Next task' : 'Finished'}</p>
            <h2>{nextItem ? nextItem.label : 'Review pathway'}</h2>
            <p>{nextItem?.title ?? 'All required evidence tasks have been saved.'}</p>
          </div>
          <Link className={styles.primaryButton} href={nextItem?.href ?? config.routeBase}>{nextItem ? 'Start now' : 'Review route'}</Link>
        </section>

        <section className={styles.route}>
          <div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>
          <div className={styles.routeList}>
            {routeItems.map((item, index) => (
              <Link className={`${styles.routeItem} ${item.complete ? styles.complete : ''} ${nextItem?.activity_type === item.activity_type ? styles.current : ''}`} href={item.href} key={item.id}>
                <span className={styles.routeMark}>{item.complete ? '✓' : index + 1}</span>
                <span className={styles.routeText}><strong>{item.label}</strong><span>{item.title}</span></span>
                <span className={styles.routeStatus}>{item.complete ? 'Done' : nextItem?.activity_type === item.activity_type ? 'Next' : 'To do'}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
