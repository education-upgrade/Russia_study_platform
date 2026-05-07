import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const TRACKABLE_ACTIVITY_TYPES = ['quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const activityRouteMap: Record<string, string> = {
  lesson_content: '/student/lesson/1905/lesson',
  quiz: '/student/lesson/1905/quiz',
  flashcards: '/student/lesson/1905/flashcards',
  peel_response: '/student/lesson/1905/peel',
  confidence_exit_ticket: '/student/lesson/1905/confidence',
};

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type Activity = {
  id: string;
  activity_type: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
};

type Lesson = {
  id: string;
  title: string;
  enquiry_question: string | null;
  estimated_minutes: number | null;
};

type GuidedStudyAssignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
  status: string;
  created_at: string;
};

type StudentResponse = {
  id: string;
  activity_id: string;
  response_type: string;
  status: string;
  score: number | null;
  response_json: any;
  submitted_at: string | null;
  last_saved_at: string | null;
};

type ActivityStatus = {
  label: string;
  detail: string;
  tone: 'neutral' | 'started' | 'complete' | 'warning';
  isComplete: boolean;
  isTrackable: boolean;
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

function sortActivitiesByPathwayOrder(activities: Activity[]) {
  return [...activities].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first.activity_type);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second.activity_type);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
  });
}

function sortActivityTypesByPathwayOrder(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
  });
}

