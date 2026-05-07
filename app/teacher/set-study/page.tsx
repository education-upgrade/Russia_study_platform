import Link from 'next/link';
import GuidedStudyAssignmentForm from '@/components/GuidedStudyAssignmentForm';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

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
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
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
      .limit(3);

    assignments = (data ?? []) as GuidedStudyAssignment[];
    assignmentError = error?.message ?? '';
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Set guided study / 1905 Revolution</span>
        <Link className={styles.navButton} href="/teacher/progress">Progress</Link>
        <Link className={styles.navButton} href="/student/dashboard">Student view</Link>
      </div>

      {!supabase && (
        <section className={styles.notice}>
          Supabase is not configured. Add the environment variables in Vercel and redeploy before creating assignments.
        </section>
      )}

      {assignmentError && (
        <section className={styles.notice}>
          Assignment setup warning: {assignmentError}. Run supabase/guided-study-assignments.sql in Supabase SQL Editor if needed.
        </section>
      )}

      <GuidedStudyAssignmentForm />

      <section className={styles.history}>
        <div className={styles.historyHeader}>
          <div>
            <p className={styles.eyebrow}>Recently set</p>
            <h2>Assignment history</h2>
          </div>
          <span className={styles.badge}>Newest first</span>
        </div>

        {assignments.length === 0 ? (
          <div className={styles.empty}>
            <h3>No assignments yet</h3>
            <p>Create the first assignment above. It will appear on the student dashboard.</p>
          </div>
        ) : (
          <div className={styles.assignmentList}>
            {assignments.map((assignment) => (
              <article className={styles.assignmentRow} key={assignment.id}>
                <div>
                  <strong>{assignment.assigned_class}</strong>
                  <small>{assignment.status}</small>
                </div>
                <div>
                  <strong>{formatMode(assignment.mode)}</strong>
                  <small>{assignment.required_activity_types.length} activities</small>
                </div>
                <div>
                  <strong>{formatDate(assignment.deadline_at)}</strong>
                  <small>Deadline</small>
                </div>
                <span className={styles.status}>Set</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
