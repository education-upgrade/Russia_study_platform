import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityLabel, getActivityRouteSlug, isTrackableActivity } from '@/lib/activityTypeRegistry';
import { reformPreserveAutocracyPathwaySlug, reformPreserveAutocracySeedLessonTitle } from '@/lib/pathwayReformPreserveAutocracyContent';
import styles from '../1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const config = getPathwayConfig(reformPreserveAutocracyPathwaySlug);

const preferredActivityOrder = [
  'lesson_content',
  'timeline',
  'card_sort',
  'peel_response',
  'confidence_exit_ticket',
];

type Activity = { id: string; activity_type: string; title: string };
type Response = { activity_id: string; status: string; score: number | null; response_json: any };
type Assignment = { id: string; mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null };

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
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

function getActivityHref(activityType: string) {
  return `${config.routeBase}/${getActivityRouteSlug(activityType)}`;
}

function isComplete(activityType: string, response: Response | undefined) {
  if (!isTrackableActivity(activityType)) return false;
  if (!response) return false;
  if (activityType === 'confidence_exit_ticket') return response.status === 'complete' || response.status === 'submitted';
  if (activityType === 'peel_response') return response.status === 'complete' || response.status === 'submitted';
  return response.status === 'complete' || response.status === 'submitted';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReformPreserveAutocracyPathwayPage() {
  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><h1>Supabase is not configured</h1></section></main>;
  }

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', reformPreserveAutocracySeedLessonTitle)
    .limit(1);

  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;

  if (lessonError || !lesson) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <div className={styles.summary}>
            <p className={styles.eyebrow}>Student pathway</p>
            <h1>{config.title} lesson not found</h1>
            <p>{lessonError?.message ?? 'Run the reform preserve autocracy Supabase seed file.'}</p>
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
    .eq('pathway_slug', reformPreserveAutocracyPathwaySlug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<Assignment>();

  const assignment = assignmentData ?? null;

  const { data: activities } = await supabase
    .from('activities')
    .select('id, activity_type, title')
    .eq('lesson_id', lesson.id);

  const orderedActivities = orderActivities((activities ?? []) as Activity[]);
  const requiredTypes = assignment?.required_activity_types?.length ? assignment.required_activity_types : preferredActivityOrder;
  const routeItems = orderedActivities.filter((activity) => requiredTypes.includes(activity.activity_type));
  const activityIds = routeItems.map((activity) => activity.id);

  const { data: responses } = activityIds.length
    ? await supabase
        .from('student_responses')
        .select('activity_id, status, score, response_json')
        .eq('student_id', DEMO_STUDENT_ID)
        .in('activity_id', activityIds)
    : { data: [] };

  const responseByActivityType = routeItems.reduce<Record<string, Response | undefined>>((acc, activity) => {
    acc[activity.activity_type] = (responses ?? []).find((response: Response) => response.activity_id === activity.id);
    return acc;
  }, {});

  const displayItems = routeItems.map((activity) => ({
    ...activity,
    href: getActivityHref(activity.activity_type),
    label: getActivityLabel(activity.activity_type),
    complete: isComplete(activity.activity_type, responseByActivityType[activity.activity_type]),
    trackable: isTrackableActivity(activity.activity_type),
  }));

  const nextItem = displayItems.find((item) => item.trackable && !item.complete) ?? displayItems.find((item) => item.activity_type !== 'lesson_content') ?? null;
  const trackableItems = displayItems.filter((item) => item.trackable);
  const completedCount = trackableItems.filter((item) => item.complete).length;
  const progressPercentage = trackableItems.length ? Math.round((completedCount / trackableItems.length) * 100) : 0;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.navButton} href="/student/dashboard">← Dashboard</Link>
        <div className={styles.topTitle}><span>Guided study route</span><strong>{config.title}</strong></div>
        <Link className={styles.navButton} href={nextItem?.href ?? config.routeBase}>Next</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.summary}>
          <p className={styles.eyebrow}>{assignment ? 'Teacher-set assignment' : 'Independent pathway'}</p>
          <h1>{config.title}</h1>
          <p>{assignment?.instructions ?? 'Work through the route to judge whether Alexander II’s reforms modernised Russia or preserved autocracy.'}</p>
          <div className={styles.metaRow}>
            <span className={styles.pill}>{assignment ? formatMode(assignment.mode) : 'practice mode'}</span>
            <span className={styles.pill}>{formatDate(assignment?.deadline_at ?? null)}</span>
            <span className={styles.pill}>{completedCount}/{trackableItems.length} evidence tasks</span>
          </div>
        </header>

        <section className={styles.nextPanel}>
          <div>
            <p className={styles.eyebrow}>Next task</p>
            <h2>{nextItem ? nextItem.label : 'Review pathway'}</h2>
            <p>{nextItem?.title ?? 'All required evidence tasks have been saved.'}</p>
          </div>
          <Link className={styles.primaryButton} href={nextItem?.href ?? config.routeBase}>{nextItem ? 'Start now' : 'Review route'}</Link>
        </section>

        <section className={styles.route}>
          <div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>
          <div className={styles.routeList}>
            {displayItems.map((item, index) => (
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