function getActivityStatus(activity: Activity, response: StudentResponse | undefined, hasAnyEvidence: boolean): ActivityStatus {
  const json = response?.response_json ?? {};

  if (activity.activity_type === 'lesson_content') {
    return {
      label: hasAnyEvidence ? 'Done' : 'Available',
      detail: hasAnyEvidence ? 'Notes are available if needed.' : 'Use before evidence tasks if needed.',
      tone: hasAnyEvidence ? 'complete' : 'neutral',
      isComplete: hasAnyEvidence,
      isTrackable: false,
    };
  }

  if (!response) {
    return {
      label: 'To do',
      detail: 'No saved evidence yet.',
      tone: 'neutral',
      isComplete: false,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'quiz') {
    const percentage = typeof json.percentage === 'number' ? ` · ${json.percentage}%` : '';
    return {
      label: 'Done',
      detail: `${response.score ?? '-'}/${json.maxScore ?? '?'}${percentage}`,
      tone: 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'flashcards') {
    const ratedCount = json.ratedCount ?? 0;
    const totalCards = json.totalCards ?? '?';
    const revisitCount = json.revisitCount ?? 0;
    const isComplete = response.status === 'complete' || ratedCount >= (json.totalCards ?? Number.POSITIVE_INFINITY);

    return {
      label: isComplete ? 'Done' : 'Started',
      detail: `${ratedCount}/${totalCards} rated${revisitCount ? ` · ${revisitCount} revisit` : ''}`,
      tone: isComplete ? (revisitCount > 0 ? 'warning' : 'complete') : 'started',
      isComplete,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'peel_response') {
    const wordCount = json.wordCount ?? 0;
    return {
      label: 'Done',
      detail: `${wordCount} words`,
      tone: wordCount < 40 ? 'warning' : 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'confidence_exit_ticket') {
    const confidence = json.confidence ?? response.score ?? '-';
    return {
      label: 'Done',
      detail: `Confidence ${confidence}/5`,
      tone: Number(confidence) <= 2 ? 'warning' : 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  return {
    label: response.status === 'complete' || response.status === 'submitted' ? 'Done' : 'Started',
    detail: 'Saved response found.',
    tone: response.status === 'complete' || response.status === 'submitted' ? 'complete' : 'started',
    isComplete: response.status === 'complete' || response.status === 'submitted',
    isTrackable: true,
  };
}

function getNextTask(
  activities: Activity[],
  statusByActivityId: Record<string, ActivityStatus>,
  requiredActivityTypes: string[],
  hasAssignment: boolean
) {
  const requiredActivities = hasAssignment
    ? activities.filter((activity) => requiredActivityTypes.includes(activity.activity_type))
    : activities;

  const firstIncomplete = requiredActivities.find((activity) => {
    const status = statusByActivityId[activity.id];
    return status?.isTrackable && !status.isComplete;
  });

  if (!firstIncomplete) {
    return {
      label: 'Review pathway',
      title: hasAssignment ? 'Assignment complete' : 'Pathway complete',
      detail: 'All required evidence tasks have been saved.',
      href: '/student/lesson/1905',
      button: 'Review route',
    };
  }

  return {
    label: activityLabels[firstIncomplete.activity_type] ?? firstIncomplete.activity_type,
    title: firstIncomplete.title,
    detail: statusByActivityId[firstIncomplete.id]?.detail ?? 'Open the activity and save your work.',
    href: activityRouteMap[firstIncomplete.activity_type] ?? '/student/lesson/1905',
    button: 'Start now',
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Russia1905LessonPage() {
  if (!supabase) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <div className={styles.summary}>
            <p className={styles.eyebrow}>Student pathway</p>
            <h1>Supabase is not configured</h1>
            <p>Add the Supabase environment variables in Vercel and redeploy.</p>
          </div>
        </section>
      </main>
    );
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, enquiry_question, estimated_minutes')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single<Lesson>();

  if (lessonError || !lesson) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <div className={styles.summary}>
            <p className={styles.eyebrow}>Student pathway</p>
            <h1>1905 lesson not found</h1>
            <p>{lessonError?.message ?? 'Run the 1905 seed SQL in Supabase.'}</p>
          </div>
        </section>
      </main>
    );
  }

  const { data: assignmentData } = await supabase
    .from('guided_study_assignments')
    .select('id, mode, required_activity_types, deadline_at, instructions, status, created_at')
    .eq('assigned_student_id', DEMO_STUDENT_ID)
    .eq('status', 'active')
    .eq('pathway_slug', '1905-revolution')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<GuidedStudyAssignment>();

  const activeAssignment = assignmentData ?? null;
  const hasAssignment = Boolean(activeAssignment);
  const requiredActivityTypes = sortActivityTypesByPathwayOrder(
    activeAssignment?.required_activity_types?.length
      ? activeAssignment.required_activity_types
      : PATHWAY_ACTIVITY_ORDER
  );

  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('id, activity_type, title, skill_focus, difficulty, estimated_minutes')
    .eq('lesson_id', lesson.id);

  const orderedActivities = sortActivitiesByPathwayOrder((activities ?? []) as Activity[]);
  const requiredActivities = orderedActivities.filter((activity) => requiredActivityTypes.includes(activity.activity_type));
  const optionalActivities = orderedActivities.filter((activity) => !requiredActivityTypes.includes(activity.activity_type));
  const activityIds = orderedActivities.map((activity) => activity.id);
  const { data: savedResponses } = activityIds.length
    ? await supabase
        .from('student_responses')
        .select('id, activity_id, response_type, status, score, response_json, submitted_at, last_saved_at')
        .eq('student_id', DEMO_STUDENT_ID)
        .in('activity_id', activityIds)
    : { data: [] };

  const responseByActivityId = ((savedResponses ?? []) as StudentResponse[]).reduce<Record<string, StudentResponse>>(
    (acc, response) => {
      acc[response.activity_id] = response;
      return acc;
    },
    {}
  );

  const hasAnyEvidence = Object.keys(responseByActivityId).length > 0;
  const statusByActivityId = orderedActivities.reduce<Record<string, ActivityStatus>>((acc, activity) => {
    acc[activity.id] = getActivityStatus(activity, responseByActivityId[activity.id], hasAnyEvidence);
    return acc;
  }, {});
  const requiredTrackableStatuses = requiredActivities
    .map((activity) => statusByActivityId[activity.id])
    .filter((status) => status?.isTrackable);
  const allTrackableStatuses = orderedActivities
    .map((activity) => statusByActivityId[activity.id])
    .filter((status) => status?.isTrackable);
  const progressStatuses = hasAssignment ? requiredTrackableStatuses : allTrackableStatuses;
  const completedTrackableCount = progressStatuses.filter((status) => status.isComplete).length;
  const progressPercentage = progressStatuses.length
    ? Math.round((completedTrackableCount / progressStatuses.length) * 100)
    : 0;
  const nextTask = getNextTask(orderedActivities, statusByActivityId, requiredActivityTypes, hasAssignment);
  const assignmentMode = activeAssignment ? formatMode(activeAssignment.mode) : 'practice mode';
  const deadlineText = activeAssignment?.deadline_at ? formatDate(activeAssignment.deadline_at) : 'No deadline';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.navButton} href="/student/dashboard">← Dashboard</Link>
        <div className={styles.topTitle}>
          <span>Guided study route</span>
          <strong>1905 Revolution</strong>
        </div>
        <Link className={styles.navButton} href={nextTask.href}>Next</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.summary}>
          <p className={styles.eyebrow}>{hasAssignment ? 'Teacher-set assignment' : 'Independent pathway'}</p>
          <h1>1905 Revolution</h1>
          <p>{activeAssignment?.instructions ?? 'Complete one task at a time. The app will direct you to the next required activity.'}</p>
          <div className={styles.metaRow}>
            <span className={styles.pill}>{assignmentMode}</span>
            <span className={styles.pill}>{deadlineText}</span>
            <span className={styles.pill}>{completedTrackableCount}/{progressStatuses.length} evidence tasks</span>
          </div>
        </header>

        <section className={styles.nextPanel}>
          <div>
            <p className={styles.eyebrow}>Next task</p>
            <h2>{nextTask.label}</h2>
            <p>{nextTask.title}</p>
          </div>
          <Link className={styles.primaryButton} href={nextTask.href}>{nextTask.button}</Link>
        </section>

        <section className={styles.route}>
          <div className={styles.progressTop}>
            <strong>Your route</strong>
            <span>{progressPercentage}% complete</span>
          </div>
          <div className={styles.progressBar} aria-label="Pathway completion progress">
            <div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} />
          </div>

          {activitiesError && <div className={styles.error}>Activity query failed: {activitiesError.message}</div>}

          <div className={styles.routeList}>
            {requiredActivities.map((activity, index) => {
              const status = statusByActivityId[activity.id];
              const isCurrent = nextTask.href === (activityRouteMap[activity.activity_type] ?? '/student/lesson/1905') && !status.isComplete;
              return (
                <Link
                  className={`${styles.routeItem} ${status.isComplete ? styles.complete : ''} ${isCurrent ? styles.current : ''}`}
                  href={activityRouteMap[activity.activity_type] ?? '/student/lesson/1905'}
                  key={activity.id}
                >
                  <span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span>
                  <span className={styles.routeText}>
                    <strong>{activityLabels[activity.activity_type] ?? activity.title}</strong>
                    <span>{activity.title}</span>
                  </span>
                  <span className={styles.routeStatus}>{status.isComplete ? 'Done' : isCurrent ? 'Next' : status.label}</span>
                </Link>
              );
            })}
          </div>

          {optionalActivities.length > 0 && (
            <details className={styles.optionalToggle}>
              <summary>Optional support</summary>
              <div className={styles.routeList}>
                {optionalActivities.map((activity, index) => {
                  const status = statusByActivityId[activity.id];
                  return (
                    <Link
                      className={`${styles.routeItem} ${styles.optional} ${status.isComplete ? styles.complete : ''}`}
                      href={activityRouteMap[activity.activity_type] ?? '/student/lesson/1905'}
                      key={activity.id}
                    >
                      <span className={styles.routeMark}>{status.isComplete ? '✓' : index + 1}</span>
                      <span className={styles.routeText}>
                        <strong>{activityLabels[activity.activity_type] ?? activity.title}</strong>
                        <span>{activity.title}</span>
                      </span>
                      <span className={styles.routeStatus}>{status.label}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          )}
        </section>
      </section>
    </main>
  );
}
