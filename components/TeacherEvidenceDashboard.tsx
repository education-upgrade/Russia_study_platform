import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/progress/page.module.css';

type AssignmentRow = {
  id: string;
  title: string;
  lesson_title: string;
  mode: string;
  required_activity_types: string[];
  due_at: string | null;
  status: string;
  created_at: string;
  teaching_classes: { name: string } | { name: string }[] | null;
  assignment_recipients: { count: number }[] | null;
};

type RecipientRow = { student_id: string; status: string };
type ProfileRow = { id: string; full_name: string | null };

type ProgressRow = {
  student_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
  completed_activity_count: number;
  total_activity_count: number;
  progress_percent: number;
  current_activity_type: string | null;
  last_activity_at: string | null;
};

type ActivityProgressRow = {
  student_id: string;
  confidence: number | null;
  last_saved_at: string;
};

type Props = { selectedAssignmentId?: string };

function firstRelation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatMode(mode: string) { return mode.replaceAll('_', ' '); }
function formatDate(value: string | null) {
  if (!value) return 'Not yet';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function statusLabel(status: ProgressRow['status'] | undefined) {
  if (status === 'complete') return 'Complete';
  if (status === 'in_progress') return 'In progress';
  return 'Not started';
}
function statusStyle(status: ProgressRow['status'] | undefined) {
  if (status === 'complete') return styles.secure;
  if (status === 'in_progress') return styles.submitted;
  return styles.neutral;
}

export default async function TeacherEvidenceDashboard({ selectedAssignmentId }: Props) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><h1>Progress is unavailable</h1></header></section></main>;

  const { data: assignmentData, error: assignmentError } = await supabase
    .from('classroom_assignments')
    .select('id, title, lesson_title, mode, required_activity_types, due_at, status, created_at, teaching_classes(name), assignment_recipients(count)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const assignments = (assignmentData ?? []) as AssignmentRow[];
  const selectedAssignment = assignments.find((assignment) => assignment.id === selectedAssignmentId) ?? assignments[0] ?? null;
  if (assignmentError || !selectedAssignment) {
    return <main className={styles.shell}><div className={styles.topbar}><span>Teacher / Progress dashboard</span><Link className={styles.navButton} href="/teacher/set-study">Set study</Link><Link className={styles.navButton} href="/teacher/classes">My classes</Link></div><section className={styles.mainCard}><header className={styles.header}><div><p className={styles.eyebrow}>Class overview</p><h1>No published assignments</h1><p>{assignmentError?.message ?? 'Publish an assignment to begin tracking student progress.'}</p></div></header></section></main>;
  }

  const { data: recipientData, error: recipientError } = await supabase.from('assignment_recipients').select('student_id, status').eq('assignment_id', selectedAssignment.id);
  const recipients = (recipientData ?? []) as RecipientRow[];
  const studentIds = recipients.map((recipient) => recipient.student_id);
  const [{ data: profileData, error: profileError }, { data: progressData, error: progressError }, { data: activityProgressData, error: activityProgressError }] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    supabase.from('assignment_progress').select('student_id, status, completed_activity_count, total_activity_count, progress_percent, current_activity_type, last_activity_at').eq('assignment_id', selectedAssignment.id),
    supabase.from('student_activity_progress').select('student_id, confidence, last_saved_at').eq('assignment_id', selectedAssignment.id).not('confidence', 'is', null),
  ]);

  const profiles = new Map(((profileData ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
  const progressByStudent = new Map(((progressData ?? []) as ProgressRow[]).map((progress) => [progress.student_id, progress]));
  const confidenceByStudent = new Map<string, number>();
  ((activityProgressData ?? []) as ActivityProgressRow[]).forEach((row) => { if (!confidenceByStudent.has(row.student_id) && row.confidence !== null) confidenceByStudent.set(row.student_id, row.confidence); });

  const studentRows = recipients.map((recipient, index) => ({
    id: recipient.student_id,
    name: profiles.get(recipient.student_id)?.full_name?.trim() || `Student ${index + 1}`,
    progress: progressByStudent.get(recipient.student_id),
    confidence: confidenceByStudent.get(recipient.student_id),
  })).sort((a, b) => (a.progress?.progress_percent ?? 0) - (b.progress?.progress_percent ?? 0));

  const notStarted = studentRows.filter((row) => !row.progress || row.progress.status === 'not_started').length;
  const inProgress = studentRows.filter((row) => row.progress?.status === 'in_progress').length;
  const complete = studentRows.filter((row) => row.progress?.status === 'complete').length;
  const averageProgress = studentRows.length ? Math.round(studentRows.reduce((total, row) => total + (row.progress?.progress_percent ?? 0), 0) / studentRows.length) : 0;
  const lowConfidence = studentRows.filter((row) => row.confidence !== undefined && row.confidence <= 2).length;
  const teachingClass = firstRelation(selectedAssignment.teaching_classes);
  const loadError = recipientError || profileError || progressError || activityProgressError;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><span>Teacher / Progress dashboard</span><Link className={styles.navButton} href="/teacher/set-study">Set study</Link><Link className={styles.navButton} href="/teacher/classes">My classes</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.header}><div><p className={styles.eyebrow}>Class overview</p><h1>{teachingClass?.name ?? 'Class progress'}</h1><p>{selectedAssignment.lesson_title} · {formatMode(selectedAssignment.mode)} · Due {formatDate(selectedAssignment.due_at)}</p></div><aside className={styles.decisionCard}><strong>{averageProgress}% average</strong><span>{complete}/{studentRows.length} students complete</span></aside></header>
        {assignments.length > 1 && <section className={styles.priority}><div className={styles.sectionHeader}><h2>Assignments</h2><span className={styles.badge}>{assignments.length} published</span></div><div className={styles.priorityList}>{assignments.map((assignment) => { const assignmentClass = firstRelation(assignment.teaching_classes); return <article className={styles.priorityItem} key={assignment.id}><div><strong>{assignment.title}</strong><small>{assignmentClass?.name ?? 'Class'} · {assignment.lesson_title}</small></div><p>{assignment.assignment_recipients?.[0]?.count ?? 0} students · Due {formatDate(assignment.due_at)}</p><Link className={styles.navButton} href={`/teacher/progress?assignment=${assignment.id}`}>{assignment.id === selectedAssignment.id ? 'Viewing' : 'View'}</Link></article>; })}</div></section>}
        <section className={styles.snapshot}><article className={styles.metric}><span>Not started</span><strong>{notStarted}</strong></article><article className={styles.metric}><span>In progress</span><strong>{inProgress}</strong></article><article className={styles.metric}><span>Complete</span><strong>{complete}</strong></article><article className={styles.metric}><span>Low confidence</span><strong>{lowConfidence}</strong></article></section>
        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Student progress</h2><span className={styles.badge}>{studentRows.length} student{studentRows.length === 1 ? '' : 's'}</span></div>
          {loadError && <p className={styles.errorText}>Some progress data could not be loaded: {loadError.message}</p>}
          <div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Student</th><th>Status</th><th>Progress</th><th>Current task</th><th>Last active</th><th>Confidence</th></tr></thead><tbody>{studentRows.length === 0 ? <tr><td colSpan={6}>No students were assigned this work.</td></tr> : studentRows.map((row) => <tr key={row.id}><td><Link href={`/teacher/progress/${selectedAssignment.id}/${row.id}`} style={{ color: 'inherit', fontWeight: 950 }}>View {row.name}</Link></td><td><span className={`${styles.statusPill} ${statusStyle(row.progress?.status)}`}>{statusLabel(row.progress?.status)}</span></td><td>{row.progress?.progress_percent ?? 0}% ({row.progress?.completed_activity_count ?? 0}/{row.progress?.total_activity_count ?? selectedAssignment.required_activity_types.length})</td><td>{row.progress?.current_activity_type ? getActivityLabel(row.progress.current_activity_type) : '—'}</td><td>{formatDate(row.progress?.last_activity_at ?? null)}</td><td>{row.confidence !== undefined ? `${row.confidence}/5` : '—'}</td></tr>)}</tbody></table></div>
        </section>
        <section className={styles.studentEvidence}><details className={styles.details}><summary>Assignment route</summary><div className={styles.studentList} style={{ marginTop: 12 }}>{selectedAssignment.required_activity_types.map((activityType, index) => <article className={styles.studentCard} key={activityType}><div className={styles.studentTop}><div><h3>{index + 1}. {getActivityLabel(activityType)}</h3><p>Required activity</p></div></div></article>)}</div></details></section>
      </section>
    </main>
  );
}
