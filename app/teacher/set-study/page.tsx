import Link from 'next/link';
import GuidedStudyAssignmentForm from '@/components/GuidedStudyAssignmentForm';
import { supabase } from '@/lib/supabase';

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

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline set';
  return new Date(value).toLocaleString('en-GB');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SetStudyPage() {
  let assignments: GuidedStudyAssignment[] = [];
  let assignmentError = '';

  if (supabase) {
    const { data, error } = await supabase
      .from('guided_study_assignments')
      .select('id, mode, required_activity_types, deadline_at, instructions, assigned_class, status, created_at')
      .eq('pathway_slug', '1905-revolution')
      .order('created_at', { ascending: false })
      .limit(5);

    assignments = (data ?? []) as GuidedStudyAssignment[];
    assignmentError = error?.message ?? '';
  }

  return (
    <main className="page-shell teacher-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Teacher dashboard / Set guided study / 1905 Revolution</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/teacher/dashboard">Teacher home</Link>
          <Link className="button secondary" href="/student/dashboard">Student dashboard</Link>
        </div>
      </div>

      <section className="teacher-hero">
        <div>
          <p className="eyebrow">Teacher-set guided study</p>
          <h1>Set the 1905 pathway</h1>
          <p>
            Choose the purpose, required activities, deadline and student instructions. This turns the 1905 pilot
            into a proper teacher-directed independent study assignment.
          </p>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Current pathway</p>
          <h2>1905 Revolution</h2>
          <p>Lesson, quiz, flashcards, PEEL response and confidence exit ticket.</p>
        </aside>
      </section>

      {!supabase && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Supabase is not configured</h2>
          <p>Add the Supabase environment variables in Vercel and redeploy before creating assignments.</p>
        </section>
      )}

      {assignmentError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <p className="eyebrow">Setup needed</p>
          <h2>Assignment table not ready</h2>
          <p>{assignmentError}</p>
          <p>Run <strong>supabase/guided-study-assignments.sql</strong> in Supabase SQL Editor, then redeploy or refresh.</p>
        </section>
      )}

      <GuidedStudyAssignmentForm />

      <section className="card" style={{ marginTop: 24 }}>
        <div className="page-header-row">
          <div>
            <p className="eyebrow">Recently set</p>
            <h2>Assignment history</h2>
          </div>
          <span className="badge">Newest first</span>
        </div>

        {assignments.length === 0 ? (
          <div className="empty-state">
            <h3>No guided study assignments found yet</h3>
            <p>Create the first assignment above. It will then appear on the student dashboard.</p>
          </div>
        ) : (
          <div className="teacher-response-list">
            {assignments.map((assignment) => (
              <article className="teacher-response-row assignment-row" key={assignment.id}>
                <div>
                  <strong>{assignment.assigned_class}</strong>
                  <small>{assignment.status}</small>
                </div>
                <div>
                  <strong>{formatMode(assignment.mode)}</strong>
                  <small>{assignment.required_activity_types.length} activities selected</small>
                </div>
                <div>
                  <strong>{formatDate(assignment.deadline_at)}</strong>
                  <small>Deadline</small>
                </div>
                <span className="status-pill submitted">Set</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
