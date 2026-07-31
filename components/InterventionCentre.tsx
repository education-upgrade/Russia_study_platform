import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/progress/page.module.css';

type Props = {
  initialFilters: { assignment?: string; classId?: string; filter?: string; q?: string };
};

type Assignment = {
  id: string;
  class_id: string;
  title: string;
  lesson_title: string;
  due_at: string | null;
  required_activity_types: string[];
  teaching_classes: { id: string; name: string } | { id: string; name: string }[] | null;
  assignment_recipients: { student_id: string; status: string }[] | null;
};

type Progress = {
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
  progress_percent: number;
  completed_activity_count: number;
  total_activity_count: number;
  current_activity_type: string | null;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string | null;
};

type ActivityProgress = {
  assignment_id: string;
  student_id: string;
  activity_type: string;
  status: 'not_started' | 'in_progress' | 'complete';
  confidence: number | null;
  started_at: string | null;
  completed_at: string | null;
  last_saved_at: string | null;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Not yet';
}

function daysSince(value: string | null) {
  if (!value) return null;
  return Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
}

function priority(assignment: Assignment, progress: Progress | undefined, confidence: number | undefined) {
  const dueDifference = assignment.due_at ? new Date(assignment.due_at).getTime() - Date.now() : null;
  const notStarted = !progress || progress.status === 'not_started';
  if (notStarted && dueDifference !== null && dueDifference < 0) return { code: 'overdue', label: 'Overdue and not started', rank: 1 };
  if (notStarted && dueDifference !== null && dueDifference <= 48 * 60 * 60 * 1000) return { code: 'due_soon', label: 'Not started · due within 48 hours', rank: 2 };
  if (confidence !== undefined && confidence <= 2) return { code: 'low_confidence', label: `Low confidence · ${confidence}/5`, rank: 3 };
  if (progress?.status === 'in_progress' && daysSince(progress.last_activity_at) !== null && (daysSince(progress.last_activity_at) ?? 0) >= 3) {
    return { code: 'stalled', label: progress.current_activity_type ? `Stalled at ${getActivityLabel(progress.current_activity_type)}` : 'Progress stalled', rank: 4 };
  }
  return null;
}

