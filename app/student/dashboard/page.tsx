import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AssignmentRow = {
  id: string;
  title: string;
  lesson_title: string;
  pathway_slug: string;
  mode: string;
  required_activity_types: string[];
  instructions: string | null;
  due_at: string | null;
  published_at: string | null;
  teaching_classes: { name: string } | { name: string }[] | null;
};

type RecipientRow = {
  assignment_id: string;
  classroom_assignments: AssignmentRow | AssignmentRow[] | null;
};

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDeadline(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dueState(value: string | null) {
  if (!value) return 'open';
  const difference = new Date(value).getTime() - Date.now();
  if (difference < 0) return 'overdue';
  if (difference < 48 * 60 * 60 * 1000) return 'due soon';
  return 'open';
}

export default async function StudentDashboardPage() {
  const auth = await getAuthenticatedProfile();
  if (!auth) redirect('/account');

  const supabase = await createServerSupabaseClient();
  let assignments: AssignmentRow[] = [];
  let loadError = '';

  if (supabase && auth.profile.role === 'student') {
    const { data, error } = await supabase
      .from('assignment_recipients')
      .select('assignment_id, classroom_assignments(id, title, lesson_title, pathway_slug, mode, required_activity_types, instructions, due_at, published_at, teaching_classes(name))')
      .eq('student_id', auth.userId)
      .eq('status', 'assigned')
      .order('assigned_at', { ascending: false });

    if (error) {
      loadError = error.message;
    } else {
      assignments = ((data ?? []) as RecipientRow[])
        .flatMap((recipient) => {
          const assignment = Array.isArray(recipient.classroom_assignments)
            ? recipient.classroom_assignments[0]
            : recipient.classroom_assignments;
          return assignment ? [assignment] : [];
        })
        .sort((first, second) => {
          if (!first.due_at && !second.due_at) return 0;
          if (!first.due_at) return 1;
          if (!second.due_at) return -1;
          return new Date(first.due_at).getTime() - new Date(second.due_at).getTime();
        });
    }
  }

  const firstName = auth.profile.full_name.split(' ')[0] || 'Student';

  return (
    <main className="page-shell student-shell">
      <section className="hero">
        <p className="eyebrow">Student dashboard</p>
        <h1>{auth.profile.role === 'student' ? `Welcome, ${firstName}` : 'Student dashboard preview'}</h1>
        <p>
          {auth.profile.role === 'student'
            ? 'Your published guided-study assignments appear here in deadline order.'
            : 'Teachers can preview this page, but student-specific assignments remain private to each student account.'}
        </p>
        <div className="button-row">
          {auth.profile.role === 'student' && <Link className="button secondary" href="/student/join">Join a class</Link>}
          {auth.profile.role !== 'student' && <Link className="button secondary" href="/teacher/set-study">Return to assignment builder</Link>}
        </div>
      </section>

      {loadError && (
        <div className="callout" role="alert">
          <div><strong>Assignments could not be loaded</strong><p>{loadError}</p></div>
        </div>
      )}

      {auth.profile.role === 'student' && (
        <section style={{ marginTop: 24 }}>
          <div className="button-row compact" aria-label="Assignment summary">
            <span className="status-pill submitted">{assignments.length} assignment{assignments.length === 1 ? '' : 's'}</span>
            <span className="status-pill secure">Published work only</span>
          </div>

          <div className="grid two" style={{ marginTop: 20 }}>
            {assignments.length === 0 ? (
              <article className="card">
                <p className="eyebrow">Nothing assigned yet</p>
                <h2>You are up to date</h2>
                <p>Published work will appear here after your teacher assigns it to a class you have joined.</p>
                <Link className="button secondary" href="/student/join">Check your classes</Link>
              </article>
            ) : assignments.map((assignment) => {
              const teachingClass = Array.isArray(assignment.teaching_classes)
                ? assignment.teaching_classes[0]
                : assignment.teaching_classes;
              const pathway = getPathwayConfig(assignment.pathway_slug);
              const state = dueState(assignment.due_at);
              return (
                <article className="card" key={assignment.id}>
                  <p className="eyebrow">{teachingClass?.name ?? 'Your class'} · {state}</p>
                  <h2>{assignment.title}</h2>
                  <p><strong>{assignment.lesson_title}</strong></p>
                  <p>{assignment.instructions || 'Complete the activities selected by your teacher.'}</p>
                  <div className="button-row compact">
                    <span className={state === 'overdue' ? 'status-pill intervention' : 'status-pill submitted'}>{formatDeadline(assignment.due_at)}</span>
                    <span className="status-pill secure">{formatMode(assignment.mode)}</span>
                  </div>
                  <p style={{ marginTop: 16 }}><strong>Route:</strong> {assignment.required_activity_types.map(getActivityLabel).join(' → ')}</p>
                  <Link className="button" href={`${pathway.routeBase}?assignment=${assignment.id}`}>Start assignment</Link>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
