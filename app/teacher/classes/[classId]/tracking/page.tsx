import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Assignment = {
  id: string;
  title: string;
  lesson_title: string;
  pathway_slug: string;
  due_at: string | null;
  created_at: string;
  status: string;
  assignment_recipients: { student_id: string; status: string }[] | null;
};

type Progress = {
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
  progress_percent: number;
  completed_activity_count: number;
  total_activity_count: number;
  last_activity_at: string | null;
  completed_at: string | null;
};

type Confidence = { assignment_id: string; student_id: string; confidence: number | null; last_saved_at: string };
type TrackingState = 'complete' | 'incomplete' | 'not_attempted' | 'not_assigned';

function relation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatDate(value: string | null) { return value ? formatSchoolDateTime(value, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }
function trackingState(assigned: boolean, progress?: Progress): TrackingState {
  if (!assigned) return 'not_assigned';
  if (progress?.status === 'complete') return 'complete';
  if (!progress || progress.status === 'not_started' || progress.progress_percent === 0) return 'not_attempted';
  return 'incomplete';
}
function stateLabel(state: TrackingState) {
  if (state === 'complete') return 'Complete';
  if (state === 'incomplete') return 'Incomplete';
  if (state === 'not_attempted') return 'Not attempted';
  return 'Not assigned';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClassTrackingPage({ params, searchParams }: { params: Promise<{ classId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { classId } = await params;
  const query = await searchParams;
  if (!auth || !supabase) notFound();

  const { data: teacherLink } = await supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name, academic_year)')
    .eq('teacher_id', auth.userId)
    .eq('class_id', classId)
    .maybeSingle();
  const teachingClass = relation((teacherLink as any)?.teaching_classes);
  if (!teachingClass && auth.profile.role !== 'admin') notFound();

  const [{ data: memberships }, { data: assignmentRows }] = await Promise.all([
    supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('status', 'active'),
    supabase.from('classroom_assignments').select('id, title, lesson_title, pathway_slug, due_at, created_at, status, assignment_recipients(student_id, status)').eq('class_id', classId).order('created_at', { ascending: true }),
  ]);

  const studentIds = (memberships ?? []).map((row: any) => row.student_id);
  const assignments = ((assignmentRows ?? []) as Assignment[]).filter((assignment) => assignment.status === 'published' || assignment.status === 'archived');
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const [profilesResult, progressResult, confidenceResult] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, student_id, status, progress_percent, completed_activity_count, total_activity_count, last_activity_at, completed_at').in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, student_id, confidence, last_saved_at').in('assignment_id', assignmentIds).not('confidence', 'is', null).order('last_saved_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
  ]);

  const profiles = new Map((profilesResult.data ?? []).map((profile: any) => [profile.id, profile.full_name?.trim() || 'Student']));
  const progressRows = (progressResult.data ?? []) as Progress[];
  const progressByKey = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));
  const confidenceByKey = new Map<string, number>();
  ((confidenceResult.data ?? []) as Confidence[]).forEach((row) => {
    const key = `${row.assignment_id}:${row.student_id}`;
    if (!confidenceByKey.has(key) && row.confidence !== null) confidenceByKey.set(key, row.confidence);
  });

  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const statusFilter = typeof query.status === 'string' ? query.status : 'all';
  const selectedAssignmentId = typeof query.assignment === 'string' && assignments.some((assignment) => assignment.id === query.assignment)
    ? query.assignment
    : assignments.at(-1)?.id ?? '';

  const studentRows = studentIds.map((studentId) => {
    const cells = assignments.map((assignment) => {
      const assigned = (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned');
      const progress = progressByKey.get(`${assignment.id}:${studentId}`);
      return { assignment, assigned, progress, state: trackingState(assigned, progress), confidence: confidenceByKey.get(`${assignment.id}:${studentId}`) };
    });
    const assignedCells = cells.filter((cell) => cell.assigned);
    const complete = assignedCells.filter((cell) => cell.state === 'complete').length;
    const incomplete = assignedCells.filter((cell) => cell.state === 'incomplete').length;
    const notAttempted = assignedCells.filter((cell) => cell.state === 'not_attempted').length;
    return { studentId, name: profiles.get(studentId) ?? 'Student', cells, assigned: assignedCells.length, complete, incomplete, notAttempted };
  }).filter((row) => {
    if (search && !row.name.toLowerCase().includes(search)) return false;
    if (statusFilter === 'complete') return row.assigned > 0 && row.complete === row.assigned;
    if (statusFilter === 'incomplete') return row.incomplete > 0;
    if (statusFilter === 'not_attempted') return row.notAttempted > 0;
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const selectedAssignment = assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? null;
  const selectedRows = selectedAssignment ? studentRows.map((row) => {
    const cell = row.cells.find((candidate) => candidate.assignment.id === selectedAssignment.id);
    return cell ? { row, cell } : null;
  }).filter(Boolean) as { row: typeof studentRows[number]; cell: typeof studentRows[number]['cells'][number] }[] : [];
  const selectedComplete = selectedRows.filter(({ cell }) => cell.state === 'complete').length;
  const selectedIncomplete = selectedRows.filter(({ cell }) => cell.state === 'incomplete').length;
  const selectedNotAttempted = selectedRows.filter(({ cell }) => cell.state === 'not_attempted').length;

  const totalAssigned = studentRows.reduce((sum, row) => sum + row.assigned, 0);
  const totalComplete = studentRows.reduce((sum, row) => sum + row.complete, 0);
  const totalIncomplete = studentRows.reduce((sum, row) => sum + row.incomplete, 0);
  const totalNotAttempted = studentRows.reduce((sum, row) => sum + row.notAttempted, 0);

  return <main className={styles.page}>
    <section className={styles.header}>
      <div><Link href={`/teacher/classes/${classId}`} className={styles.back}>← Back to class</Link><p className={styles.eyebrow}>Automated tracking</p><h1>{teachingClass?.name ?? 'Class'} assignment history</h1><p>{teachingClass?.academic_year || 'Academic year'} · complete, incomplete and not-attempted history generated from saved assignment data.</p></div>
      <div className={styles.actions}><a className={styles.secondary} href={`/api/teacher/classes/${classId}/tracking.csv?format=detail`}>Detailed CSV</a><a className={styles.primary} href={`/api/teacher/classes/${classId}/tracking.csv?format=matrix`}>Matrix CSV</a></div>
    </section>

    <section className={styles.metrics}>
      <article><span>Assigned</span><strong>{totalAssigned}</strong></article>
      <article><span>Complete</span><strong>{totalComplete}</strong></article>
      <article><span>Incomplete</span><strong>{totalIncomplete}</strong></article>
      <article><span>Not attempted</span><strong>{totalNotAttempted}</strong></article>
    </section>

    <section className={styles.panel}>
      <section className={styles.mobileTracker}>
        {assignments.length === 0 ? <div className={styles.empty}>No published or archived assignment history yet.</div> : <>
          <form className={styles.mobileControls}>
            <label className={styles.assignmentSelect}><span>Assignment</span><select name="assignment" defaultValue={selectedAssignmentId}>{assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.lesson_title}</option>)}</select></label>
            <input name="search" defaultValue={typeof query.search === 'string' ? query.search : ''} placeholder="Search student" aria-label="Search student" />
            <select name="status" defaultValue={statusFilter} aria-label="Filter students"><option value="all">All students</option><option value="complete">Fully complete</option><option value="incomplete">Has incomplete work</option><option value="not_attempted">Has not attempted work</option></select>
            <button type="submit">Update view</button>
          </form>
          {selectedAssignment && <>
            <div className={styles.mobileAssignmentHeader}><div><p className={styles.eyebrow}>Selected assignment</p><h2>{selectedAssignment.lesson_title}</h2><p>Due {formatDate(selectedAssignment.due_at)}</p></div></div>
            <div className={styles.mobileMetrics}><article><span>Complete</span><strong>{selectedComplete}</strong></article><article><span>Incomplete</span><strong>{selectedIncomplete}</strong></article><article><span>Not attempted</span><strong>{selectedNotAttempted}</strong></article></div>
            <div className={styles.mobileStudentList}>{selectedRows.map(({ row, cell }) => <Link href={`/teacher/progress/${selectedAssignment.id}/${row.studentId}`} className={styles.mobileStudent} key={row.studentId}><div><strong>{row.name}</strong><span>{cell.progress ? `${cell.progress.progress_percent}% complete` : 'No recorded progress'}</span></div><span className={`${styles.mobileStatus} ${styles[cell.state]}`}>{stateLabel(cell.state)}</span></Link>)}</div>
          </>}
          <details className={styles.matrixDetails}><summary>View full matrix</summary><p>Best used on a larger screen. You can still scroll it horizontally here.</p><div className={styles.matrixWrapMobile}><table className={styles.matrix}><thead><tr><th>Student</th>{assignments.map((assignment) => <th key={assignment.id}><span>{assignment.lesson_title}</span><small>{formatDate(assignment.due_at)}</small></th>)}<th>Overall</th></tr></thead><tbody>{studentRows.map((row) => <tr key={row.studentId}><th><strong>{row.name}</strong><small>{row.complete}/{row.assigned} complete</small></th>{row.cells.map((cell) => <td key={cell.assignment.id}><Link href={`/teacher/progress/${cell.assignment.id}/${row.studentId}`} className={`${styles.cell} ${styles[cell.state]}`} title={`${cell.assignment.title}: ${stateLabel(cell.state)}`}><strong>{cell.state === 'complete' ? '✓' : cell.state === 'incomplete' ? '◐' : cell.state === 'not_attempted' ? '○' : '—'}</strong><span>{stateLabel(cell.state)}</span>{cell.progress && <small>{cell.progress.progress_percent}%</small>}</Link></td>)}<td><div className={styles.overall}><strong>{row.complete}/{row.assigned}</strong><span>{row.incomplete} incomplete</span><span>{row.notAttempted} not attempted</span></div></td></tr>)}</tbody></table></div></details>
        </>}
      </section>

      <section className={styles.desktopTracker}>
        <form className={styles.filters}><input name="search" defaultValue={typeof query.search === 'string' ? query.search : ''} placeholder="Search student" /><select name="status" defaultValue={statusFilter}><option value="all">All students</option><option value="complete">Fully complete</option><option value="incomplete">Has incomplete work</option><option value="not_attempted">Has not attempted work</option></select><button type="submit">Apply</button></form>
        {assignments.length === 0 ? <div className={styles.empty}>No published or archived assignment history yet.</div> : <div className={styles.matrixWrap}><table className={styles.matrix}><thead><tr><th>Student</th>{assignments.map((assignment) => <th key={assignment.id}><span>{assignment.lesson_title}</span><small>{formatDate(assignment.due_at)}</small></th>)}<th>Overall</th></tr></thead><tbody>{studentRows.map((row) => <tr key={row.studentId}><th><strong>{row.name}</strong><small>{row.complete}/{row.assigned} complete</small></th>{row.cells.map((cell) => <td key={cell.assignment.id}><Link href={`/teacher/progress/${cell.assignment.id}/${row.studentId}`} className={`${styles.cell} ${styles[cell.state]}`} title={`${cell.assignment.title}: ${stateLabel(cell.state)}`}><strong>{cell.state === 'complete' ? '✓' : cell.state === 'incomplete' ? '◐' : cell.state === 'not_attempted' ? '○' : '—'}</strong><span>{stateLabel(cell.state)}</span>{cell.progress && <small>{cell.progress.progress_percent}%</small>}</Link></td>)}<td><div className={styles.overall}><strong>{row.complete}/{row.assigned}</strong><span>{row.incomplete} incomplete</span><span>{row.notAttempted} not attempted</span></div></td></tr>)}</tbody></table></div>}
      </section>
    </section>
  </main>;
}
