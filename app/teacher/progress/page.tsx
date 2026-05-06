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
  return row.response_type.replaceAll('_', ' ');
}

function getScoreLabel(row: StudentResponseRow) {
  if (row.response_type === 'peel_response') {
    const wordCount = row.response_json?.wordCount;
    return typeof wordCount === 'number' ? `${wordCount} words` : 'Submitted';
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

  const percentage = row.response_json?.percentage;

  if (row.status !== 'complete' && row.status !== 'submitted') return 'Incomplete';
  if (typeof percentage === 'number' && percentage < 60) return 'Intervention';
  if (typeof percentage === 'number' && percentage < 80) return 'Check understanding';
  if (typeof percentage === 'number' && percentage >= 80) return 'Secure';
  return 'Completed';
}

function getRiskClass(risk: string) {
  if (risk === 'Secure') return 'secure';
  if (risk === 'Intervention' || risk === 'Needs development') return 'intervention';
  if (risk === 'Check understanding') return 'check';
  if (risk === 'Written evidence submitted' || risk === 'Completed') return 'submitted';
  return 'neutral';
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
  const peelRows = rows.filter((row) => row.response_type === 'peel_response');
  const interventionRows = rows.filter((row) => {
    const risk = getRiskFlag(row);
    return risk === 'Intervention' || risk === 'Needs development';
  });
  const averageQuizPercentage = quizRows.length
    ? Math.round(
        quizRows.reduce((total, row) => total + (row.response_json?.percentage ?? 0), 0) / quizRows.length
      )
    : null;

  return (
    <main className="page-shell">
      <div className="page-header-row">
        <span className="breadcrumb">Teacher dashboard / Live progress / 1905 Revolution</span>
        <Link className="button secondary" href="/student/lesson/1905">Open student pathway</Link>
      </div>

      <section className="hero">
        <p className="eyebrow">Teacher dashboard · Live from Supabase</p>
        <h1>1905 MVP Progress</h1>
        <p>
          A cleaner progress view for the first teacher-facing loop: completion evidence, quiz outcomes,
          PEEL submissions and intervention flags. This is still using the demo student and demo assignment
          while authentication is being built.
        </p>
        <div className="button-row">
          <Link className="button secondary" href="/teacher/dashboard">Back to teacher dashboard</Link>
          <span className="badge">Responses: {rows.length}</span>
          <span className="badge">Intervention flags: {interventionRows.length}</span>
        </div>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Query error</p>
          <h2>Progress query failed</h2>
          <p>{error.message}</p>
        </section>
      )}

      <section className="metric-grid">
        <article className="card metric-card teal">
          <p className="eyebrow">Responses saved</p>
          <h2>{rows.length}</h2>
          <p>Saved response records visible to the dashboard.</p>
        </article>

        <article className="card metric-card lavender">
          <p className="eyebrow">Average quiz</p>
          <h2>{averageQuizPercentage === null ? '-' : `${averageQuizPercentage}%`}</h2>
          <p>Mean retrieval score for submitted 1905 quizzes.</p>
        </article>

        <article className="card metric-card warm">
          <p className="eyebrow">PEEL submissions</p>
          <h2>{peelRows.length}</h2>
          <p>Written responses available for teacher review.</p>
        </article>

        <article className={`card metric-card ${interventionRows.length ? 'rose' : 'green'}`}>
          <p className="eyebrow">Need attention</p>
          <h2>{interventionRows.length}</h2>
          <p>Low quiz scores or underdeveloped written work.</p>
        </article>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <div className="page-header-row">
          <div>
            <p className="eyebrow">Live progress table</p>
            <h2>Student responses</h2>
          </div>
          <span className="badge">Auto-sorted by newest first</span>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <h3>No student responses found yet</h3>
            <p>Complete and save the quiz or PEEL task as the demo student first.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Activity</th>
                  <th>Outcome</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Teacher flag</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const risk = getRiskFlag(row);
                  return (
                    <tr key={row.id}>
                      <td><strong>Demo Student</strong><br /><span className="step-meta">1905 MVP pathway</span></td>
                      <td>{getActivityLabel(row)}<br /><span className="step-meta">{row.response_type}</span></td>
                      <td>{getScoreLabel(row)}</td>
                      <td>{row.status}</td>
                      <td>{formatDate(row.submitted_at)}</td>
                      <td><span className={`status-pill ${getRiskClass(risk)}`}>{risk}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {rows.length > 0 && (
        <section className="response-detail-grid">
          {rows.map((row) => {
            const risk = getRiskFlag(row);
            return (
              <article className="card response-detail-card" key={`${row.id}-detail`}>
                <aside>
                  <p className="eyebrow">Response detail</p>
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