export default async function InterventionCentre({ initialFilters }: Props) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return <main className={styles.shell}><section className={styles.mainCard}><p>Intervention Centre is unavailable.</p></section></main>;

  const { data: assignmentData, error: assignmentError } = await supabase
    .from('classroom_assignments')
    .select('id, class_id, title, lesson_title, due_at, required_activity_types, teaching_classes(id, name), assignment_recipients(student_id, status)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const assignments = (assignmentData ?? []) as Assignment[];
  const assignmentIds = assignments.map((assignment) => assignment.id);
  const studentIds = Array.from(new Set(assignments.flatMap((assignment) => (assignment.assignment_recipients ?? []).map((recipient) => recipient.student_id))));

  const [profilesResult, progressResult, activityResult] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, student_id, status, progress_percent, completed_activity_count, total_activity_count, current_activity_type, started_at, completed_at, last_activity_at').in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, student_id, activity_type, status, confidence, started_at, completed_at, last_saved_at').in('assignment_id', assignmentIds).order('last_saved_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
  ]);

  const profileMap = new Map((profilesResult.data ?? []).map((row: any) => [row.id, row.full_name?.trim() || 'Student']));
  const progressRows = (progressResult.data ?? []) as Progress[];
  const activityRows = (activityResult.data ?? []) as ActivityProgress[];
  const progressMap = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));
  const confidenceMap = new Map<string, number>();
  activityRows.forEach((row) => {
    const key = `${row.assignment_id}:${row.student_id}`;
    if (!confidenceMap.has(key) && row.confidence !== null) confidenceMap.set(key, row.confidence);
  });

  const items = assignments.flatMap((assignment) => (assignment.assignment_recipients ?? [])
    .filter((recipient) => recipient.status === 'assigned')
    .map((recipient) => {
      const key = `${assignment.id}:${recipient.student_id}`;
      const progress = progressMap.get(key);
      const confidence = confidenceMap.get(key);
      const reason = priority(assignment, progress, confidence);
      return {
        assignment,
        studentId: recipient.student_id,
        studentName: profileMap.get(recipient.student_id) ?? 'Student',
        progress,
        confidence,
        reason,
      };
    }));

  const q = (initialFilters.q ?? '').trim().toLowerCase();
  const filter = initialFilters.filter ?? 'attention';
  const visible = items.filter((item) => {
    if (initialFilters.assignment && item.assignment.id !== initialFilters.assignment) return false;
    if (initialFilters.classId && item.assignment.class_id !== initialFilters.classId) return false;
    if (q && !item.studentName.toLowerCase().includes(q) && !item.assignment.title.toLowerCase().includes(q)) return false;
    if (filter === 'attention') return Boolean(item.reason);
    if (filter === 'overdue') return item.reason?.code === 'overdue';
    if (filter === 'due_soon') return item.reason?.code === 'due_soon';
    if (filter === 'low_confidence') return item.reason?.code === 'low_confidence';
    if (filter === 'stalled') return item.reason?.code === 'stalled';
    if (filter === 'not_started') return !item.progress || item.progress.status === 'not_started';
    if (filter === 'complete') return item.progress?.status === 'complete';
    return true;
  }).sort((a, b) => (a.reason?.rank ?? 99) - (b.reason?.rank ?? 99) || (a.progress?.progress_percent ?? 0) - (b.progress?.progress_percent ?? 0));

  const counts = {
    attention: items.filter((item) => item.reason).length,
    overdue: items.filter((item) => item.reason?.code === 'overdue').length,
    lowConfidence: items.filter((item) => item.reason?.code === 'low_confidence').length,
    stalled: items.filter((item) => item.reason?.code === 'stalled').length,
  };

  const selectedAssignment = assignments.find((assignment) => assignment.id === initialFilters.assignment) ?? assignments[0] ?? null;
  const matrixRecipients = selectedAssignment ? items.filter((item) => item.assignment.id === selectedAssignment.id) : [];
  const activityByKey = new Map(activityRows.map((row) => [`${row.assignment_id}:${row.student_id}:${row.activity_type}`, row]));
  const loadError = assignmentError || profilesResult.error || progressResult.error || activityResult.error;

  return (
    <main className={styles.shell}>
      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Action-first progress</p><h1>Intervention Centre</h1><p>Students prioritised by deadlines, confidence and stalled progress.</p></div>
          <aside className={styles.decisionCard}><strong>{counts.attention} need attention</strong><span>{counts.overdue} overdue · {counts.lowConfidence} low confidence · {counts.stalled} stalled</span></aside>
        </header>

        {loadError && <p className={styles.errorText}>Some data could not be loaded: {loadError.message}</p>}

        <section className={styles.snapshot}>
          <article className={styles.metric}><span>Needs attention</span><strong>{counts.attention}</strong></article>
          <article className={styles.metric}><span>Overdue</span><strong>{counts.overdue}</strong></article>
          <article className={styles.metric}><span>Low confidence</span><strong>{counts.lowConfidence}</strong></article>
          <article className={styles.metric}><span>Stalled</span><strong>{counts.stalled}</strong></article>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><div><h2>Intervention queue</h2><p>Open evidence before deciding the next action.</p></div><span className={styles.badge}>{visible.length} shown</span></div>
          <form className={styles.filters}>
            <input name="q" defaultValue={initialFilters.q ?? ''} placeholder="Search student or assignment" />
            <select name="filter" defaultValue={filter}>
              <option value="attention">Needs attention</option><option value="overdue">Overdue</option><option value="due_soon">Due soon</option><option value="low_confidence">Low confidence</option><option value="stalled">Stalled</option><option value="not_started">Not started</option><option value="complete">Complete</option><option value="all">All recipients</option>
            </select>
            <select name="assignment" defaultValue={initialFilters.assignment ?? ''}><option value="">All assignments</option>{assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{firstRelation(assignment.teaching_classes)?.name ?? 'Class'} · {assignment.title}</option>)}</select>
            <button type="submit">Apply</button>
          </form>
          <div className={styles.priorityList}>
            {visible.length === 0 ? <div className={styles.empty}><h3>No students match</h3><p>Try another filter or assignment.</p></div> : visible.map((item) => (
              <article className={styles.priorityItem} key={`${item.assignment.id}:${item.studentId}`}>
                <div><strong>{item.studentName}</strong><small>{firstRelation(item.assignment.teaching_classes)?.name ?? 'Class'} · {item.assignment.title}</small></div>
                <div><p>{item.reason?.label ?? `${item.progress?.progress_percent ?? 0}% complete`}</p><small>{item.progress?.last_activity_at ? `Last active ${formatDate(item.progress.last_activity_at)}` : 'No saved activity'} · Due {formatDate(item.assignment.due_at)}</small></div>
                <Link className={styles.navButton} href={`/teacher/progress/${item.assignment.id}/${item.studentId}`}>Review evidence</Link>
              </article>
            ))}
          </div>
        </section>

        {selectedAssignment && (
          <section className={styles.studentEvidence}>
            <div className={styles.sectionHeader}><div><h2>Activity heatmap</h2><p>{firstRelation(selectedAssignment.teaching_classes)?.name ?? 'Class'} · {selectedAssignment.title}</p></div><Link className={styles.navButton} href={`/teacher/assignments/${selectedAssignment.id}`}>Assignment workspace</Link></div>
            <div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Student</th>{selectedAssignment.required_activity_types.map((activity) => <th key={activity}>{getActivityLabel(activity)}</th>)}</tr></thead><tbody>{matrixRecipients.map((item) => <tr key={item.studentId}><td>{item.studentName}</td>{selectedAssignment.required_activity_types.map((activity) => { const row = activityByKey.get(`${selectedAssignment.id}:${item.studentId}:${activity}`); const symbol = row?.status === 'complete' ? '●' : row?.status === 'in_progress' ? '◐' : '○'; return <td key={activity} title={row?.status ?? 'not started'}>{symbol}</td>; })}</tr>)}</tbody></table></div>
          </section>
        )}
      </section>
    </main>
  );
}
