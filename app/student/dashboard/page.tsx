import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson content',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence exit ticket',
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

type Activity = {
  id: string;
  activity_type: string;
};

type StudentResponse = {
  activity_id: string;
  response_type: string;
  status: string;
  response_json: any;
};

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline set';
  return new Date(value).toLocaleString('en-GB');
}

function isActivityComplete(activityType: string, response: StudentResponse | undefined) {
  if (activityType === 'lesson_content') return true;
  if (!response) return false;

  if (activityType === 'flashcards') {
    const json = response.response_json ?? {};
    return response.status === 'complete' || (json.ratedCount ?? 0) >= (json.totalCards ?? Number.POSITIVE_INFINITY);
  }

  return response.status === 'complete' || response.status === 'submitted';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentDashboardPage() {
  let assignment: GuidedStudyAssignment | null = null;
  let assignmentError = '';
  let progressPercentage = 0;
  let completedCount = 0;
  let requiredCount = 0;
  let nextActivityLabel = 'Open pathway';
  let activityStates: { type: string; label: string; complete: boolean }[] = [];

  if (supabase) {
    const { data: assignmentData, error } = await supabase
      .from('guided_study_assignments')
      .select('id, mode, required_activity_types, deadline_at, instructions, status, created_at')
      .eq('assigned_student_id', DEMO_STUDENT_ID)
      .eq('status', 'active')
      .eq('pathway_slug', '1905-revolution')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    assignment = assignmentData as GuidedStudyAssignment | null;
    assignmentError = error?.message ?? '';

    if (assignment) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
        .single();

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
              .select('activity_id, response_type, status, response_json')
              .eq('student_id', DEMO_STUDENT_ID)
              .in('activity_id', activityIds)
          : { data: [] };

        const responseByActivityType = lessonActivities.reduce<Record<string, StudentResponse | undefined>>((acc, activity) => {
          const matchingResponse = ((responses ?? []) as StudentResponse[]).find((response) => response.activity_id === activity.id);
          acc[activity.activity_type] = matchingResponse;
          return acc;
        }, {});

        activityStates = assignment.required_activity_types.map((activityType) => ({
          type: activityType,
          label: activityLabels[activityType] ?? activityType.replaceAll('_', ' '),
          complete: isActivityComplete(activityType, responseByActivityType[activityType]),
        }));

        requiredCount = activityStates.length;
        completedCount = activityStates.filter((activity) => activity.complete).length;
        progressPercentage = requiredCount ? Math.round((completedCount / requiredCount) * 100) : 0;
        nextActivityLabel = activityStates.find((activity) => !activity.complete)?.label ?? 'Review pathway';
      }
    }
  }

  const hasAssignment = Boolean(assignment);

  return (
    <main className="page-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Student dashboard / Guided study</span>
        <Link className="button secondary" href="/student/lesson/1905">Open pathway</Link>
      </div>

      <section className="hero">
        <p className="eyebrow">My Guided Study</p>
        <h1>{hasAssignment ? '1905 Revolution assignment' : '1905 Revolution pathway'}</h1>
        <p>
          {hasAssignment
            ? assignment?.instructions
            : 'No teacher-set assignment is active yet. You can still use the 1905 pathway for independent revision.'}
        </p>
        <div className="button-row">
          <Link className="button" href="/student/lesson/1905">{hasAssignment ? 'Continue guided study' : 'Start independent study'}</Link>
          <span className="badge">Next step: {nextActivityLabel}</span>
        </div>
      </section>

      {assignmentError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Setup needed</p>
          <h2>Assignment table not ready</h2>
          <p>{assignmentError}</p>
        </section>
      )}

      <section className="grid two">
        <article className="card teal">
          <p className="eyebrow">Current assignment</p>
          <h2>Was the 1905 Revolution a turning point for Tsarist Russia?</h2>
          <p>{hasAssignment ? `Mode: ${formatMode(assignment?.mode ?? '')}` : 'Independent practice mode'}</p>
          <div className="progress-bar"><div className="progress-fill" style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} /></div>
          <p><strong>Progress:</strong> {completedCount}/{requiredCount || 5} required activities complete · {progressPercentage}%</p>
          <p><strong>Deadline:</strong> {formatDate(assignment?.deadline_at ?? null)}</p>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Exam skill focus</p>
          <h2>How far did the 1905 Revolution weaken Tsarist authority?</h2>
          <p>Use Point, Evidence, Explain and Link judgement to build one focused paragraph.</p>
          <Link className="button secondary" href="/student/lesson/1905#activity-4">Go to PEEL task</Link>
        </article>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <p className="eyebrow">Assignment map</p>
        <h2>What you need to complete</h2>
        <div className="step-list">
          {(activityStates.length ? activityStates : [
            { type: 'lesson_content', label: 'Lesson content', complete: false },
            { type: 'quiz', label: 'Retrieval quiz', complete: false },
            { type: 'flashcards', label: 'Flashcards', complete: false },
            { type: 'peel_response', label: 'PEEL response', complete: false },
            { type: 'confidence_exit_ticket', label: 'Confidence exit ticket', complete: false },
          ]).map((activity, index) => (
            <div className={`step-chip ${activity.complete ? 'complete' : ''}`} key={activity.type}>
              <span className="step-number">{activity.complete ? '✓' : index + 1}</span>
              <span>
                <strong>{activity.label}</strong><br />
                <span className="step-meta">{activity.complete ? 'Complete' : 'Required 1905 activity'}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
