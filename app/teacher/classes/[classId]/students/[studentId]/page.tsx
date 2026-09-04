import Link from 'next/link';
import { notFound } from 'next/navigation';
import TeacherStudentNoteForm from '@/components/TeacherStudentNoteForm';
import { requireRoles } from '@/lib/auth/access';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Assignment = {
  id: string;
  title: string;
  lesson_title: string;
  due_at: string | null;
  created_at: string;
  status: string;
  assignment_recipients: { student_id: string; status: string }[] | null;
};
type Progress = { assignment_id: string; status: 'not_started' | 'in_progress' | 'complete'; progress_percent: number; completed_activity_count: number; total_activity_count: number; last_activity_at: string | null; completed_at: string | null };
type Note = { id: string; assignment_id: string | null; body: string; created_at: string; created_by: string };
type Confidence = { assignment_id: string; confidence: number | null; last_saved_at: string };

function relation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatDate(value: string | null) { return value ? formatSchoolDateTime(value, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not yet'; }
function state(assigned: boolean, progress?: Progress) {
  if (!assigned) return 'Not assigned';
  if (progress?.status === 'complete') return 'Complete';
  if (!progress || progress.status === 'not_started' || progress.progress_percent === 0) return 'Not attempted';
  return 'Incomplete';
}
function stateClass(value: string) {
  if (value === 'Complete') return styles.complete;
  if (value === 'Incomplete') return styles.incomplete;
  if (value === 'Not attempted') return styles.notAttempted;
  return styles.notAssigned;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentHistoryPage({ params }: { params: Promise<{ classId: string; studentId: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { classId, studentId } = await params;
  if (!auth || !supabase) notFound();

  const [{ data: teacherLink }, { data: membership }, { data: profile }, { data: assignmentRows }] = await Promise.all([
    supabase.from('class_teachers').select('class_id, teaching_classes(id, name, academic_year)').eq('class_id', classId).eq('teacher_id', auth.userId).maybeSingle(),
    supabase.from('class_memberships').select('student_id, status').eq('class_id', classId).eq('student_id', studentId).maybeSingle(),
    supabase.from('profiles').select('id, full_name').eq('id', studentId).maybeSingle(),
    supabase.from('classroom_assignments').select('id, title, lesson_title, due_at, created_at, status, assignment_recipients(student_id, status)').eq('class_id', classId).order('created_at', { ascending: false }),
  ]);

  const teachingClass = relation((teacherLink as any)?.teaching_classes);
  if ((!teachingClass && auth.profile.role !== 'admin') || !membership || !profile) notFound();

  const assignments = ((assignmentRows ?? []) as Assignment[]).filter((assignment) =>
    (assignment.status === 'published' || assignment.status === 'archived')
    && (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned'),
  );
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const [progressResult, confidenceResult, notesResult] = await Promise.all([
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, status, progress_percent, completed_activity_count, total_activity_count, last_activity_at, completed_at').eq('student_id', studentId).in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, confidence, last_saved_at').eq('student_id', studentId).in('assignment_id', assignmentIds).not('confidence', 'is', null).order('last_saved_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
    supabase.from('teacher_student_notes').select('id, assignment_id, body, created_at, created_by').eq('class_id', classId).eq('student_id', studentId).order('created_at', { ascending: false }),
  ]);

  const progressByAssignment = new Map(((progressResult.data ?? []) as Progress[]).map((row) => [row.assignment_id, row]));
  const confidenceByAssignment = new Map<string, number>();
  ((confidenceResult.data ?? []) as Confidence[]).forEach((row) => { if (!confidenceByAssignment.has(row.assignment_id) && row.confidence !== null) confidenceByAssignment.set(row.assignment_id, row.confidence); });
  const notes = (notesResult.data ?? []) as Note[];
  const notesByAssignment = new Map<string, Note[]>();
  notes.filter((note) => note.assignment_id).forEach((note) => { const list = notesByAssignment.get(note.assignment_id!) ?? []; list.push(note); notesByAssignment.set(note.assignment_id!, list); });
  const generalNotes = notes.filter((note) => !note.assignment_id);

  const history = assignments.map((assignment) => {
    const progress = progressByAssignment.get(assignment.id);
    const status = state(true, progress);
    return { assignment, progress, status, confidence: confidenceByAssignment.get(assignment.id), notes: notesByAssignment.get(assignment.id) ?? [] };
  });
  const complete = history.filter((item) => item.status === 'Complete').length;
  const incomplete = history.filter((item) => item.status === 'Incomplete').length;
  const notAttempted = history.filter((item) => item.status === 'Not attempted').length;
  const completionRate = history.length ? Math.round((complete / history.length) * 100) : 0;
  const name = profile.full_name?.trim() || 'Student';

  return <main className={styles.page}>
    <section className={styles.header}>
      <div><Link href={`/teacher/classes/${classId}/tracking`} className={styles.back}>← Class tracking</Link><p className={styles.eyebrow}>Student history</p><h1>{name}</h1><p>{teachingClass?.name ?? 'Class'} · {teachingClass?.academic_year || 'Academic year'} · private teacher record</p></div>
      <Link className={styles.insightAction} href={`/teacher/classes/${classId}/students/${studentId}/insight`} target="_blank">Download student insight</Link>
    </section>

    <section className={styles.metrics}>
      <article><span>Assignments</span><strong>{history.length}</strong></article>
      <article><span>Complete</span><strong>{complete}</strong></article>
      <article><span>Incomplete</span><strong>{incomplete}</strong></article>
      <article><span>Not attempted</span><strong>{notAttempted}</strong></article>
      <article><span>Completion rate</span><strong>{completionRate}%</strong></article>
    </section>

    <section className={styles.twoColumn}>
      <section className={styles.panel}>
        <header><div><h2>Teacher notes</h2><p>Private notes are never shown to the student.</p></div><span className={styles.badge}>{notes.length}</span></header>
        <TeacherStudentNoteForm classId={classId} studentId={studentId} assignments={assignments.map((assignment) => ({ id: assignment.id, title: assignment.lesson_title }))} />
        {generalNotes.length > 0 && <div className={styles.noteList}><h3>General notes</h3>{generalNotes.map((note) => <article key={note.id}><p>{note.body}</p><small>{formatDate(note.created_at)}</small></article>)}</div>}
      </section>

      <section className={styles.panel}>
        <header><div><h2>Overall picture</h2><p>Automatically derived from assigned work.</p></div></header>
        <div className={styles.summaryText}><strong>{complete}/{history.length} assignments complete</strong><p>{incomplete} incomplete · {notAttempted} not attempted</p><div className={styles.progressTrack}><span style={{ width: `${completionRate}%` }} /></div></div>
      </section>
    </section>

    <section className={styles.panel}>
      <header><div><h2>Assignment history</h2><p>Most recent work first. Open evidence to inspect the activity record.</p></div></header>
      {history.length === 0 ? <div className={styles.empty}>No assignment history for this student yet.</div> : <div className={styles.historyList}>{history.map(({ assignment, progress, status, confidence, notes: assignmentNotes }) => <article className={styles.historyItem} key={assignment.id}>
        <div className={styles.historyTop}><div><p className={styles.eyebrow}>{formatDate(assignment.created_at)}</p><h3>{assignment.lesson_title}</h3><p>{assignment.title}</p></div><span className={`${styles.state} ${stateClass(status)}`}>{status}</span></div>
        <div className={styles.historyFacts}><span><strong>{progress?.progress_percent ?? 0}%</strong> progress</span><span><strong>{progress?.completed_activity_count ?? 0}/{progress?.total_activity_count ?? 0}</strong> activities</span><span><strong>{confidence !== undefined ? `${confidence}/5` : '—'}</strong> confidence</span><span><strong>{formatDate(progress?.last_activity_at ?? null)}</strong> last active</span></div>
        {assignmentNotes.length > 0 && <div className={styles.assignmentNotes}>{assignmentNotes.map((note) => <div key={note.id}><strong>Teacher note</strong><p>{note.body}</p><small>{formatDate(note.created_at)}</small></div>)}</div>}
        <div className={styles.itemActions}><Link href={`/teacher/progress/${assignment.id}/${studentId}`}>Open evidence</Link></div>
      </article>)}</div>}
    </section>
  </main>;
}
