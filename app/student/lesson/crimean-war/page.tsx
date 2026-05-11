import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getActivityRoute, getPathwayConfig, orderActivityTypes, PATHWAY_ACTIVITY_ORDER } from '@/lib/pathwayRegistry';
import styles from '../1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_SLUG = 'crimean-war';
const config = getPathwayConfig(PATHWAY_SLUG);

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  flashcards: 'Flashcards',
  quiz: 'Retrieval quiz',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type Activity = { id: string; activity_type: string; title: string; };
type Assignment = { id: string; mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null; };
type Response = { activity_id: string; status: string; score: number | null; response_json: any; };

function formatMode(mode: string) { return mode.replaceAll('_', ' '); }
function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function isComplete(type: string, response: Response | undefined) {
  if (type === 'lesson_content') return Boolean(response);
  if (!response) return false;
  if (type === 'flashcards') {
    const json = response.response_json ?? {};
    return response.status === 'complete' || Number(json.ratedCount ?? 0) >= Number(json.totalCards ?? 9999);
  }
  return response.status === 'complete' || response.status === 'submitted';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CrimeanWarPathwayPage() {
  if (!supabase) return <main className={styles.shell}><section className={styles.mainCard}><h1>Supabase is not configured</h1></section></main>;

  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) {
    return <main className={styles.shell}><section className={styles.mainCard}><div className={styles.summary}><p className={styles.eyebrow}>Student pathway</p><h1>Crimean War lesson not found</h1><p>{lessonError?.message ?? 'Run the Crimean War Supabase seed file.'}</p></div></section></main>;
  }

  const { data: assignmentData } = await supabase.from('guided_study_assignments').select('id, mode, required_activity_types, deadline_at, instructions').eq('assigned_student_id', DEMO_STUDENT_ID).eq('status', 'active').eq('pathway_slug', PATHWAY_SLUG).order('created_at', { ascending: false }).limit(1).maybeSingle<Assignment>();
  const assignment = assignmentData ?? null;
  const requiredTypes = orderActivityTypes(assignment?.required_activity_types?.length ? assignment.required_activity_types : [...PATHWAY_ACTIVITY_ORDER]);

  const { data: activities } = await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id);
  const orderedActivities = orderActivityTypes((activities ?? []).map((a: Activity) => a.activity_type)).map((type) => (activities ?? []).find((a: Activity) => a.activity_type === type)).filter(Boolean) as Activity[];
  const requiredActivities = orderedActivities.filter((activity) => requiredTypes.includes(activity.activity_type));
  const activityIds = orderedActivities.map((activity) => activity.id);
  const { data: responses } = activityIds.length ? await supabase.from('student_responses').select('activity_id, status, score, response_json').eq('student_id', DEMO_STUDENT_ID).in('activity_id', activityIds) : { data: [] };
  const responseByActivityType = orderedActivities.reduce<Record<string, Response | undefined>>((acc, activity) => { acc[activity.activity_type] = (responses ?? []).find((response: Response) => response.activity_id === activity.id); return acc; }, {});

  const routeItems = requiredActivities.map((activity) => ({
    ...activity,
    href: getActivityRoute(config.routeBase, activity.activity_type),
    complete: isComplete(activity.activity_type, responseByActivityType[activity.activity_type]),
  }));
  const nextItem = routeItems.find((item) => item.activity_type !== 'lesson_content' && !item.complete) ?? routeItems.find((item) => !item.complete) ?? null;
  const completedCount = routeItems.filter((item) => item.activity_type !== 'lesson_content' && item.complete).length;
  const trackableCount = routeItems.filter((item) => item.activity_type !== 'lesson_content').length;
  const progressPercentage = trackableCount ? Math.round((completedCount / trackableCount) * 100) : 0;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.navButton} href="/student/dashboard">← Dashboard</Link><div className={styles.topTitle}><span>Guided study route</span><strong>{config.title}</strong></div><Link className={styles.navButton} href={nextItem?.href ?? config.routeBase}>Next</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.summary}><p className={styles.eyebrow}>{assignment ? 'Teacher-set assignment' : 'Independent pathway'}</p><h1>{config.title}</h1><p>{assignment?.instructions ?? 'Complete one task at a time. Focus on how defeat exposed Russia’s weaknesses.'}</p><div className={styles.metaRow}><span className={styles.pill}>{assignment ? formatMode(assignment.mode) : 'practice mode'}</span><span className={styles.pill}>{formatDate(assignment?.deadline_at ?? null)}</span><span className={styles.pill}>{completedCount}/{trackableCount} evidence tasks</span></div></header>
        <section className={styles.nextPanel}><div><p className={styles.eyebrow}>Next task</p><h2>{nextItem ? activityLabels[nextItem.activity_type] : 'Review pathway'}</h2><p>{nextItem?.title ?? 'All required evidence tasks have been saved.'}</p></div><Link className={styles.primaryButton} href={nextItem?.href ?? config.routeBase}>{nextItem ? 'Start now' : 'Review route'}</Link></section>
        <section className={styles.route}><div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div><div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div><div className={styles.routeList}>{routeItems.map((item, index) => <Link className={`${styles.routeItem} ${item.complete ? styles.complete : ''} ${nextItem?.activity_type === item.activity_type ? styles.current : ''}`} href={item.href} key={item.id}><span className={styles.routeMark}>{item.complete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{activityLabels[item.activity_type] ?? item.title}</strong><span>{item.title}</span></span><span className={styles.routeStatus}>{item.complete ? 'Done' : nextItem?.activity_type === item.activity_type ? 'Next' : 'To do'}</span></Link>)}</div></section>
      </section>
    </main>
  );
}
