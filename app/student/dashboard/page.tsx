import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PATHWAY_ACTIVITY_ORDER, getActivityRoute, getPathwayConfig, orderActivityTypes } from '@/lib/pathwayRegistry';
import styles from './page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  flashcards: 'Flashcards',
  quiz: 'Retrieval quiz',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type GuidedStudyAssignment = {
  id: string;
  mode: string;
  pathway_slug: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
  status: string;
  created_at: string;
};

type Activity = { id: string; activity_type: string; };

type StudentResponse = {
  activity_id: string;
  response_type: string;
  status: string;
  response_json: any;
  last_saved_at?: string | null;
  submitted_at?: string | null;
  started_at?: string | null;
};

type ActivityState = { type: string; label: string; complete: boolean; href: string; };

function formatMode(mode: string) { return mode.replaceAll('_', ' '); }

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getResponseTimestamp(response: StudentResponse) {
  return new Date(response.last_saved_at ?? response.submitted_at ?? response.started_at ?? 0).getTime();
}

function isActivityComplete(activityType: string, response: StudentResponse | undefined) {
  if (activityType === 'lesson_content') return true;
  if (!response) return false;

  if (activityType === 'flashcards') {
    const json = response.response_json ?? {};
    const ratedCount = Number(json.ratedCount ?? 0);
    const totalCards = Number(json.totalCards ?? 0);
    return response.status === 'complete' || (totalCards > 0 && ratedCount >= totalCards);
  }

  return response.status === 'complete' || response.status === 'submitted';
}

function getNextActivity(activityStates: ActivityState[]) {
  return activityStates.find((activity) => !activity.complete) ?? null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentDashboardPage() {
  let assignment: GuidedStudyAssignment | null = null;
  let assignmentError = '';
  let progressPercentage = 0;
  let completedCount = 0;
  let requiredCount = 0;
  let activityStates: ActivityState[] = [];

  if (supabase) {
    const { data: assignmentData, error } = await supabase
      .from('guided_study_assignments')
      .select('id, mode, pathway_slug, required_activity_types, deadline_at, instructions, status, created_at')
      .eq('assigned_student_id', DEMO_STUDENT_ID)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    assignment = assignmentData as GuidedStudyAssignment | null;
    assignmentError = error?.message ?? '';

    const config = getPathwayConfig(assignment?.pathway_slug);
    const requiredActivityTypes = orderActivityTypes(
      assignment?.required_activity_types?.length ? assignment.required_activity_types : [...PATHWAY_ACTIVITY_ORDER]
    );

    const { data: lessonRows } = await supabase
      .from('lessons')
      .select('id')
      .eq('title', config.lessonTitle)
      .limit(1);

    const lesson = Array.isArray(lessonRows) && lessonRows.length > 0 ? lessonRows[0] : null;

    if (lesson) {
      const { data: activities } = await supabase
        .from('activities')
        .select('id, activity_type')
        .eq('lesson_id', lesson.id);

      const lessonActivities = (activities ?? []) as Activity[];
      const activityIds = lessonActivities.map((activity) => activity.id);
      const { data: responses } = activityIds.length
        ? await supabase
            .from('student_responses')
            .select('activity_id, response_type, status, response_json, last_saved_at, submitted_at, started_at')
            .eq('student_id', DEMO_STUDENT_ID)
            .in('activity_id', activityIds)
        : { data: [] };

      const responseByActivityType = lessonActivities.reduce<Record<string, StudentResponse | undefined>>((acc, activity) => {
        const matchingResponses = ((responses ?? []) as StudentResponse[])
          .filter((response) => response.activity_id === activity.id)
          .sort((first, second) => getResponseTimestamp(second) - getResponseTimestamp(first));
        acc[activity.activity_type] = matchingResponses[0];
        return acc;
      }, {});

      activityStates = requiredActivityTypes.map((activityType) => ({
        type: activityType,
        label: activityLabels[activityType] ?? activityType.replaceAll('_', ' '),
        href: getActivityRoute(config.routeBase, activityType),
        complete: isActivityComplete(activityType, responseByActivityType[activityType]),
      }));

      requiredCount = activityStates.length;
      completedCount = activityStates.filter((activity) => activity.complete).length;
      progressPercentage = requiredCount ? Math.round((completedCount / requiredCount) * 100) : 0;
    }
  }

  const config = getPathwayConfig(assignment?.pathway_slug);

  if (!activityStates.length) {
    activityStates = orderActivityTypes([...PATHWAY_ACTIVITY_ORDER]).map((type) => ({
      type,
      label: activityLabels[type],
      href: getActivityRoute(config.routeBase, type),
      complete: false,
    }));
    requiredCount = activityStates.length;
  }

  const hasAssignment = Boolean(assignment);
  const nextActivity = getNextActivity(activityStates);
  const nextHref = nextActivity?.href ?? config.routeBase;
  const nextLabel = nextActivity?.label ?? 'Review pathway';
  const nextDescription = nextActivity
    ? 'Open the next task. Complete it on its own screen, then come back here.'
    : 'All required tasks are complete. You can review the pathway or improve earlier work.';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Student dashboard</span>
        <Link href={config.routeBase}>Pathway</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{hasAssignment ? 'Active guided study' : 'Independent study'}</p>
          <h1>{config.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.pill}>{hasAssignment ? formatMode(assignment?.mode ?? '') : 'Practice mode'}</span>
            <span className={styles.pill}>{formatDate(assignment?.deadline_at ?? null)}</span>
            <span className={styles.pill}>{completedCount}/{requiredCount || 5} complete</span>
          </div>
        </header>

        <section className={styles.nextPanel}>
          <div>
            <p className={styles.eyebrow}>{nextActivity ? 'Next task' : 'Finished'}</p>
            <h2>{nextLabel}</h2>
            <p>{nextDescription}</p>
          </div>
          <Link className={styles.primaryButton} href={nextHref}>{nextActivity ? 'Continue' : 'Review'}</Link>
        </section>

        <section className={styles.progressArea}>
          <div className={styles.progressTop}>
            <strong>Your route</strong>
            <span>{progressPercentage}% complete</span>
          </div>
          <div className={styles.progressBar} aria-label="Guided study progress">
            <div className={styles.progressFill} style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} />
          </div>

          <div className={styles.checklist}>
            {activityStates.map((activity, index) => {
              const isCurrent = nextActivity?.type === activity.type;
              return (
                <Link className={`${styles.step} ${activity.complete ? styles.complete : ''} ${isCurrent ? styles.current : ''}`} href={activity.href} key={activity.type}>
                  <span className={styles.stepMark}>{activity.complete ? '✓' : index + 1}</span>
                  <span className={styles.stepTitle}>{activity.label}</span>
                  <span className={styles.stepStatus}>{activity.complete ? 'Done' : isCurrent ? 'Next' : 'To do'}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </section>

      {assignmentError && <div className={styles.error}>Assignment setup warning: {assignmentError}</div>}
    </main>
  );
}
