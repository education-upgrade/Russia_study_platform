import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type ResponseJson = {
  maxScore?: number;
  percentage?: number;
  incorrectQuestionIds?: string[];
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

function getRiskFlag(row: StudentResponseRow) {
  const maxScore = row.response_json?.maxScore;
  const percentage = row.response_json?.percentage;

  if (row.status !== 'complete' && row.status !== 'submitted') return 'Incomplete';
  if (typeof percentage === 'number' && percentage < 60) return 'Intervention';
  if (typeof percentage === 'number' && percentage < 80) return 'Check understanding';
  if (typeof maxScore === 'number' && row.score === maxScore) return 'Secure';
  return 'Completed';
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

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Teacher dashboard · Live from Supabase</p>
        <h1>1905 MVP Progress</h1>
        <p>
          This page reads live saved student response data from Supabase. It is currently using the
          demo student and demo assignment while authentication is being built.
        </p>
        <div className="button-row">
          <Link className="button secondary" href="/teacher/dashboard">Back to teacher dashboard</Link>
          <Link className="button" href="/student/lesson/1905">Open student pathway</Link>
        </div>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Query error</p>
          <h2>Progress query failed</h2>
          <p>{error.message}</p>
        </section>
      )}

      <section className="grid">
        <article className="card teal">
          <p className="eyebrow">Responses saved</p>
          <h2>{rows.length}</h2>
          <p>Number of saved student response records currently visible to the teacher dashboard.</p>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Current MVP focus</p>
          <h2>Quiz score visibility</h2>
          <p>The first teacher/student data loop is complete when this page shows the saved quiz result.</p>
        </article>
      </section>

      <section className="card" style={{ marginTop: 24, overflowX: 'auto' }}>
        <p className="eyebrow">Live progress table</p>
        <h2>Student responses</h2>

        {rows.length === 0 ? (
          <p>No student responses found yet. Complete and save the quiz as the demo student first.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>Activity</th>
                <th>Type</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const maxScore = row.response_json?.maxScore;
                const percentage = row.response_json?.percentage;
                const scoreLabel = typeof row.score === 'number'
                  ? `${row.score}/${maxScore ?? '?'}${typeof percentage === 'number' ? ` (${percentage}%)` : ''}`
                  : '-';

                return (
                  <tr key={row.id}>
                    <td>Demo Student</td>
                    <td>1905 Revolution MVP Pathway</td>
                    <td>Retrieval quiz: 1905 Revolution</td>
                    <td>{row.response_type}</td>
                    <td>{scoreLabel}</td>
                    <td>{row.status}</td>
                    <td>{formatDate(row.submitted_at)}</td>
                    <td><span className="badge">{getRiskFlag(row)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {rows.map((row) => (
        <section className="card" style={{ marginTop: 18 }} key={`${row.id}-detail`}>
          <p className="eyebrow">Response detail</p>
          <h2>Demo Student · Retrieval quiz: 1905 Revolution</h2>
          <p><strong>Incorrect question IDs:</strong> {(row.response_json?.incorrectQuestionIds ?? []).join(', ') || 'None'}</p>
          <p><strong>Submitted:</strong> {formatDate(row.submitted_at)}</p>
        </section>
      ))}
    </main>
  );
}
