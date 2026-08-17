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
  const { data } = classIds.length ? await supabase
    .from('classroom_assignments')
    .select('id, title, lesson_title, class_id, due_at, status, created_at, teaching_classes(name), assignment_recipients(student_id, status)')
    .in('class_id', classIds)
    .order('created_at', { ascending: false }) : { data: [] };

  const assignments = (data ?? []).filter((assignment: any) => {
    if (view === 'active') return assignment.status === 'published';
    if (view === 'drafts') return assignment.status === 'draft';
    return assignment.status === 'archived';
  });

  return <main className="page-shell teacher-shell">
    <section className="card">
      <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div><p className="eyebrow">Assignment workspace</p><h2>Your assignments</h2><p>Find existing work here. Use Set work only when you want to create something new.</p></div>
        <Link className="button" href="/teacher/set-study">+ Set work</Link>
      </div>
    </section>

    <nav className="button-row" aria-label="Assignment status" style={{ marginTop: 20 }}>
      <Link className={`button ${view === 'active' ? '' : 'secondary'}`} href="/teacher/assignments?view=active">Active</Link>
      <Link className={`button ${view === 'drafts' ? '' : 'secondary'}`} href="/teacher/assignments?view=drafts">Drafts</Link>
      <Link className={`button ${view === 'archived' ? '' : 'secondary'}`} href="/teacher/assignments?view=archived">Archived</Link>
    </nav>

    <section style={{ marginTop: 20 }}>
      {assignments.length === 0 ? <article className="card"><h2>No {view} assignments</h2><p>{view === 'active' ? 'Set work when you are ready to create an assignment.' : `There are no ${view} assignments to show.`}</p></article> : <div className="grid two">{assignments.map((assignment: any) => {
        const teachingClass = Array.isArray(assignment.teaching_classes) ? assignment.teaching_classes[0] : assignment.teaching_classes;
        const recipients = (assignment.assignment_recipients ?? []).filter((recipient: any) => recipient.status === 'assigned').length;
        return <article className="card" key={assignment.id}>
          <p className="eyebrow">{teachingClass?.name ?? 'Class'}</p>
          <h2>{assignment.lesson_title}</h2>
          <p>{assignment.title}</p>
          <p><strong>{recipients}</strong> students · {formatDate(assignment.due_at)}</p>
          <div className="button-row"><Link className="button" href={`/teacher/assignments/${assignment.id}`}>Open assignment</Link><Link className="button secondary" href={`/teacher/set-study?duplicate=${assignment.id}`}>Duplicate</Link></div>
        </article>;
      })}</div>}
    </section>
  </main>;
}
