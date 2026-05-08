import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../1905/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_SLUG = 'week-1-russia-1855';
const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';
const PATHWAY_ORDER = ['lesson_content', 'flashcards', 'quiz', 'peel_response', 'confidence_exit_ticket'];

const activityRouteMap: Record<string, string> = {
  lesson_content: '/student/lesson/week-1/lesson',
  flashcards: '/student/lesson/week-1/flashcards',
  quiz: '/student/lesson/week-1/quiz',
  peel_response: '/student/lesson/week-1/peel',
  confidence_exit_ticket: '/student/lesson/week-1/confidence',
};

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  flashcards: 'Flashcards',
  quiz: 'Retrieval quiz',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type Activity = { id: string; activity_type: string; title: string; skill_focus: string | null; difficulty: string | null; estimated_minutes: number | null; };
type Lesson = { id: string; title: string; enquiry_question: string | null; estimated_minutes: number | null; };
type GuidedStudyAssignment = { id: string; mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null; status: string; created_at: string; };
type StudentResponse = { id: string; activity_id: string; response_type: string; status: string; score: number | null; response_json: any; submitted_at: string | null; last_saved_at: string | null; };
type ActivityStatus = { label: string; detail: string; tone: 'neutral' | 'started' | 'complete' | 'warning'; isComplete: boolean; isTrackable: boolean; };

