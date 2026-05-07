import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson content',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence exit ticket',
};

type ResponseJson = {
  maxScore?: number;
  percentage?: number;
  incorrectQuestionIds?: string[];
  question?: string;
  point?: string;
  evidence?: string;
  explain?: string;
  link?: string;
  fullResponse?: string;
  wordCount?: number;
  prompt?: string;
  confidence?: number;
  leastSecureArea?: string;
  reflection?: string;
  understandBetter?: string;
  needHelpWith?: string;
  ratings?: Record<string, 'secure' | 'nearly' | 'revisit'>;
  revealedCardIds?: string[];
  totalCards?: number;
  ratedCount?: number;
  secureCount?: number;
  nearlyCount?: number;
  revisitCount?: number;
  revisitCardIds?: string[];
  completionPercentage?: number;
  securePercentage?: number;
};

type StudentResponseRow = {
  id: string;
  activity_id: string;
  status: string;
  score: number | null;
  response_type: string;
  response_json: ResponseJson | null;
  submitted_at: string | null;
};

type ActivityRow = {
  id: string;
  activity_type: string;
  title: string;
  estimated_minutes: number | null;
};

type GuidedStudyAssignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
  assigned_class: string;
  status: string;
  created_at: string;
};

type RequiredActivityProgress = {
  activityType: string;
  label: string;
  activity?: ActivityRow;
  response?: StudentResponseRow;
  complete: boolean;
  risk: string;
  detail: string;
  action: string;
};

function orderActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
  });
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline set';
  return new Date(value).toLocaleString('en-GB');
}

