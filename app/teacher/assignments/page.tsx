import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherAssignmentsPage({ searchParams }: { searchParams?: Promise<{ view?: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const query = searchParams ? await searchParams : {};
  const view = ['active', 'drafts', 'archived'].includes(query.view ?? '') ? query.view! : 'active';
  if (!auth || !supabase) return null;

  const { data: classLinks } = await supabase.from('class_teachers').select('class_id').eq('teacher_id', auth.userId);
  const classIds = (classLinks ?? []).map((row: any) => row.class_id);
  const { data } = classIds.length ? await supabase.from('classroom_assignments').select('id, title, lesson_title, class_id, due_at, status, created_at, teaching_classes(name), assignment_recipients(student_id, status)').in('class_id', classIds).order('created_at', { ascending: false }) : { data: [] };
  const assignments = (data ?? []).filter((assignment: any) => view === 'active' ? assignment.status === 'published' : view === 'drafts' ? assignment.status === 'draft' : assignment.status === 'archived');

  return <main className="page-shell teacher-shell">
    <div className="button-row" aria-label="Assignment status">
      <Link className={`button ${view === 'active' ? '' : 'secondary'}`} href="/teacher/assignments?view=active">Active</Link>
      <Link className={`button ${view === 'drafts' ? '' : 'secondary'}`} href="/teacher/assignments?view=drafts">Drafts</Link>
      <Link className={`button ${view === 'archived' ? '' : 'secondary'}`} href="/teacher/assignments?view=archived">Archived</Link>
      <Link className="button" href="/teacher/set-study">+ Set work</Link>
    </div>

    <section style={{ marginTop: 14 }}>
      {assignments.length === 0 ? <article className="card"><h2>No {view} assignments</h2><p>{view === 'active' ? 'There is no active work at the moment. Set work when you are ready.' : `There are no ${view} assignments to show.`}</p>{view === 'active' && <div className="button-row"><Link className="button" href="/teacher/set-study">Set work</Link></div>}</article> : <div className="grid two">{assignments.map((assignment: any) => {
        const teachingClass = Array.isArray(assignment.teaching_classes) ? assignment.teaching_classes[0] : assignment.teaching_classes;
        const recipients = (assignment.assignment_recipients ?? []).filter((recipient: any) => recipient.status === 'assigned').length;
        return <article className="card" key={assignment.id}>
          <p className="eyebrow">{teachingClass?.name ?? 'Class'}</p>
          <h2>{assignment.lesson_title}</h2>
          <p>{assignment.title}</p>
          <p><strong>{recipients}</strong> students · {formatDate(assignment.due_at)}</p>
          <div className="button-row"><Link className="button" href={`/teacher/assignments/${assignment.id}`}>Open</Link><Link className="button secondary" href={`/teacher/set-study?duplicate=${assignment.id}`}>Duplicate</Link></div>
        </article>;
      })}</div>}
    </section>
  </main>;
}
