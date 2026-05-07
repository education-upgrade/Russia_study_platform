import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type ResponseJson = {
  maxScore?: number;
  percentage?: number;
  incorrectQuestionIds?: string[];
  question?: string;
  fullResponse?: string;
  wordCount?: number;
  prompt?: string;
  confidence?: number;
  leastSecureArea?: string;
  reflection?: string;
  understandBetter?: string;
  needHelpWith?: string;
  totalCards?: number;
  ratedCount?: number;
  secureCount?: number;
  nearlyCount?: number;
  revisitCount?: number;
  revisitCardIds?: string[];
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
  if (!value) return 'No deadline';
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

function isResponseComplete(row: StudentResponseRow | undefined) {
  if (!row) return false;

  if (row.response_type === 'flashcards') {
    const ratedCount = row.response_json?.ratedCount ?? 0;
    const totalCards = row.response_json?.totalCards ?? Number.POSITIVE_INFINITY;
    return row.status === 'complete' || ratedCount >= totalCards;
  }

  return row.status === 'complete' || row.status === 'submitted';
}

function getEvidenceDetail(activityType: string, row: StudentResponseRow | undefined) {
  if (!row) return activityType === 'lesson_content' ? 'Available support' : 'Not completed';

  if (row.response_type === 'quiz') {
    return `${row.score ?? '-'}/${row.response_json?.maxScore ?? '?'}${typeof row.response_json?.percentage === 'number' ? ` · ${row.response_json.percentage}%` : ''}`;
  }

  if (row.response_type === 'flashcards') {
    return `${row.response_json?.secureCount ?? 0} secure · ${row.response_json?.revisitCount ?? 0} revisit`;
  }

  if (row.response_type === 'peel_response') {
    return `${row.response_json?.wordCount ?? 0} words`;
  }

  if (row.response_type === 'confidence_exit_ticket') {
    const confidence = row.response_json?.confidence ?? row.score ?? '-';
    const area = row.response_json?.leastSecureArea;
    return `${confidence}/5${area ? ` · ${area}` : ''}`;
  }

  return row.status;
}

function getRiskFlag(row: StudentResponseRow | undefined, activityType?: string) {
  if (!row) {
    if (activityType === 'lesson_content') return 'Support activity';
    return 'Missing evidence';
  }

  if (row.response_type === 'peel_response') {
    const wordCount = row.response_json?.wordCount ?? 0;
    if (wordCount < 40) return 'Needs development';
    return 'Submitted';
  }

  if (row.response_type === 'confidence_exit_ticket') {
    const confidence = row.response_json?.confidence ?? row.score ?? 0;
    if (confidence <= 2) return 'Low confidence';
    if (confidence === 3) return 'Check confidence';
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
  return 'Submitted';
}

function getRiskClass(risk: string) {
  if (risk === 'Secure' || risk === 'Confident') return styles.secure;
  if (risk === 'Intervention' || risk === 'Needs development' || risk === 'Low confidence' || risk === 'Revisit needed' || risk === 'Missing evidence') return styles.intervention;
  if (risk === 'Check understanding' || risk === 'Check confidence' || risk === 'Incomplete') return styles.check;
  if (risk === 'Submitted') return styles.submitted;
  return styles.neutral;
}

function getPriorityAction(row: StudentResponseRow | undefined, activityType?: string) {
  if (!row) {
    if (activityType === 'quiz') return 'Ask the student to complete the retrieval quiz first.';
    if (activityType === 'flashcards') return 'Ask the student to rate the flashcards before writing.';
    if (activityType === 'peel_response') return 'Prioritise the PEEL paragraph as written evidence.';
    if (activityType === 'confidence_exit_ticket') return 'Ask the student to complete the final confidence check.';
    return 'No saved evidence yet.';
  }

  const risk = getRiskFlag(row, activityType);
  if (risk === 'Intervention') return 'Set a recap task or reteach the weakest knowledge.';
  if (risk === 'Needs development') return 'Review PEEL structure and ask for a stronger explanation/link.';
  if (risk === 'Low confidence') return 'Use the least secure area to target a short intervention.';
  if (risk === 'Revisit needed') return 'Ask the student to repeat revisit cards before more writing.';
  if (risk === 'Check understanding') return 'Ask the student to correct weak recall before moving on.';
  if (risk === 'Incomplete') return 'Ask the student to finish and resave this activity.';
  return 'No urgent action.';
}

function getRequiredActivityProgress(activityType: string, activities: ActivityRow[], responses: StudentResponseRow[]): RequiredActivityProgress {
  const activity = activities.find((item) => item.activity_type === activityType);
  const response = activity
    ? responses.find((item) => item.activity_id === activity.id)
    : responses.find((item) => item.response_type === activityType);
  const complete = activityType === 'lesson_content' ? true : isResponseComplete(response);
  const risk = activityType === 'lesson_content' ? 'Support activity' : getRiskFlag(response, activityType);

  return {
    activityType,
    label: activityLabels[activityType] ?? activityType.replaceAll('_', ' '),
    activity,
    response,
    complete,
    risk,
    detail: getEvidenceDetail(activityType, response),
    action: getPriorityAction(response, activityType),
  };
}

function getResponseByType(rows: StudentResponseRow[], activities: ActivityRow[], activityType: string) {
  const activity = activities.find((item) => item.activity_type === activityType);
  if (!activity) return undefined;
  return rows.find((row) => row.activity_id === activity.id);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage() {
  if (!supabase) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Teacher progress</p>
              <h1>Supabase is not configured</h1>
              <p>Add the Supabase environment variables in Vercel and redeploy.</p>
            </div>
          </header>
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
    : { data: [], error: null };

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
  const progressPercentage = requiredEvidenceCount
    ? Math.round((completedRequiredCount / requiredEvidenceCount) * 100)
    : 0;
  const priorityRows = requiredEvidenceProgress.filter((item) => {
    return item.risk === 'Intervention' || item.risk === 'Needs development' || item.risk === 'Low confidence' || item.risk === 'Revisit needed' || item.risk === 'Missing evidence' || item.risk === 'Incomplete';
  });

  const quizResponse = getResponseByType(rows, activities, 'quiz');
  const flashcardResponse = getResponseByType(rows, activities, 'flashcards');
  const peelResponse = getResponseByType(rows, activities, 'peel_response');
  const confidenceResponse = getResponseByType(rows, activities, 'confidence_exit_ticket');
  const decision = priorityRows.length ? `${priorityRows[0].label} needs attention` : 'No urgent action';
  const decisionDetail = priorityRows.length ? priorityRows[0].action : 'The current required evidence is complete or low risk.';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Progress / 1905 Revolution</span>
        <Link className={styles.navButton} href="/teacher/set-study">Set study</Link>
        <Link className={styles.navButton} href="/student/dashboard">Student view</Link>
      </div>

      {assignmentError && (
        <section className={styles.error}>Assignment query warning: {assignmentError.message}</section>
      )}
      {error && (
        <section className={styles.error}>Progress query failed: {error.message}</section>
      )}

      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Teacher decision dashboard</p>
            <h1>1905 progress</h1>
            <p>{activeAssignment?.instructions ?? 'Progress is shown against the current 1905 guided study route.'}</p>
          </div>
          <aside className={styles.decisionCard}>
            <p className={styles.eyebrow}>Next action</p>
            <strong>{decision}</strong>
            <span>{decisionDetail}</span>
          </aside>
        </header>

        <section className={styles.snapshot}>
          <article className={styles.metric}>
            <span>Class</span>
            <strong>1</strong>
            <small>demo student</small>
          </article>
          <article className={styles.metric}>
            <span>Required</span>
            <strong>{completedRequiredCount}/{requiredEvidenceCount}</strong>
            <small>evidence tasks</small>
          </article>
          <article className={styles.metric}>
            <span>Progress</span>
            <strong>{progressPercentage}%</strong>
            <small>{activeAssignment ? formatMode(activeAssignment.mode) : 'default route'}</small>
          </article>
          <article className={styles.metric}>
            <span>Flags</span>
            <strong>{priorityRows.length}</strong>
            <small>need attention</small>
          </article>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Priority students</p>
              <h2>Who needs attention?</h2>
            </div>
            <span className={styles.badge}>{activeAssignment ? formatDate(activeAssignment.deadline_at) : 'No active deadline'}</span>
          </div>

          {priorityRows.length === 0 ? (
            <div className={styles.empty}>
              <h3>No urgent action</h3>
              <p>The demo student has no high-priority intervention flags on the current required route.</p>
            </div>
          ) : (
            <div className={styles.priorityList}>
              {priorityRows.map((item) => (
                <article className={styles.priorityItem} key={item.activityType}>
                  <div>
                    <strong>Demo Student</strong>
                    <small>{item.label}</small>
                  </div>
                  <p>{item.action}</p>
                  <span className={`${styles.statusPill} ${getRiskClass(item.risk)}`}>{item.risk}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.studentEvidence}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Student evidence</p>
              <h2>Demo Student</h2>
            </div>
            <span className={styles.badge}>{completedRequiredCount}/{requiredEvidenceCount} complete</span>
          </div>

          <article className={styles.studentCard}>
            <div className={styles.studentTop}>
              <div>
                <h3>1905 Revolution</h3>
                <p>{activeAssignment?.assigned_class ?? 'Year 12 Russia demo class'} · {activeAssignment ? formatMode(activeAssignment.mode) : 'guided study'}</p>
              </div>
              <span className={`${styles.statusPill} ${priorityRows.length ? styles.intervention : styles.secure}`}>
                {priorityRows.length ? `${priorityRows.length} flag${priorityRows.length === 1 ? '' : 's'}` : 'On track'}
              </span>
            </div>

            <div className={styles.evidenceGrid}>
              <article className={styles.evidenceBox}>
                <span>Quiz</span>
                <strong>{getEvidenceDetail('quiz', quizResponse)}</strong>
                <small>{getRiskFlag(quizResponse, 'quiz')}</small>
              </article>
              <article className={styles.evidenceBox}>
                <span>Flashcards</span>
                <strong>{getEvidenceDetail('flashcards', flashcardResponse)}</strong>
                <small>{getRiskFlag(flashcardResponse, 'flashcards')}</small>
              </article>
              <article className={styles.evidenceBox}>
                <span>PEEL</span>
                <strong>{getEvidenceDetail('peel_response', peelResponse)}</strong>
                <small>{getRiskFlag(peelResponse, 'peel_response')}</small>
              </article>
              <article className={styles.evidenceBox}>
                <span>Confidence</span>
                <strong>{getEvidenceDetail('confidence_exit_ticket', confidenceResponse)}</strong>
                <small>{getRiskFlag(confidenceResponse, 'confidence_exit_ticket')}</small>
              </article>
            </div>

            <details className={styles.details}>
              <summary>Open detailed evidence</summary>
              <div className={styles.detailGrid}>
                <article className={styles.detailPanel}>
                  <h4>Required route</h4>
                  {requiredProgress.map((item) => (
                    <p key={item.activityType}><strong>{item.label}:</strong> {item.detail} · {item.risk}</p>
                  ))}
                </article>
                <article className={styles.detailPanel}>
                  <h4>Confidence reflection</h4>
                  <p><strong>Understands better:</strong> {confidenceResponse?.response_json?.understandBetter ?? 'Not recorded'}</p>
                  <p><strong>Needs help with:</strong> {confidenceResponse?.response_json?.needHelpWith ?? confidenceResponse?.response_json?.reflection ?? 'Not recorded'}</p>
                  <p><strong>Least secure:</strong> {confidenceResponse?.response_json?.leastSecureArea ?? 'Not recorded'}</p>
                </article>
                <article className={styles.detailPanel}>
                  <h4>PEEL response</h4>
                  <p><strong>Words:</strong> {peelResponse?.response_json?.wordCount ?? 0}</p>
                  <p className={styles.preview}>{peelResponse?.response_json?.fullResponse ?? 'No PEEL response saved.'}</p>
                </article>
                <article className={styles.detailPanel}>
                  <h4>Quiz and flashcards</h4>
                  <p><strong>Incorrect questions:</strong> {(quizResponse?.response_json?.incorrectQuestionIds ?? []).join(', ') || 'None recorded'}</p>
                  <p><strong>Revisit cards:</strong> {(flashcardResponse?.response_json?.revisitCardIds ?? []).join(', ') || 'None recorded'}</p>
                </article>
              </div>
            </details>
          </article>
        </section>
      </section>
    </main>
  );
}
