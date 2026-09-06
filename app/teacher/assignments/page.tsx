import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/teacherPages.module.css';

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return formatSchoolDateTime(value, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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
  const allAssignments = data ?? [];
  const counts = {
    active: allAssignments.filter((assignment: any) => assignment.status === 'published').length,
    drafts: allAssignments.filter((assignment: any) => assignment.status === 'draft').length,
    archived: allAssignments.filter((assignment: any) => assignment.status === 'archived').length,
  };
  const assignments = allAssignments.filter((assignment: any) => view === 'active' ? assignment.status === 'published' : view === 'drafts' ? assignment.status === 'draft' : assignment.status === 'archived');
  const label = view === 'active' ? 'Active' : view === 'drafts' ? 'Drafts' : 'Archived';

  return <main className={styles.page}>
    <div className={styles.toolbar}>
      <nav className={styles.segmented} aria-label="Assignment status">
        <Link className={`${styles.segment} ${view === 'active' ? styles.segmentActive : ''}`} href="/teacher/assignments?view=active">Active <span className={styles.segmentCount}>{counts.active}</span></Link>
        <Link className={`${styles.segment} ${view === 'drafts' ? styles.segmentActive : ''}`} href="/teacher/assignments?view=drafts">Drafts <span className={styles.segmentCount}>{counts.drafts}</span></Link>
        <Link className={`${styles.segment} ${view === 'archived' ? styles.segmentActive : ''}`} href="/teacher/assignments?view=archived">Archived <span className={styles.segmentCount}>{counts.archived}</span></Link>
      </nav>
      <Link className={styles.primaryAction} href="/teacher/set-study">+ Set work</Link>
    </div>

    {assignments.length === 0 ? <section className={styles.empty}><h2>No {view} assignments</h2><p>{view === 'active' ? 'There is no active work at the moment. Use Set work when you are ready.' : `There are no ${view} assignments to show.`}</p>{view === 'active' && <div className={styles.actions}><Link className={styles.primaryAction} href="/teacher/set-study">Set work</Link></div>}</section> : <section className={styles.assignmentGrid} aria-label={`${label} assignments`}>{assignments.map((assignment: any) => {
      const teachingClass = Array.isArray(assignment.teaching_classes) ? assignment.teaching_classes[0] : assignment.teaching_classes;
      const recipients = (assignment.assignment_recipients ?? []).filter((recipient: any) => recipient.status === 'assigned').length;
      const statusClass = assignment.status === 'published' ? styles.statusActive : assignment.status === 'draft' ? styles.statusDraft : styles.statusArchived;
      const statusLabel = assignment.status === 'published' ? 'Active' : assignment.status === 'draft' ? 'Draft' : 'Archived';
      return <article className={styles.card} key={assignment.id}>
        <div className={styles.cardTop}><div><p className={styles.eyebrow}>{teachingClass?.name ?? 'Class'}</p><h2>{assignment.lesson_title}</h2><p className={styles.cardDescription}>{assignment.title}</p></div><span className={statusClass}>{statusLabel}</span></div>
        <div className={styles.meta}><span><strong>{recipients}</strong> {recipients === 1 ? 'student' : 'students'}</span><span>{formatDate(assignment.due_at)}</span></div>
        <div className={styles.actions}><Link className={styles.primaryAction} href={`/teacher/assignments/${assignment.id}`}>Open assignment</Link><Link className={styles.secondaryAction} href={`/teacher/set-study?duplicate=${assignment.id}`}>Duplicate</Link></div>
      </article>;
    })}</section>}
  </main>;
}
