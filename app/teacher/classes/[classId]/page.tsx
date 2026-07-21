import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Tab = 'overview' | 'students' | 'assignments' | 'progress';
type ProgressStatus = 'not_started' | 'in_progress' | 'complete';

type Assignment = {
  id: string;
  title: string;
  lesson_title: string;
  due_at: string | null;
  status: string;
  created_at: string;
  assignment_recipients: { student_id: string; status: string }[] | null;
};

type Progress = {
  assignment_id: string;
  student_id: string;
  status: ProgressStatus;
  progress_percent: number;
  last_activity_at: string | null;
};

function relation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function dueState(value: string | null) {
  if (!value) return 'No deadline';
  const difference = new Date(value).getTime() - Date.now();
  if (difference < 0) return 'Overdue';
  if (difference <= 48 * 60 * 60 * 1000) return 'Due soon';
  return `Due ${formatDate(value)}`;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClassWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { classId } = await params;
  const query = await searchParams;
  const requestedTab = typeof query.tab === 'string' ? query.tab : 'overview';
  const activeTab: Tab = ['overview', 'students', 'assignments', 'progress'].includes(requestedTab)
    ? requestedTab as Tab
    : 'overview';
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const filter = typeof query.filter === 'string' ? query.filter : 'all';

  if (!auth || !supabase) notFound();

  const { data: teacherLink } = await supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name, academic_year, join_code, is_active, schools(name))')
    .eq('teacher_id', auth.userId)
    .eq('class_id', classId)
    .maybeSingle();

  const teachingClass = relation((teacherLink as any)?.teaching_classes);
  if (!teachingClass) notFound();

  const [{ data: memberships, error: membershipError }, { data: assignmentRows, error: assignmentError }] = await Promise.all([
    supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('status', 'active'),
    supabase
      .from('classroom_assignments')
      .select('id, title, lesson_title, due_at, status, created_at, assignment_recipients(student_id, status)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
  ]);

  const studentIds = (memberships ?? []).map((row: any) => row.student_id);
  const assignments = (assignmentRows ?? []) as Assignment[];
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const [profilesResult, progressResult, confidenceResult] = await Promise.all([
    studentIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    assignmentIds.length
      ? supabase.from('assignment_progress').select('assignment_id, student_id, status, progress_percent, last_activity_at').in('assignment_id', assignmentIds)
      : Promise.resolve({ data: [], error: null }),
    assignmentIds.length
      ? supabase.from('student_activity_progress').select('assignment_id, student_id, confidence, last_saved_at').in('assignment_id', assignmentIds).not('confidence', 'is', null).order('last_saved_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  const profiles = new Map((profilesResult.data ?? []).map((profile: any) => [profile.id, profile.full_name?.trim() || 'Student']));
  const progressRows = (progressResult.data ?? []) as Progress[];
  const progressByKey = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));
  const confidenceByKey = new Map<string, number>();
  (confidenceResult.data ?? []).forEach((row: any) => {
    const key = `${row.assignment_id}:${row.student_id}`;
    if (!confidenceByKey.has(key) && row.confidence !== null) confidenceByKey.set(key, row.confidence);
  });

  const publishedAssignments = assignments.filter((assignment) => assignment.status === 'published');
  const archivedAssignments = assignments.filter((assignment) => assignment.status !== 'published');

  const studentSummaries = studentIds.map((studentId) => {
    const assigned = publishedAssignments.filter((assignment) =>
      (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned'),
    );
    const rows = assigned.map((assignment) => progressByKey.get(`${assignment.id}:${studentId}`));
    const completed = rows.filter((row) => row?.status === 'complete').length;
    const average = assigned.length
      ? Math.round(rows.reduce((sum, row) => sum + (row?.progress_percent ?? 0), 0) / assigned.length)
      : 0;
    const latest = rows
      .map((row) => row?.last_activity_at)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null;

    let needsAttention = false;
    let lowConfidence = false;
    assigned.forEach((assignment) => {
      const key = `${assignment.id}:${studentId}`;
      const row = progressByKey.get(key);
      const confidence = confidenceByKey.get(key);
      const dueDifference = assignment.due_at ? new Date(assignment.due_at).getTime() - Date.now() : null;
      const notStarted = !row || row.status === 'not_started';
      if (notStarted && dueDifference !== null && dueDifference <= 48 * 60 * 60 * 1000) needsAttention = true;
      if (confidence !== undefined && confidence <= 2) {
        needsAttention = true;
        lowConfidence = true;
      }
      if (row?.status === 'in_progress' && row.last_activity_at && Date.now() - new Date(row.last_activity_at).getTime() >= 3 * 24 * 60 * 60 * 1000) needsAttention = true;
    });

    const status: ProgressStatus = assigned.length > 0 && completed === assigned.length
      ? 'complete'
      : rows.some((row) => row && row.status !== 'not_started')
        ? 'in_progress'
        : 'not_started';

    return {
      studentId,
      name: profiles.get(studentId) ?? 'Student',
      assignments: assigned.length,
      completed,
      average,
      latest,
      needsAttention,
      lowConfidence,
      status,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const visibleStudents = studentSummaries.filter((student) => {
    const matchesSearch = !search || student.name.toLowerCase().includes(search);
    const matchesFilter = filter === 'all'
      || (filter === 'attention' && student.needsAttention)
      || (filter === 'not_started' && student.status === 'not_started')
      || (filter === 'in_progress' && student.status === 'in_progress')
      || (filter === 'complete' && student.status === 'complete');
    return matchesSearch && matchesFilter;
  });

  const assignmentCards = publishedAssignments.map((assignment) => {
    const recipients = (assignment.assignment_recipients ?? []).filter((recipient) => recipient.status === 'assigned');
    const rows = recipients.map((recipient) => progressByKey.get(`${assignment.id}:${recipient.student_id}`));
    const completed = rows.filter((row) => row?.status === 'complete').length;
    const average = recipients.length
      ? Math.round(rows.reduce((sum, row) => sum + (row?.progress_percent ?? 0), 0) / recipients.length)
      : 0;
    return { assignment, recipients: recipients.length, completed, average };
  });

  const attentionStudents = studentSummaries.filter((student) => student.needsAttention);
  const classAverage = studentSummaries.length
    ? Math.round(studentSummaries.reduce((sum, student) => sum + student.average, 0) / studentSummaries.length)
    : 0;
  const completedToday = progressRows.filter((row) => row.status === 'complete' && row.last_activity_at && new Date(row.last_activity_at).toDateString() === new Date().toDateString()).length;
  const loadError = membershipError || assignmentError || profilesResult.error || progressResult.error || confidenceResult.error;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'students', label: `Students (${studentIds.length})` },
    { id: 'assignments', label: `Assignments (${publishedAssignments.length})` },
    { id: 'progress', label: 'Progress' },
  ];

  return (
    <main className={styles.workspace}>
      <section className={styles.classHeader}>
        <div>
          <Link className={styles.backLink} href="/teacher/classes">← All classes</Link>
          <p className={styles.eyebrow}>{relation(teachingClass.schools)?.name || 'Teaching class'}</p>
          <h2>{teachingClass.name}</h2>
          <p>{teachingClass.academic_year || 'Academic year not set'} · Join code <strong>{teachingClass.join_code}</strong></p>
        </div>
        <Link className={styles.primaryAction} href="/teacher/set-study">Set work</Link>
      </section>

      {loadError && <section className={styles.notice} role="alert"><strong>Some class information could not be loaded.</strong><span>{loadError.message}</span></section>}

      <nav className={styles.tabs} aria-label={`${teachingClass.name} workspace`}>
        {tabs.map((tab) => (
          <Link key={tab.id} href={`/teacher/classes/${classId}?tab=${tab.id}`} className={activeTab === tab.id ? styles.activeTab : styles.tab} aria-current={activeTab === tab.id ? 'page' : undefined}>{tab.label}</Link>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <>
          <section className={styles.metrics}>
            <article><span>Students</span><strong>{studentIds.length}</strong></article>
            <article><span>Active assignments</span><strong>{publishedAssignments.length}</strong></article>
            <article><span>Class average</span><strong>{classAverage}%</strong></article>
            <article className={attentionStudents.length ? styles.attentionMetric : ''}><span>Needs attention</span><strong>{attentionStudents.length}</strong></article>
          </section>
          <section className={styles.twoColumn}>
            <section className={styles.panel}>
              <header><div><h3>Needs attention</h3><p>Deadline, confidence and stalled-progress signals.</p></div><Link href={`/teacher/classes/${classId}?tab=progress&filter=attention`}>View all</Link></header>
              {attentionStudents.length === 0 ? <div className={styles.empty}><strong>No immediate concerns</strong><p>No students currently meet the attention rules.</p></div> : attentionStudents.slice(0, 5).map((student) => <article className={styles.row} key={student.studentId}><div><strong>{student.name}</strong><p>{student.average}% average · {student.completed}/{student.assignments} complete</p></div><span className={styles.warning}>Review</span></article>)}
            </section>
            <section className={styles.panel}>
              <header><div><h3>Recent assignments</h3><p>{completedToday} student assignment completions today.</p></div><Link href={`/teacher/classes/${classId}?tab=assignments`}>View all</Link></header>
              {assignmentCards.length === 0 ? <div className={styles.empty}><strong>No active assignments</strong><p>Set work to begin collecting progress.</p></div> : assignmentCards.slice(0, 4).map(({ assignment, completed, recipients, average }) => <article className={styles.row} key={assignment.id}><div><strong>{assignment.title}</strong><p>{completed}/{recipients} complete · {average}% average</p></div><Link href={`/teacher/progress?assignment=${assignment.id}`}>Open</Link></article>)}
            </section>
          </section>
        </>
      )}

      {activeTab === 'students' && (
        <section className={styles.panel}>
          <header><div><h3>Student roster</h3><p>Search the class and review assignment-level engagement.</p></div></header>
          <form className={styles.filters} method="get">
            <input type="hidden" name="tab" value="students" />
            <input name="search" defaultValue={typeof query.search === 'string' ? query.search : ''} placeholder="Search students" aria-label="Search students" />
            <select name="filter" defaultValue={filter} aria-label="Filter students"><option value="all">All students</option><option value="attention">Needs attention</option><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select>
            <button type="submit">Apply</button>
          </form>
          <div className={styles.tableHeader}><span>Student</span><span>Assignments</span><span>Average</span><span>Status</span></div>
          {visibleStudents.length === 0 ? <div className={styles.empty}><strong>No students match</strong><p>Change the search or filter.</p></div> : visibleStudents.map((student) => <article className={styles.studentRow} key={student.studentId}><div><strong>{student.name}</strong><small>{student.latest ? `Last active ${formatDate(student.latest)}` : 'No saved activity'}</small></div><span>{student.completed}/{student.assignments}</span><span>{student.average}%</span><span className={student.needsAttention ? styles.warning : styles.status}>{student.needsAttention ? 'Needs attention' : student.status.replace('_', ' ')}</span></article>)}
        </section>
      )}

      {activeTab === 'assignments' && (
        <section className={styles.panel}>
          <header><div><h3>Assignments</h3><p>Published work for this class, followed by archived items.</p></div><Link href="/teacher/set-study">New assignment</Link></header>
          {assignmentCards.length === 0 ? <div className={styles.empty}><strong>No published assignments</strong><p>Create the first assignment for this class.</p></div> : assignmentCards.map(({ assignment, recipients, completed, average }) => <article className={styles.assignmentRow} key={assignment.id}><div><strong>{assignment.title}</strong><p>{assignment.lesson_title} · {dueState(assignment.due_at)}</p><div className={styles.progressTrack}><span style={{ width: `${average}%` }} /></div></div><div className={styles.assignmentStats}><span>{completed}/{recipients} complete</span><span>{average}% average</span><Link href={`/teacher/progress?assignment=${assignment.id}`}>Progress</Link></div></article>)}
          {archivedAssignments.length > 0 && <details className={styles.archived}><summary>Archived assignments ({archivedAssignments.length})</summary>{archivedAssignments.map((assignment) => <div key={assignment.id}><strong>{assignment.title}</strong><span>{assignment.lesson_title}</span></div>)}</details>}
        </section>
      )}

      {activeTab === 'progress' && (
        <section className={styles.panel}>
          <header><div><h3>Class progress</h3><p>Students are ordered with intervention priorities first.</p></div><Link href="/teacher/progress">Full progress dashboard</Link></header>
          <div className={styles.progressFilters}><Link href={`/teacher/classes/${classId}?tab=progress&filter=all`}>All</Link><Link href={`/teacher/classes/${classId}?tab=progress&filter=attention`}>Needs attention</Link><Link href={`/teacher/classes/${classId}?tab=progress&filter=not_started`}>Not started</Link><Link href={`/teacher/classes/${classId}?tab=progress&filter=in_progress`}>In progress</Link><Link href={`/teacher/classes/${classId}?tab=progress&filter=complete`}>Complete</Link></div>
          {visibleStudents.sort((a, b) => Number(b.needsAttention) - Number(a.needsAttention) || a.average - b.average).map((student) => <article className={styles.progressRow} key={student.studentId}><div><strong>{student.name}</strong><p>{student.completed}/{student.assignments} assignments complete</p></div><div><span>{student.average}%</span><div className={styles.progressTrack}><span style={{ width: `${student.average}%` }} /></div></div><span className={student.needsAttention ? styles.warning : styles.status}>{student.needsAttention ? 'Needs attention' : student.status.replace('_', ' ')}</span></article>)}
        </section>
      )}
    </main>
  );
}
