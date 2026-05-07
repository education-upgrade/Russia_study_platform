import Link from 'next/link';
import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
import FlashcardActivity from '@/components/FlashcardActivity';
import PeelResponseActivity from '@/components/PeelResponseActivity';
import QuizActivity from '@/components/QuizActivity';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

const TRACKABLE_ACTIVITY_TYPES = ['quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

type Activity = {
  id: string;
  activity_type: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
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

type RequirementState = 'required' | 'optional';

const activityDesign: Record<string, { tone: string; label: string; purpose: string; action: string }> = {
  lesson_content: {
    tone: 'teal',
    label: 'Learn',
    purpose: 'Build the core narrative before testing yourself.',
    action: 'Read the three notes and identify the main reason 1905 mattered.',
  },
  quiz: {
    tone: 'lavender',
    label: 'Retrieve',
    purpose: 'Check precise recall and expose gaps quickly.',
    action: 'Answer without notes first, then review what needs revisiting.',
  },
  flashcards: {
    tone: 'warm',
    label: 'Rehearse',
    purpose: 'Secure the key evidence before writing.',
    action: 'Say the answer aloud before revealing. Rate each card as secure, nearly or revisit.',
  },
  peel_response: {
    tone: 'teal',
    label: 'Apply',
    purpose: 'Turn knowledge into exam-ready explanation.',
    action: 'Build one focused PEEL paragraph with a clear judgement link.',
  },
  confidence_exit_ticket: {
    tone: 'lavender',
    label: 'Reflect',
    purpose: 'Tell the teacher what feels secure and what still needs support.',
    action: 'Be honest: this helps guide recap and intervention.',
  },
};

function getActivityDesign(activityType: string) {
  return activityDesign[activityType] ?? {
    tone: '',
    label: 'Study',
    purpose: 'Complete this guided study activity.',
    action: 'Complete the task carefully and save where prompted.',
  };
}

function formatActivityType(activityType: string) {
  return activityType.replaceAll('_', ' ');
}

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActivityStatus(activity: Activity, response: StudentResponse | undefined, hasAnyEvidence: boolean): ActivityStatus {
  const json = response?.response_json ?? {};

  if (activity.activity_type === 'lesson_content') {
    return {
      label: hasAnyEvidence ? 'Studied' : 'Start here',
      detail: hasAnyEvidence ? 'Content has probably been used before saved tasks.' : 'Read this before completing the evidence tasks.',
      tone: hasAnyEvidence ? 'complete' : 'neutral',
      isComplete: hasAnyEvidence,
      isTrackable: false,
    };
  }

  if (!response) {
    return {
      label: 'Not started',
      detail: 'No saved evidence yet.',
      tone: 'neutral',
      isComplete: false,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'quiz') {
    const percentage = typeof json.percentage === 'number' ? ` · ${json.percentage}%` : '';
    return {
      label: 'Complete',
      detail: `Score: ${response.score ?? '-'}/${json.maxScore ?? '?'}${percentage}`,
      tone: 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'flashcards') {
    const ratedCount = json.ratedCount ?? 0;
    const totalCards = json.totalCards ?? '?';
    const revisitCount = json.revisitCount ?? 0;
    const secureCount = json.secureCount ?? 0;
    const isComplete = response.status === 'complete' || ratedCount >= (json.totalCards ?? Number.POSITIVE_INFINITY);

    return {
      label: isComplete ? (revisitCount > 0 ? 'Complete · revisit' : 'Complete') : 'In progress',
      detail: `${ratedCount}/${totalCards} rated · ${secureCount} secure · ${revisitCount} revisit`,
      tone: isComplete ? (revisitCount > 0 ? 'warning' : 'complete') : 'started',
      isComplete,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'peel_response') {
    const wordCount = json.wordCount ?? 0;
    return {
      label: 'Submitted',
      detail: `${wordCount} words${formatDate(response.submitted_at) ? ` · ${formatDate(response.submitted_at)}` : ''}`,
      tone: wordCount < 40 ? 'warning' : 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  if (activity.activity_type === 'confidence_exit_ticket') {
    const confidence = json.confidence ?? response.score ?? '-';
    const area = json.leastSecureArea ? ` · ${json.leastSecureArea}` : '';
    return {
      label: 'Submitted',
      detail: `Confidence: ${confidence}/5${area}`,
      tone: Number(confidence) <= 2 ? 'warning' : 'complete',
      isComplete: true,
      isTrackable: true,
    };
  }

  return {
    label: response.status === 'complete' || response.status === 'submitted' ? 'Complete' : 'In progress',
    detail: response.last_saved_at ? `Last saved ${formatDate(response.last_saved_at)}` : 'Saved response found.',
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
      title: hasAssignment ? 'Assignment complete' : 'Pathway complete',
      detail: hasAssignment
        ? 'All required evidence tasks have been saved. Optional support remains available if you want to revise further.'
        : 'All trackable evidence tasks have been saved. Review your revisit list or improve your PEEL response if needed.',
      href: '#activity-1',
    };
  }

  const index = activities.findIndex((activity) => activity.id === firstIncomplete.id);
  const design = getActivityDesign(firstIncomplete.activity_type);

  return {
    title: `${design.label}: ${firstIncomplete.title}`,
    detail: statusByActivityId[firstIncomplete.id]?.detail ?? design.action,
    href: `#activity-${index + 1}`,
  };
}

function ActivityCard({
  activity,
  index,
  status,
  requirementState,
}: {
  activity: Activity;
  index: number;
  status: ActivityStatus;
  requirementState: RequirementState;
}) {
  const content = activity.content_json ?? {};
  const design = getActivityDesign(activity.activity_type);
  const requirementLabel = requirementState === 'required' ? 'Required assignment activity' : 'Optional support';

  return (
    <article className={`study-task-card ${design.tone} ${requirementState}`} id={`activity-${index + 1}`}>
      <div className="study-task-header">
        <div className="task-index-block">
          <span className="task-index">{index + 1}</span>
          <span className="task-line" />
        </div>
        <div className="task-title-area">
          <div className="task-title-status-row">
            <p className="eyebrow">{design.label} · {formatActivityType(activity.activity_type)}</p>
            <div className="activity-pill-row">
              <span className={`requirement-pill ${requirementState}`}>{requirementLabel}</span>
              <span className={`completion-pill ${status.tone}`}>{status.label}</span>
            </div>
          </div>
          <h2>{activity.title}</h2>
          <p>{design.purpose}</p>
          <div className="activity-summary">
            <span className="badge">{activity.estimated_minutes ?? '?'} mins</span>
            <span className="badge">{activity.skill_focus ?? 'Core knowledge'}</span>
            {activity.difficulty && <span className="badge">{activity.difficulty}</span>}
            <span className={`status-detail-badge ${status.tone}`}>{status.detail}</span>
          </div>
        </div>
        <aside className="task-instruction-card">
          <p className="eyebrow">What to do</p>
          <p>{design.action}</p>
        </aside>
      </div>

      <div className="study-task-body">
        {activity.activity_type === 'lesson_content' && Array.isArray(content.sections) && (
          <div className="lesson-section-grid improved">
            {content.sections.map((section: { heading: string; body: string }, sectionIndex: number) => (
              <section className="panel lesson-note" key={section.heading}>
                <span className="note-number">{sectionIndex + 1}</span>
                <p className="eyebrow">Core explanation</p>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        )}

        {activity.activity_type === 'quiz' && Array.isArray(content.questions) && (
          <QuizActivity activityId={activity.id} questions={content.questions} />
        )}

        {activity.activity_type === 'flashcards' && Array.isArray(content.cards) && (
          <FlashcardActivity activityId={activity.id} cards={content.cards} />
        )}

        {activity.activity_type === 'peel_response' && (
          <PeelResponseActivity
            activityId={activity.id}
            question={content.question ?? 'Write a PEEL response.'}
            stretchQuestion={content.stretchQuestion}
            scaffold={Array.isArray(content.scaffold) ? content.scaffold : undefined}
          />
        )}

        {activity.activity_type === 'confidence_exit_ticket' && (
          <ConfidenceExitTicketActivity
            activityId={activity.id}
            prompt={content.prompt ?? 'How confident are you with this topic?'}
            scale={Array.isArray(content.scale) ? content.scale : undefined}
            leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : undefined}
          />
        )}
      </div>
    </article>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Russia1905LessonPage() {
  if (!supabase) {
    return (
      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">Student lesson</p>
          <h1>Supabase is not configured</h1>
          <p>Add the Supabase environment variables in Vercel and redeploy.</p>
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
      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">Student lesson</p>
          <h1>1905 lesson not found</h1>
          <p>{lessonError?.message ?? 'Run the 1905 seed SQL in Supabase.'}</p>
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
  const requiredActivityTypes = activeAssignment?.required_activity_types?.length
    ? activeAssignment.required_activity_types
    : orderedFallbackRequiredTypes();

  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .order('estimated_minutes', { ascending: true });

  const orderedActivities = (activities ?? []) as Activity[];
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

  const totalMinutes = orderedActivities.reduce(
    (total, activity) => total + (activity.estimated_minutes ?? 0),
    0
  );
  const requiredMinutes = requiredActivities.reduce(
    (total, activity) => total + (activity.estimated_minutes ?? 0),
    0
  );
  const savedEvidencePoints = requiredActivities.filter((activity) =>
    TRACKABLE_ACTIVITY_TYPES.includes(activity.activity_type)
  ).length;
  const hasAnyEvidence = Object.keys(responseByActivityId).length > 0;
  const statusByActivityId = orderedActivities.reduce<Record<string, ActivityStatus>>((acc, activity) => {
    acc[activity.id] = getActivityStatus(activity, responseByActivityId[activity.id], hasAnyEvidence);
    return acc;
  }, {});
  const allTrackableStatuses = Object.values(statusByActivityId).filter((status) => status.isTrackable);
  const requiredTrackableStatuses = requiredActivities
    .map((activity) => statusByActivityId[activity.id])
    .filter((status) => status?.isTrackable);
  const progressStatuses = hasAssignment ? requiredTrackableStatuses : allTrackableStatuses;
  const completedTrackableCount = progressStatuses.filter((status) => status.isComplete).length;
  const progressPercentage = progressStatuses.length
    ? Math.round((completedTrackableCount / progressStatuses.length) * 100)
    : 0;
  const nextTask = getNextTask(orderedActivities, statusByActivityId, requiredActivityTypes, hasAssignment);
  const assignmentMode = activeAssignment ? formatMode(activeAssignment.mode) : 'independent study';
  const deadlineText = activeAssignment?.deadline_at ? formatDate(activeAssignment.deadline_at) : 'No deadline set';

  return (
    <main className="page-shell study-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Student pathway / Year 12 Russia / 1905 Revolution</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
          <span className="badge">Live from Supabase</span>
        </div>
      </div>

      <section className="study-hero">
        <div className="study-hero-main">
          <p className="eyebrow">{hasAssignment ? 'Teacher-set guided study' : 'Independent guided study track'}</p>
          <h1>{lesson.title}</h1>
          <p>{activeAssignment?.instructions ?? lesson.enquiry_question}</p>
          <div className="hero-stat-row">
            <span className="hero-stat"><strong>{hasAssignment ? requiredMinutes : totalMinutes || lesson.estimated_minutes || 45}</strong> mins</span>
            <span className="hero-stat"><strong>{hasAssignment ? requiredActivities.length : orderedActivities.length}</strong> required</span>
            <span className="hero-stat"><strong>{savedEvidencePoints}</strong> saved evidence points</span>
            <span className="hero-stat"><strong>{progressPercentage}%</strong> complete</span>
          </div>
          <div className="assignment-context-card">
            <div>
              <p className="eyebrow">Assignment settings</p>
              <h2>{hasAssignment ? assignmentMode : 'No active teacher assignment'}</h2>
              <p>{hasAssignment ? `Deadline: ${deadlineText}` : 'All activities are available as independent study until a teacher assignment is set.'}</p>
            </div>
            <div className="assignment-pill-list">
              {requiredActivityTypes.map((activityType) => (
                <span className="requirement-pill required" key={activityType}>{formatActivityType(activityType)}</span>
              ))}
            </div>
          </div>
          <div className="pathway-progress-card">
            <div className="page-header-row compact-header">
              <div>
                <p className="eyebrow">{hasAssignment ? 'Required assignment progress' : 'Pathway progress'}</p>
                <h2>{completedTrackableCount}/{progressStatuses.length} trackable activities complete</h2>
              </div>
              <span className={`completion-pill ${progressPercentage === 100 ? 'complete' : progressPercentage > 0 ? 'started' : 'neutral'}`}>
                {progressPercentage === 100 ? 'Complete' : progressPercentage > 0 ? 'In progress' : 'Not started'}
              </span>
            </div>
            <div className="progress-bar" aria-label="Pathway completion progress">
              <div className="progress-fill" style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} />
            </div>
          </div>
        </div>
        <aside className="study-hero-panel next-task-panel">
          <p className="eyebrow">Next recommended task</p>
          <h2>{nextTask.title}</h2>
          <p>{nextTask.detail}</p>
          <a className="button" href={nextTask.href}>{progressPercentage === 100 ? 'Review pathway' : 'Go to next task'}</a>
        </aside>
      </section>

      {activitiesError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity query failed</h2>
          <p>{activitiesError.message}</p>
        </section>
      )}

      {orderedActivities.length === 0 && !activitiesError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>No activities found</h2>
          <p>The lesson exists, but no activities are linked to it yet.</p>
        </section>
      )}

      {orderedActivities.length > 0 && (
        <div className="study-layout">
          <aside className="study-route-card">
            <p className="eyebrow">Pathway map</p>
            <h2>{hasAssignment ? 'Required first' : 'Your route'}</h2>
            <p>{hasAssignment ? 'Complete the required assignment activities first. Optional support remains available underneath.' : 'Move down the sequence. Each saved activity now shows its completion state.'}</p>
            <div className="mini-progress-list">
              {orderedActivities.map((activity, index) => {
                const design = getActivityDesign(activity.activity_type);
                const status = statusByActivityId[activity.id];
                const requirementState: RequirementState = requiredActivityTypes.includes(activity.activity_type) ? 'required' : 'optional';
                return (
                  <a className={`mini-progress-item ${status.tone} ${requirementState}`} href={`#activity-${index + 1}`} key={activity.id}>
                    <span>{status.isComplete ? '✓' : index + 1}</span>
                    <div>
                      <strong>{design.label}</strong>
                      <small>{activity.title}</small>
                      <em>{requirementState === 'required' ? 'Required' : 'Optional support'} · {status.label}</em>
                    </div>
                  </a>
                );
              })}
            </div>
          </aside>

          <section className="study-task-stack">
            {requiredActivities.length > 0 && (
              <div className="task-section-heading">
                <p className="eyebrow">Assignment activities</p>
                <h2>Required for this guided study</h2>
              </div>
            )}

            {requiredActivities.map((activity) => {
              const index = orderedActivities.findIndex((item) => item.id === activity.id);
              return (
                <ActivityCard
                  activity={activity}
                  index={index}
                  status={statusByActivityId[activity.id]}
                  requirementState="required"
                  key={activity.id}
                />
              );
            })}

            {optionalActivities.length > 0 && (
              <div className="task-section-heading optional-support-heading">
                <p className="eyebrow">Optional support</p>
                <h2>Use these if you need extra help</h2>
              </div>
            )}

            {optionalActivities.map((activity) => {
              const index = orderedActivities.findIndex((item) => item.id === activity.id);
              return (
                <ActivityCard
                  activity={activity}
                  index={index}
                  status={statusByActivityId[activity.id]}
                  requirementState="optional"
                  key={activity.id}
                />
              );
            })}
          </section>
        </div>
      )}
    </main>
  );
}

function orderedFallbackRequiredTypes() {
  return ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];
}
