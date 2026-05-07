import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
  status: string;
  score: number | null;
  response_type: string;
  response_json: ResponseJson | null;
  submitted_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return 'Not submitted';
  return new Date(value).toLocaleString('en-GB');
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

function getRiskFlag(row: StudentResponseRow) {
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
  if (risk === 'Intervention' || risk === 'Needs development' || risk === 'Low confidence' || risk === 'Revisit needed') return 'intervention';
  if (risk === 'Check understanding' || risk === 'Moderate confidence') return 'check';
  if (risk === 'Written evidence submitted' || risk === 'Completed') return 'submitted';
  return 'neutral';
}

function getPriorityAction(row: StudentResponseRow) {
  const risk = getRiskFlag(row);
  if (risk === 'Intervention') return 'Set recap quiz or reteach causes/consequences.';
  if (risk === 'Needs development') return 'Review PEEL structure and ask for a stronger explain/link section.';
  if (risk === 'Low confidence') return 'Check least secure area and assign targeted flashcards.';
  if (risk === 'Revisit needed') return 'Ask the student to repeat the revisit cards before attempting another PEEL paragraph.';
  if (risk === 'Check understanding') return 'Ask student to correct missed quiz questions or re-rate uncertain cards.';
  return 'No urgent action.';
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

  const { data, error } = await supabase
    .from('student_responses')
    .select('id, status, score, response_type, response_json, submitted_at')
    .order('submitted_at', { ascending: false });

  const rows: StudentResponseRow[] = (data ?? []).map((row) => ({
    id: String(row.id),
    status: String(row.status),
    score: typeof row.score === 'number' ? row.score : null,
    response_type: String(row.response_type),
    response_json: (row.response_json ?? null) as ResponseJson | null,
    submitted_at: row.submitted_at ? String(row.submitted_at) : null,
  }));

  const quizRows = rows.filter((row) => row.response_type === 'quiz');
  const flashcardRows = rows.filter((row) => row.response_type === 'flashcards');
  const peelRows = rows.filter((row) => row.response_type === 'peel_response');
  const confidenceRows = rows.filter((row) => row.response_type === 'confidence_exit_ticket');
  const interventionRows = rows.filter((row) => {
    const risk = getRiskFlag(row);
    return risk === 'Intervention' || risk === 'Needs development' || risk === 'Low confidence' || risk === 'Revisit needed';
  });
  const averageQuizPercentage = quizRows.length
    ? Math.round(
        quizRows.reduce((total, row) => total + (row.response_json?.percentage ?? 0), 0) / quizRows.length
      )
    : null;

  return (
    <main className="page-shell teacher-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Teacher dashboard / Live progress / 1905 Revolution</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/teacher/dashboard">Teacher home</Link>
          <Link className="button secondary" href="/student/lesson/1905">Student view</Link>
        </div>
      </div>

      <section className="teacher-hero">
        <div>
          <p className="eyebrow">Live progress board · Supabase</p>
          <h1>1905 pathway overview</h1>
          <p>
            A teacher-first view of the pilot learning loop: retrieval performance, flashcard confidence,
            PEEL evidence, confidence reflection and simple next-action flags.
          </p>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Next teaching decision</p>
          <h2>{interventionRows.length ? 'Target support needed' : 'Class looks secure so far'}</h2>
          <p>{interventionRows.length ? 'Start with the flagged response cards below.' : 'Keep monitoring as more students submit.'}</p>
        </aside>
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
          <span>Responses</span>
          <strong>{rows.length}</strong>
          <small>saved records</small>
        </article>
        <article className="teacher-metric lavender">
          <span>Average quiz</span>
          <strong>{averageQuizPercentage === null ? '-' : `${averageQuizPercentage}%`}</strong>
          <small>retrieval accuracy</small>
        </article>
        <article className="teacher-metric warm">
          <span>Flashcards</span>
          <strong>{flashcardRows.length}</strong>
          <small>rated sets</small>
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
        <article className={`teacher-metric ${interventionRows.length ? 'rose' : 'green'}`}>
          <span>Attention</span>
          <strong>{interventionRows.length}</strong>
          <small>priority flags</small>
        </article>
      </section>

      <section className="teacher-board-grid">
        <article className="card teacher-panel-main">
          <div className="page-header-row">
            <div>
              <p className="eyebrow">Class progress</p>
              <h2>Response tracker</h2>
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
                return (
                  <article className="teacher-response-row" key={row.id}>
                    <div>
                      <strong>Demo Student</strong>
                      <small>1905 MVP pathway</small>
                    </div>
                    <div>
                      <strong>{getActivityLabel(row)}</strong>
                      <small>{formatDate(row.submitted_at)}</small>
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
        </article>

        <aside className="card teacher-panel-side lavender">
          <p className="eyebrow">Priority queue</p>
          <h2>What needs teacher attention?</h2>
          {interventionRows.length === 0 ? (
            <p>No urgent intervention flags yet. This panel will become the quick planning list once more students submit.</p>
          ) : (
            <div className="priority-list">
              {interventionRows.map((row) => {
                const risk = getRiskFlag(row);
                return (
                  <div className="priority-card" key={`${row.id}-priority`}>
                    <span className={`status-pill ${getRiskClass(risk)}`}>{risk}</span>
                    <h3>{getActivityLabel(row)}</h3>
                    <p>{getPriorityAction(row)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
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
                      {row.response_json?.reflection && (
                        <div className="panel lavender" style={{ marginTop: 12 }}>
                          <p className="preview-box">{row.response_json.reflection}</p>
                        </div>
                      )}
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
                      <p><strong>Submitted:</strong> {formatDate(row.submitted_at)}</p>
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