function formatShortDate(value: string | null) {
  if (!value) return 'Not submitted';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function getActivityLabel(row: StudentResponseRow) {
  if (row.response_type === 'peel_response') return 'PEEL response: weakening Tsarist authority';
  if (row.response_type === 'quiz') return 'Retrieval quiz: 1905 Revolution';
  if (row.response_type === 'flashcards') return 'Flashcards: 1905 key evidence';
  if (row.response_type === 'confidence_exit_ticket') return 'Confidence exit ticket: 1905 Revolution';
  return row.response_type.replaceAll('_', ' ');
}

function getScoreLabel(row: StudentResponseRow) {
  if (row.response_type === 'peel_response') {
    const wordCount = row.response_json?.wordCount;
    return typeof wordCount === 'number' ? `${wordCount} words` : 'Submitted';
  }

  if (row.response_type === 'confidence_exit_ticket') {
    const confidence = row.response_json?.confidence ?? row.score;
    const area = row.response_json?.leastSecureArea;
    return `${confidence ?? '-'}/5${area ? ` · ${area}` : ''}`;
  }

  if (row.response_type === 'flashcards') {
    const secure = row.response_json?.secureCount ?? 0;
    const nearly = row.response_json?.nearlyCount ?? 0;
    const revisit = row.response_json?.revisitCount ?? 0;
    const total = row.response_json?.totalCards ?? '?';
    return `${secure}/${total} secure · ${nearly} nearly · ${revisit} revisit`;
  }

  const maxScore = row.response_json?.maxScore;
  const percentage = row.response_json?.percentage;

  return typeof row.score === 'number'
    ? `${row.score}/${maxScore ?? '?'}${typeof percentage === 'number' ? ` (${percentage}%)` : ''}`
    : '-';
}

function isResponseComplete(row: StudentResponseRow | undefined) {
  if (!row) return false;

  if (row.response_type === 'flashcards') {
    const ratedCount = row.response_json?.ratedCount ?? 0;
    const totalCards = row.response_json?.totalCards ?? Number.POSITIVE_INFINITY;
    return row.status === 'complete' || ratedCount >= totalCards;
  }

  return row.status === 'complete' || row.status === 'submitted';
}

function getRiskFlag(row: StudentResponseRow | undefined, activityType?: string) {
  if (!row) {
    if (activityType === 'lesson_content') return 'Support activity';
    return 'Missing required evidence';
  }

  if (row.response_type === 'peel_response') {
    const wordCount = row.response_json?.wordCount ?? 0;
    if (wordCount < 40) return 'Needs development';
    return 'Written evidence submitted';
  }

  if (row.response_type === 'confidence_exit_ticket') {
    const confidence = row.response_json?.confidence ?? row.score ?? 0;
    if (confidence <= 2) return 'Low confidence';
    if (confidence === 3) return 'Moderate confidence';
    return 'Confident';
  }

  if (row.response_type === 'flashcards') {
    const totalCards = row.response_json?.totalCards ?? 0;
    const ratedCount = row.response_json?.ratedCount ?? 0;
    const revisitCount = row.response_json?.revisitCount ?? 0;
    const securePercentage = row.response_json?.securePercentage ?? 0;

    if (ratedCount < totalCards) return 'Incomplete';
    if (revisitCount > 0) return 'Revisit needed';
    if (securePercentage >= 80) return 'Secure';
    return 'Check understanding';
  }

  const percentage = row.response_json?.percentage;

  if (row.status !== 'complete' && row.status !== 'submitted') return 'Incomplete';
  if (typeof percentage === 'number' && percentage < 60) return 'Intervention';
  if (typeof percentage === 'number' && percentage < 80) return 'Check understanding';
  if (typeof percentage === 'number' && percentage >= 80) return 'Secure';
  return 'Completed';
}

function getRiskClass(risk: string) {
  if (risk === 'Secure' || risk === 'Confident') return 'secure';
  if (
    risk === 'Intervention' ||
    risk === 'Needs development' ||
    risk === 'Low confidence' ||
    risk === 'Revisit needed' ||
    risk === 'Missing required evidence'
  ) return 'intervention';
  if (risk === 'Check understanding' || risk === 'Moderate confidence' || risk === 'Incomplete') return 'check';
  if (risk === 'Written evidence submitted' || risk === 'Completed') return 'submitted';
  return 'neutral';
}

function getPriorityAction(row: StudentResponseRow | undefined, activityType?: string) {
  if (!row) {
    if (activityType === 'quiz') return 'Student has not saved the retrieval quiz. Chase completion or set a quick starter check.';
    if (activityType === 'flashcards') return 'Student has not rated the flashcards. Ask them to complete the evidence cards before writing.';
    if (activityType === 'peel_response') return 'Student has not submitted written evidence. Prioritise the PEEL paragraph.';
    if (activityType === 'confidence_exit_ticket') return 'Student has not completed the final confidence exit ticket. Ask for reflection after the evidence tasks.';
    return 'No saved evidence for this required activity yet.';
  }

  const risk = getRiskFlag(row, activityType);
  if (risk === 'Intervention') return 'Set recap quiz or reteach causes/consequences.';
  if (risk === 'Needs development') return 'Review PEEL structure and ask for a stronger explain/link section.';
  if (risk === 'Low confidence') return 'Check least secure area and assign targeted flashcards.';
  if (risk === 'Revisit needed') return 'Ask the student to repeat the revisit cards before attempting another PEEL paragraph.';
  if (risk === 'Check understanding') return 'Ask student to correct missed quiz questions or re-rate uncertain cards.';
  if (risk === 'Incomplete') return 'Ask student to finish and resave this required activity.';
  return 'No urgent action.';
}

function getRequiredActivityProgress(activityType: string, activities: ActivityRow[], responses: StudentResponseRow[]): RequiredActivityProgress {
  const activity = activities.find((item) => item.activity_type === activityType);
  const response = activity
    ? responses.find((item) => item.activity_id === activity.id)
    : responses.find((item) => item.response_type === activityType);
  const complete = activityType === 'lesson_content' ? true : isResponseComplete(response);
  const risk = activityType === 'lesson_content' ? 'Support activity' : getRiskFlag(response, activityType);
  const detail = response ? getScoreLabel(response) : activityType === 'lesson_content' ? 'Available as reading support' : 'No saved response yet';

  return {
    activityType,
    label: activityLabels[activityType] ?? activityType.replaceAll('_', ' '),
    activity,
    response,
    complete,
    risk,
    detail,
    action: getPriorityAction(response, activityType),
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage() {
  if (!supabase) {
    return (
      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">Teacher progress</p>
          <h1>Supabase is not configured</h1>
          <p>Add the Supabase environment variables in Vercel and redeploy.</p>
        </section>
      </main>
    );
  }

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  const { data: assignmentData, error: assignmentError } = await supabase
    .from('guided_study_assignments')
    .select('id, mode, required_activity_types, deadline_at, instructions, assigned_class, status, created_at')
    .eq('assigned_student_id', DEMO_STUDENT_ID)
    .eq('status', 'active')
    .eq('pathway_slug', '1905-revolution')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const activeAssignment = assignmentData as GuidedStudyAssignment | null;
  const requiredActivityTypes = orderActivityTypes(
    activeAssignment?.required_activity_types?.length
      ? activeAssignment.required_activity_types
      : PATHWAY_ACTIVITY_ORDER
  );

  const { data: activityData } = lesson?.id
    ? await supabase
        .from('activities')
        .select('id, activity_type, title, estimated_minutes')
        .eq('lesson_id', lesson.id)
    : { data: [] };

  const activities = (activityData ?? []) as ActivityRow[];
  const activityIds = activities.map((activity) => activity.id);

  const { data, error } = activityIds.length
    ? await supabase
        .from('student_responses')
        .select('id, activity_id, status, score, response_type, response_json, submitted_at')
        .eq('student_id', DEMO_STUDENT_ID)
        .in('activity_id', activityIds)
        .order('submitted_at', { ascending: false })
    : await supabase
        .from('student_responses')
        .select('id, activity_id, status, score, response_type, response_json, submitted_at')
        .eq('student_id', DEMO_STUDENT_ID)
        .order('submitted_at', { ascending: false });

  const rows: StudentResponseRow[] = (data ?? []).map((row) => ({
    id: String(row.id),
    activity_id: String(row.activity_id),
    status: String(row.status),
    score: typeof row.score === 'number' ? row.score : null,
    response_type: String(row.response_type),
    response_json: (row.response_json ?? null) as ResponseJson | null,
    submitted_at: row.submitted_at ? String(row.submitted_at) : null,
  }));

  const requiredProgress = requiredActivityTypes.map((activityType) => getRequiredActivityProgress(activityType, activities, rows));
  const requiredEvidenceProgress = requiredProgress.filter((item) => item.activityType !== 'lesson_content');
  const completedRequiredCount = requiredEvidenceProgress.filter((item) => item.complete).length;
  const requiredEvidenceCount = requiredEvidenceProgress.length;
  const assignmentProgressPercentage = requiredEvidenceCount
    ? Math.round((completedRequiredCount / requiredEvidenceCount) * 100)
    : 0;
  const missingRequired = requiredEvidenceProgress.filter((item) => !item.complete);
  const requiredResponseIds = new Set(requiredProgress.map((item) => item.response?.id).filter(Boolean));

  const quizRows = rows.filter((row) => row.response_type === 'quiz');
  const peelRows = rows.filter((row) => row.response_type === 'peel_response');
  const confidenceRows = rows.filter((row) => row.response_type === 'confidence_exit_ticket');
  const assignmentRiskRows = requiredEvidenceProgress.filter((item) => {
    return item.risk === 'Intervention' || item.risk === 'Needs development' || item.risk === 'Low confidence' || item.risk === 'Revisit needed' || item.risk === 'Missing required evidence';
  });
  const averageQuizPercentage = quizRows.length
    ? Math.round(
        quizRows.reduce((total, row) => total + (row.response_json?.percentage ?? 0), 0) / quizRows.length
      )
    : null;

  return (
    <main className="page-shell teacher-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Teacher dashboard / Assignment progress / 1905 Revolution</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/teacher/dashboard">Teacher home</Link>
          <Link className="button secondary" href="/teacher/set-study">Set study</Link>
          <Link className="button secondary" href="/student/lesson/1905">Student view</Link>
        </div>
      </div>

      <section className="teacher-hero">
        <div>
          <p className="eyebrow">Assignment-aware progress board</p>
          <h1>1905 guided study evidence</h1>
          <p>
            This view now checks progress against the work actually set by the teacher, not just any activity data.
            The hierarchy keeps the confidence exit ticket as the final activity.
          </p>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Next teaching decision</p>
          <h2>{assignmentRiskRows.length ? 'Target support needed' : 'Set work is on track'}</h2>
          <p>{assignmentRiskRows.length ? 'Start with the assignment-specific priority list below.' : 'All required evidence is either complete or low risk.'}</p>
        </aside>
      </section>

      {assignmentError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Assignment query warning</p>
          <h2>Could not read the latest assignment</h2>
          <p>{assignmentError.message}</p>
        </section>
      )}

      <section className="card assignment-progress-overview" style={{ marginTop: 24 }}>
        <div className="page-header-row">
          <div>
            <p className="eyebrow">Current assignment</p>
            <h2>{activeAssignment ? formatMode(activeAssignment.mode) : 'No active assignment found'}</h2>
            <p>{activeAssignment?.instructions ?? 'Using the full 1905 pathway as the default progress model.'}</p>
          </div>
          <div className="assignment-deadline-card">
            <p className="eyebrow">Deadline</p>
            <strong>{formatDate(activeAssignment?.deadline_at ?? null)}</strong>
            <span>{activeAssignment?.assigned_class ?? 'Year 12 Russia demo class'}</span>
          </div>
        </div>

        <div className="progress-bar" aria-label="Required assignment completion progress">
          <div className="progress-fill" style={{ '--progress': `${assignmentProgressPercentage}%` } as React.CSSProperties} />
        </div>

        <div className="assignment-progress-grid">
          <div>
            <p className="eyebrow">Required completion</p>
            <h3>{completedRequiredCount}/{requiredEvidenceCount} evidence tasks complete · {assignmentProgressPercentage}%</h3>
          </div>
          <div className="assignment-pill-list">
            {requiredActivityTypes.map((activityType) => (
              <span className="requirement-pill required" key={activityType}>{activityLabels[activityType] ?? activityType}</span>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Query error</p>
          <h2>Progress query failed</h2>
          <p>{error.message}</p>
        </section>
      )}

      <section className="teacher-metric-strip six">
        <article className="teacher-metric teal">
          <span>Required complete</span>
          <strong>{completedRequiredCount}/{requiredEvidenceCount}</strong>
          <small>assignment evidence</small>
        </article>
        <article className="teacher-metric lavender">
          <span>Average quiz</span>
          <strong>{averageQuizPercentage === null ? '-' : `${averageQuizPercentage}%`}</strong>
          <small>retrieval accuracy</small>
        </article>
        <article className="teacher-metric warm">
          <span>Missing</span>
          <strong>{missingRequired.length}</strong>
          <small>required tasks</small>
        </article>
        <article className="teacher-metric warm">
          <span>PEEL</span>
          <strong>{peelRows.length}</strong>
          <small>written submissions</small>
        </article>
        <article className="teacher-metric lavender">
          <span>Confidence</span>
          <strong>{confidenceRows.length}</strong>
          <small>exit tickets</small>
        </article>
        <article className={`teacher-metric ${assignmentRiskRows.length ? 'rose' : 'green'}`}>
          <span>Priority</span>
          <strong>{assignmentRiskRows.length}</strong>
          <small>assignment flags</small>
        </article>
      </section>

      <section className="teacher-board-grid">
        <article className="card teacher-panel-main">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Assignment tracker</p>
              <h2>Required activity evidence</h2>
            </div>
            <span className="badge">Exit ticket last</span>
          </div>

          <div className="teacher-response-list">
            {requiredProgress.map((item) => (
              <article className="teacher-response-row assignment-aware-row" key={item.activityType}>
                <div>
                  <strong>Demo Student</strong>
                  <small>1905 MVP pathway</small>
                </div>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.activity?.title ?? 'Activity not found in seed data'}</small>
                </div>
                <div>
                  <strong>{item.detail}</strong>
                  <small>{item.response ? formatShortDate(item.response.submitted_at) : item.activityType === 'lesson_content' ? 'Optional reading support' : 'Missing'}</small>
                </div>
                <span className={`status-pill ${getRiskClass(item.risk)}`}>{item.risk}</span>
              </article>
            ))}
          </div>
        </article>

        <aside className="card teacher-panel-side lavender">
          <p className="eyebrow">Priority queue</p>
          <h2>What needs teacher attention?</h2>
          {assignmentRiskRows.length === 0 ? (
            <p>No urgent assignment-specific intervention flags yet. Keep monitoring as students complete the pathway.</p>
          ) : (
            <div className="priority-list">
              {assignmentRiskRows.map((item) => (
                <div className="priority-card" key={`${item.activityType}-priority`}>
                  <span className={`status-pill ${getRiskClass(item.risk)}`}>{item.risk}</span>
                  <h3>{item.label}</h3>
                  <p>{item.action}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <div className="page-header-row">
          <div>
            <p className="eyebrow">All saved evidence</p>
            <h2>Raw response tracker</h2>
          </div>
          <span className="badge">Newest first</span>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <h3>No student responses found yet</h3>
            <p>Complete and save the quiz, flashcards, PEEL task or exit ticket as the demo student first.</p>
          </div>
        ) : (
          <div className="teacher-response-list">
            {rows.map((row) => {
              const risk = getRiskFlag(row);
              const isRequiredResponse = requiredResponseIds.has(row.id);
              return (
                <article className="teacher-response-row" key={row.id}>
                  <div>
                    <strong>Demo Student</strong>
                    <small>{isRequiredResponse ? 'Required assignment evidence' : 'Optional / previous evidence'}</small>
                  </div>
                  <div>
                    <strong>{getActivityLabel(row)}</strong>
                    <small>{formatShortDate(row.submitted_at)}</small>
                  </div>
                  <div>
                    <strong>{getScoreLabel(row)}</strong>
                    <small>{row.status}</small>
                  </div>
                  <span className={`status-pill ${getRiskClass(risk)}`}>{risk}</span>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {rows.length > 0 && (
        <section className="response-detail-grid improved-details">
          {rows.map((row) => {
            const risk = getRiskFlag(row);
            return (
              <article className="card response-detail-card" key={`${row.id}-detail`}>
                <aside>
                  <p className="eyebrow">Evidence detail</p>
                  <h2>Demo Student</h2>
                  <p>{getActivityLabel(row)}</p>
                  <span className={`status-pill ${getRiskClass(risk)}`}>{risk}</span>
                </aside>

                <section>
                  {row.response_type === 'peel_response' ? (
                    <>
                      <p><strong>Question:</strong> {row.response_json?.question ?? 'Not recorded'}</p>
                      <p><strong>Word count:</strong> {row.response_json?.wordCount ?? 0}</p>
                      <div className="panel lavender" style={{ marginTop: 12 }}>
                        <p className="preview-box">{row.response_json?.fullResponse ?? 'No written response saved.'}</p>
                      </div>
                    </>
                  ) : row.response_type === 'confidence_exit_ticket' ? (
                    <>
                      <p><strong>Prompt:</strong> {row.response_json?.prompt ?? 'Not recorded'}</p>
                      <p><strong>Confidence:</strong> {row.response_json?.confidence ?? row.score ?? '-'}/5</p>
                      <p><strong>Least secure area:</strong> {row.response_json?.leastSecureArea ?? 'Not recorded'}</p>
                      <p><strong>Understands better:</strong> {row.response_json?.understandBetter ?? 'Not recorded'}</p>
                      <p><strong>Needs help with:</strong> {row.response_json?.needHelpWith ?? row.response_json?.reflection ?? 'Not recorded'}</p>
                    </>
                  ) : row.response_type === 'flashcards' ? (
                    <>
                      <p><strong>Rated:</strong> {row.response_json?.ratedCount ?? 0}/{row.response_json?.totalCards ?? '?'} cards</p>
                      <p><strong>Secure:</strong> {row.response_json?.secureCount ?? 0}</p>
                      <p><strong>Nearly:</strong> {row.response_json?.nearlyCount ?? 0}</p>
                      <p><strong>Revisit:</strong> {row.response_json?.revisitCount ?? 0}</p>
                      <p><strong>Revisit card IDs:</strong> {(row.response_json?.revisitCardIds ?? []).join(', ') || 'None'}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Outcome:</strong> {getScoreLabel(row)}</p>
                      <p><strong>Incorrect question IDs:</strong> {(row.response_json?.incorrectQuestionIds ?? []).join(', ') || 'None'}</p>
                      <p><strong>Submitted:</strong> {formatShortDate(row.submitted_at)}</p>
                    </>
                  )}
                </section>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