function formatMode(mode: string) { return mode.replaceAll('_', ' '); }
function formatDate(value: string | null) { if (!value) return 'No deadline'; return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
function sortByOrder(activities: Activity[]) { return [...activities].sort((a, b) => (PATHWAY_ORDER.indexOf(a.activity_type) === -1 ? 999 : PATHWAY_ORDER.indexOf(a.activity_type)) - (PATHWAY_ORDER.indexOf(b.activity_type) === -1 ? 999 : PATHWAY_ORDER.indexOf(b.activity_type))); }
function sortTypes(types: string[]) { return [...types].sort((a, b) => (PATHWAY_ORDER.indexOf(a) === -1 ? 999 : PATHWAY_ORDER.indexOf(a)) - (PATHWAY_ORDER.indexOf(b) === -1 ? 999 : PATHWAY_ORDER.indexOf(b))); }

function getActivityStatus(activity: Activity, response: StudentResponse | undefined, hasAnyEvidence: boolean): ActivityStatus {
  const json = response?.response_json ?? {};
  if (activity.activity_type === 'lesson_content') return { label: hasAnyEvidence ? 'Done' : 'Available', detail: hasAnyEvidence ? 'Notes are available if needed.' : 'Complete this first.', tone: hasAnyEvidence ? 'complete' : 'neutral', isComplete: hasAnyEvidence, isTrackable: false };
  if (!response) return { label: 'To do', detail: 'No saved evidence yet.', tone: 'neutral', isComplete: false, isTrackable: true };
  if (activity.activity_type === 'quiz') { const isComplete = response.status === 'complete' || response.status === 'submitted'; return { label: isComplete ? 'Done' : 'Started', detail: `${response.score ?? '-'}/${json.maxScore ?? '?'}${typeof json.percentage === 'number' ? ` · ${json.percentage}%` : ''}`, tone: isComplete ? 'complete' : 'started', isComplete, isTrackable: true }; }
  if (activity.activity_type === 'flashcards') { const ratedCount = json.ratedCount ?? 0; const totalCards = json.totalCards ?? '?'; const revisitCount = json.revisitCount ?? 0; const isComplete = response.status === 'complete' || ratedCount >= (json.totalCards ?? Number.POSITIVE_INFINITY); return { label: isComplete ? 'Done' : 'Started', detail: `${ratedCount}/${totalCards} rated${revisitCount ? ` · ${revisitCount} revisit` : ''}`, tone: isComplete ? (revisitCount > 0 ? 'warning' : 'complete') : 'started', isComplete, isTrackable: true }; }
  if (activity.activity_type === 'peel_response') { const wordCount = json.wordCount ?? 0; const isComplete = response.status === 'complete' || response.status === 'submitted'; return { label: isComplete ? 'Done' : 'Started', detail: `${wordCount} words`, tone: wordCount < 40 ? 'warning' : 'complete', isComplete, isTrackable: true }; }
  if (activity.activity_type === 'confidence_exit_ticket') { const confidence = json.confidence ?? response.score ?? '-'; const isComplete = response.status === 'complete' || response.status === 'submitted'; return { label: isComplete ? 'Done' : 'Started', detail: `Confidence ${confidence}/5`, tone: Number(confidence) <= 2 ? 'warning' : 'complete', isComplete, isTrackable: true }; }
  return { label: response.status === 'complete' || response.status === 'submitted' ? 'Done' : 'Started', detail: 'Saved response found.', tone: response.status === 'complete' || response.status === 'submitted' ? 'complete' : 'started', isComplete: response.status === 'complete' || response.status === 'submitted', isTrackable: true };
}

function getNextTask(activities: Activity[], statusByActivityId: Record<string, ActivityStatus>, requiredActivityTypes: string[], hasAssignment: boolean) {
  const requiredActivities = hasAssignment ? activities.filter((activity) => requiredActivityTypes.includes(activity.activity_type)) : activities;
  const firstIncomplete = requiredActivities.find((activity) => statusByActivityId[activity.id]?.isTrackable && !statusByActivityId[activity.id]?.isComplete);
  if (!firstIncomplete) return { label: 'Review pathway', title: hasAssignment ? 'Assignment complete' : 'Pathway complete', href: '/student/lesson/week-1', button: 'Review route' };
  return { label: activityLabels[firstIncomplete.activity_type] ?? firstIncomplete.activity_type, title: firstIncomplete.title, href: activityRouteMap[firstIncomplete.activity_type] ?? '/student/lesson/week-1', button: 'Start now' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Week1PathwayPage() {
  if (!supabase) return <main className={styles.shell}><section className={styles.mainCard}><div className={styles.summary}><p className={styles.eyebrow}>Student pathway</p><h1>Supabase is not configured</h1><p>Add the Supabase environment variables in Vercel and redeploy.</p></div></section></main>;

  const { data: lesson, error: lessonError } = await supabase.from('lessons').select('id, title, enquiry_question, estimated_minutes').eq('title', LESSON_TITLE).single<Lesson>();
  if (lessonError || !lesson) return <main className={styles.shell}><section className={styles.mainCard}><div className={styles.summary}><p className={styles.eyebrow}>Student pathway</p><h1>Week 1 lesson not found</h1><p>{lessonError?.message ?? 'Run the Week 1 seed SQL in Supabase.'}</p></div></section></main>;

  const { data: assignmentData } = await supabase.from('guided_study_assignments').select('id, mode, required_activity_types, deadline_at, instructions, status, created_at').eq('assigned_student_id', DEMO_STUDENT_ID).eq('status', 'active').eq('pathway_slug', PATHWAY_SLUG).order('created_at', { ascending: false }).limit(1).maybeSingle<GuidedStudyAssignment>();
  const activeAssignment = assignmentData ?? null;
  const hasAssignment = Boolean(activeAssignment);
  const requiredActivityTypes = sortTypes(activeAssignment?.required_activity_types?.length ? activeAssignment.required_activity_types : PATHWAY_ORDER);
  const { data: activities, error: activitiesError } = await supabase.from('activities').select('id, activity_type, title, skill_focus, difficulty, estimated_minutes').eq('lesson_id', lesson.id);
  const orderedActivities = sortByOrder((activities ?? []) as Activity[]);
  const requiredActivities = orderedActivities.filter((activity) => requiredActivityTypes.includes(activity.activity_type));
  const optionalActivities = orderedActivities.filter((activity) => !requiredActivityTypes.includes(activity.activity_type));
  const activityIds = orderedActivities.map((activity) => activity.id);
  const { data: savedResponses } = activityIds.length ? await supabase.from('student_responses').select('id, activity_id, response_type, status, score, response_json, submitted_at, last_saved_at').eq('student_id', DEMO_STUDENT_ID).in('activity_id', activityIds) : { data: [] };
  const responseByActivityId = ((savedResponses ?? []) as StudentResponse[]).reduce<Record<string, StudentResponse>>((acc, response) => { acc[response.activity_id] = response; return acc; }, {});
  const hasAnyEvidence = Object.keys(responseByActivityId).length > 0;
  const statusByActivityId = orderedActivities.reduce<Record<string, ActivityStatus>>((acc, activity) => { acc[activity.id] = getActivityStatus(activity, responseByActivityId[activity.id], hasAnyEvidence); return acc; }, {});
  const progressStatuses = (hasAssignment ? requiredActivities : orderedActivities).map((activity) => statusByActivityId[activity.id]).filter((status) => status?.isTrackable);
  const completedTrackableCount = progressStatuses.filter((status) => status.isComplete).length;
  const progressPercentage = progressStatuses.length ? Math.round((completedTrackableCount / progressStatuses.length) * 100) : 0;
  const nextTask = getNextTask(orderedActivities, statusByActivityId, requiredActivityTypes, hasAssignment);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><Link className={styles.navButton} href="/student/dashboard">← Dashboard</Link><div className={styles.topTitle}><span>Guided study route</span><strong>Week 1 · Russia in 1855</strong></div><Link className={styles.navButton} href={nextTask.href}>Next</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.summary}><p className={styles.eyebrow}>{hasAssignment ? 'Teacher-set assignment' : 'Independent pathway'}</p><h1>Russia in 1855</h1><p>{activeAssignment?.instructions ?? 'Start with the chunked lesson, then study the flashcards before completing the quiz, PEEL response and confidence check.'}</p><div className={styles.metaRow}><span className={styles.pill}>{activeAssignment ? formatMode(activeAssignment.mode) : 'practice mode'}</span><span className={styles.pill}>{activeAssignment?.deadline_at ? formatDate(activeAssignment.deadline_at) : 'No deadline'}</span><span className={styles.pill}>{completedTrackableCount}/{progressStatuses.length} evidence tasks</span></div></header>
        <section className={styles.nextPanel}><div><p className={styles.eyebrow}>Next task</p><h2>{nextTask.label}</h2><p>{nextTask.title}</p></div><Link className={styles.primaryButton} href={nextTask.href}>{nextTask.button}</Link></section>
        <section className={styles.route}><div className={styles.progressTop}><strong>Your route</strong><span>{progressPercentage}% complete</span></div><div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>{activitiesError && <div className={styles.error}>Activity query failed: {activitiesError.message}</div>}<div className={styles.routeList}>{requiredActivities.map((activity, index) => { const status = statusByActivityId[activity.id]; const isCurrent = nextTask.href === (activityRouteMap[activity.activity_type] ?? '/student/lesson/week-1') && !status.isComplete; return <Link className={`${styles.routeItem} ${status.isComplete ? styles.complete : ''} ${isCurrent ? styles.current : ''}`} href={activityRouteMap[activity.activity_type] ?? '/student/lesson/week-1'} key={activity.id}><span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{activityLabels[activity.activity_type] ?? activity.title}</strong><span>{activity.title}</span></span><span className={styles.routeStatus}>{status.isComplete ? 'Done' : isCurrent ? 'Next' : status.label}</span></Link>; })}</div>{optionalActivities.length > 0 && <details className={styles.optionalToggle}><summary>Optional support</summary><div className={styles.routeList}>{optionalActivities.map((activity, index) => { const status = statusByActivityId[activity.id]; return <Link className={`${styles.routeItem} ${styles.optional} ${status.isComplete ? styles.complete : ''}`} href={activityRouteMap[activity.activity_type] ?? '/student/lesson/week-1'} key={activity.id}><span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{activityLabels[activity.activity_type] ?? activity.title}</strong><span>{activity.title}</span></span><span className={styles.routeStatus}>{status.label}</span></Link>; })}</div></details>}</section>
      </section>
    </main>
  );
}
