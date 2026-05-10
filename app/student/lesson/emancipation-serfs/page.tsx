import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getActivityRoute, getPathwayConfig, orderActivityTypes, PATHWAY_ACTIVITY_ORDER } from '@/lib/pathwayRegistry';
import styles from '../1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_SLUG = 'emancipation-serfs';
const config = getPathwayConfig(PATHWAY_SLUG);

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  flashcards: 'Flashcards',
  quiz: 'Retrieval quiz',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type Activity = { id: string; activity_type: string; title: string; skill_focus: string | null; difficulty: string | null; estimated_minutes: number | null; };
type StudentResponse = { id: string; activity_id: string; response_type: string; status: string; score: number | null; response_json: any; submitted_at: string | null; last_saved_at: string | null; };
type GuidedStudyAssignment = { id: string; mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null; status: string; created_at: string; };
type ActivityStatus = { label: string; detail: string; tone: 'neutral' | 'started' | 'complete' | 'warning'; isComplete: boolean; isTrackable: boolean; };

function formatMode(mode: string) { return mode.replaceAll('_', ' '); }
function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function sortActivities(activities: Activity[]) { return [...activities].sort((a, b) => orderActivityTypes([a.activity_type, b.activity_type]).indexOf(a.activity_type) - orderActivityTypes([a.activity_type, b.activity_type]).indexOf(b.activity_type)); }
function getStatus(activity: Activity, response: StudentResponse | undefined, hasEvidence: boolean): ActivityStatus {
  const json = response?.response_json ?? {};
  if (activity.activity_type === 'lesson_content') return { label: hasEvidence ? 'Done' : 'Available', detail: hasEvidence ? 'Notes available if needed.' : 'Use before evidence tasks if needed.', tone: hasEvidence ? 'complete' : 'neutral', isComplete: hasEvidence, isTrackable: false };
  if (!response) return { label: 'To do', detail: 'No saved evidence yet.', tone: 'neutral', isComplete: false, isTrackable: true };
  if (activity.activity_type === 'quiz') return { label: response.status === 'complete' || response.status === 'submitted' ? 'Done' : 'Started', detail: `${response.score ?? '-'}/${json.maxScore ?? '?'}${typeof json.percentage === 'number' ? ` · ${json.percentage}%` : ''}`, tone: response.status === 'complete' || response.status === 'submitted' ? 'complete' : 'started', isComplete: response.status === 'complete' || response.status === 'submitted', isTrackable: true };
  if (activity.activity_type === 'flashcards') { const ratedCount = json.ratedCount ?? 0; const totalCards = json.totalCards ?? '?'; const isComplete = response.status === 'complete' || ratedCount >= (json.totalCards ?? Number.POSITIVE_INFINITY); return { label: isComplete ? 'Done' : 'Started', detail: `${ratedCount}/${totalCards} rated`, tone: isComplete ? 'complete' : 'started', isComplete, isTrackable: true }; }
  if (activity.activity_type === 'peel_response') return { label: response.status === 'complete' || response.status === 'submitted' ? 'Done' : 'Started', detail: `${json.wordCount ?? 0} words`, tone: (json.wordCount ?? 0) < 40 ? 'warning' : 'complete', isComplete: response.status === 'complete' || response.status === 'submitted', isTrackable: true };
  if (activity.activity_type === 'confidence_exit_ticket') return { label: response.status === 'complete' || response.status === 'submitted' ? 'Done' : 'Started', detail: `Confidence ${json.confidence ?? response.score ?? '-'}/5`, tone: Number(json.confidence ?? response.score ?? 0) <= 2 ? 'warning' : 'complete', isComplete: response.status === 'complete' || response.status === 'submitted', isTrackable: true };
  return { label: 'Started', detail: 'Saved response found.', tone: 'started', isComplete: false, isTrackable: true };
}
function getNextTask(activities: Activity[], statuses: Record<string, ActivityStatus>, requiredTypes: string[], hasAssignment: boolean) {
  const required = hasAssignment ? activities.filter((activity) => requiredTypes.includes(activity.activity_type)) : activities;
  const firstIncomplete = required.find((activity) => statuses[activity.id]?.isTrackable && !statuses[activity.id].isComplete);
  if (!firstIncomplete) return { label: 'Review pathway', title: 'Pathway complete', href: config.routeBase, button: 'Review route' };
  return { label: activityLabels[firstIncomplete.activity_type] ?? firstIncomplete.activity_type, title: firstIncomplete.title, href: getActivityRoute(config.routeBase, firstIncomplete.activity_type), button: 'Start now' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmancipationSerfsPathwayPage() {
  if (!supabase) return <main className={styles.shell}><section className={styles.mainCard}><div className={styles.summary}><h1>Supabase is not configured</h1></div></section></main>;

  const { data: lessonRows, error: lessonError } = await supabase.from('lessons').select('id, title, enquiry_question, estimated_minutes').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;
  if (lessonError || !lesson) return <main className={styles.shell}><section className={styles.mainCard}><div className={styles.summary}><p className={styles.eyebrow}>Student pathway</p><h1>Emancipation lesson not found</h1><p>{lessonError?.message ?? 'Run the Emancipation Supabase seed file.'}</p></div></section></main>;

  const { data: assignmentData } = await supabase.from('guided_study_assignments').select('id, mode, required_activity_types, deadline_at, instructions, status, created_at').eq('assigned_student_id', DEMO_STUDENT_ID).eq('status', 'active').eq('pathway_slug', PATHWAY_SLUG).order('created_at', { ascending: false }).limit(1).maybeSingle<GuidedStudyAssignment>();
  const activeAssignment = assignmentData ?? null;
  const hasAssignment = Boolean(activeAssignment);
  const requiredTypes = orderActivityTypes(activeAssignment?.required_activity_types?.length ? activeAssignment.required_activity_types : [...PATHWAY_ACTIVITY_ORDER]);

  const { data: activities, error: activitiesError } = await supabase.from('activities').select('id, activity_type, title, skill_focus, difficulty, estimated_minutes').eq('lesson_id', lesson.id);
  const orderedActivities = sortActivities((activities ?? []) as Activity[]);
  const requiredActivities = orderedActivities.filter((activity) => requiredTypes.includes(activity.activity_type));
  const optionalActivities = orderedActivities.filter((activity) => !requiredTypes.includes(activity.activity_type));
  const activityIds = orderedActivities.map((activity) => activity.id);
  const { data: savedResponses } = activityIds.length ? await supabase.from('student_responses').select('id, activity_id, response_type, status, score, response_json, submitted_at, last_saved_at').eq('student_id', DEMO_STUDENT_ID).in('activity_id', activityIds) : { data: [] };
  const responseByActivityId = ((savedResponses ?? []) as StudentResponse[]).reduce<Record<string, StudentResponse>>((acc, response) => { acc[response.activity_id] = response; return acc; }, {});
  const hasEvidence = Object.keys(responseByActivityId).length > 0;
  const statusByActivityId = orderedActivities.reduce<Record<string, ActivityStatus>>((acc, activity) => { acc[activity.id] = getStatus(activity, responseByActivityId[activity.id], hasEvidence); return acc; }, {});
  const progressStatuses = (hasAssignment ? requiredActivities : orderedActivities).map((activity) => statusByActivityId[activity.id]).filter((status) => status?.isTrackable);
  const completedCount = progressStatuses.filter((status) => status.isComplete).length;
  const progressPercentage = progressStatuses.length ? Math.round((completedCount / progressStatuses.length) * 100) : 0;
  const nextTask = getNextTask(orderedActivities, statusByActivityId, requiredTypes, hasAssignment);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.navButton} href="/student/dashboard">← Dashboard</Link><div className={styles.topTitle}><span>Guided study route</span><strong>{config.title}</strong></div><Link className={styles.navButton} href={nextTask.href}>Next</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.summary}><p className={styles.eyebrow}>{hasAssignment ? 'Teacher-set assignment' : 'Independent pathway'}</p><h1>{config.title}</h1><p>{activeAssignment?.instructions ?? 'Complete one task at a time. Focus on whether emancipation improved peasant lives.'}</p><div className={styles.metaRow}><span className={styles.pill}>{activeAssignment ? formatMode(activeAssignment.mode) : 'practice mode'}</span><span className={styles.pill}>{formatDate(activeAssignment?.deadline_at ?? null)}</span><span className={styles.pill}>{completedCount}/{progressStatuses.length} evidence tasks</span></div></header>
        <section className={styles.nextPanel}><div><p className={styles.eyebrow}>Next task</p><h2>{nextTask.label}</h2><p>{nextTask.title}</p></div><Link className={styles.primaryButton} href={nextTask.href}>{nextTask.button}</Link></section>
        <section className={styles.route}><div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div><div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>{activitiesError && <div className={styles.error}>Activity query failed: {activitiesError.message}</div>}<div className={styles.routeList}>{requiredActivities.map((activity, index) => { const status = statusByActivityId[activity.id]; const href = getActivityRoute(config.routeBase, activity.activity_type); const isCurrent = nextTask.href === href && !status.isComplete; return <Link className={`${styles.routeItem} ${status.isComplete ? styles.complete : ''} ${isCurrent ? styles.current : ''}`} href={href} key={activity.id}><span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{activityLabels[activity.activity_type] ?? activity.title}</strong><span>{activity.title}</span></span><span className={styles.routeStatus}>{status.isComplete ? 'Done' : isCurrent ? 'Next' : status.label}</span></Link>; })}</div>{optionalActivities.length > 0 && <details className={styles.optionalToggle}><summary>Optional support</summary><div className={styles.routeList}>{optionalActivities.map((activity, index) => { const status = statusByActivityId[activity.id]; return <Link className={`${styles.routeItem} ${styles.optional} ${status.isComplete ? styles.complete : ''}`} href={getActivityRoute(config.routeBase, activity.activity_type)} key={activity.id}><span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{activityLabels[activity.activity_type] ?? activity.title}</strong><span>{activity.title}</span></span><span className={styles.routeStatus}>{status.label}</span></Link>; })}</div></details>}</section>
      </section>
    </main>
  );
}
