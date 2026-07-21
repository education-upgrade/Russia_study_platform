import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type AssignmentRow = {
  id: string;
  title: string;
  lesson_title: string;
  class_id: string;
  due_at: string | null;
  created_at: string;
  teaching_classes: { name: string } | { name: string }[] | null;
  assignment_recipients: { student_id: string; status: string }[] | null;
};

type ProgressRow = {
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
  progress_percent: number;
  current_activity_type: string | null;
  last_activity_at: string | null;
};

type ConfidenceRow = {
  assignment_id: string;
  student_id: string;
  confidence: number | null;
  last_saved_at: string;
};

type ProfileRow = { id: string; full_name: string | null };

type ClassRow = {
  class_id: string;
  teaching_classes: {
    id: string;
    name: string;
    academic_year: string | null;
    is_active: boolean;
  } | {
    id: string;
    name: string;
    academic_year: string | null;
    is_active: boolean;
  }[] | null;
};

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function firstName(value: string | null | undefined) {
  return value?.trim().split(/\s+/)[0] || 'Teacher';
}

function formatDueDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dueLabel(value: string | null) {
  if (!value) return 'No deadline';
  const difference = new Date(value).getTime() - Date.now();
  if (difference < 0) return 'Overdue';
  if (difference <= 48 * 60 * 60 * 1000) return 'Due soon';
  return `Due ${formatDueDate(value)}`;
}

function attentionReason(
  assignment: AssignmentRow,
  progress: ProgressRow | undefined,
  confidence: number | undefined,
) {
  const dueDifference = assignment.due_at ? new Date(assignment.due_at).getTime() - Date.now() : null;
  const notStarted = !progress || progress.status === 'not_started';

  if (notStarted && dueDifference !== null && dueDifference < 0) return { label: 'Overdue and not started', rank: 0 };
  if (notStarted && dueDifference !== null && dueDifference <= 48 * 60 * 60 * 1000) return { label: 'Not started · due soon', rank: 1 };
  if (confidence !== undefined && confidence <= 2) return { label: `Low confidence · ${confidence}/5`, rank: 2 };

  if (progress?.status === 'in_progress' && progress.last_activity_at) {
    const inactiveFor = Date.now() - new Date(progress.last_activity_at).getTime();
    if (inactiveFor >= 3 * 24 * 60 * 60 * 1000) {
      return {
        label: progress.current_activity_type
          ? `Stalled at ${getActivityLabel(progress.current_activity_type)}`
          : 'Progress has stalled',
        rank: 3,
      };
    }
  }

  return null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherDashboardPage() {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();

  if (!auth || !supabase) {
    return (
      <main className={styles.dashboard}>
        <section className={styles.empty}>
          <h2>Teacher home is unavailable</h2>
          <p>Connect Supabase and sign in with an active teacher account to see live class information.</p>
        </section>
      </main>
    );
  }

  const [{ data: classLinks }, { data: assignmentData, error: assignmentError }] = await Promise.all([
    supabase
      .from('class_teachers')
      .select('class_id, teaching_classes(id, name, academic_year, is_active)')
      .eq('teacher_id', auth.userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('classroom_assignments')
      .select('id, title, lesson_title, class_id, due_at, created_at, teaching_classes(name), assignment_recipients(student_id, status)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const activeClasses = ((classLinks ?? []) as ClassRow[])
    .map((link) => firstRelation(link.teaching_classes))
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.is_active));

  const assignments = (assignmentData ?? []) as AssignmentRow[];
  const assignmentIds = assignments.map((assignment) => assignment.id);
  const recipientIds = Array.from(new Set(assignments.flatMap((assignment) =>
    (assignment.assignment_recipients ?? [])
      .filter((recipient) => recipient.status === 'assigned')
      .map((recipient) => recipient.student_id),
  )));

  const classIds = activeClasses.map((teachingClass) => teachingClass.id);

  const [progressResult, confidenceResult, profilesResult, membershipsResult] = await Promise.all([
    assignmentIds.length
      ? supabase
          .from('assignment_progress')
          .select('assignment_id, student_id, status, progress_percent, current_activity_type, last_activity_at')
          .in('assignment_id', assignmentIds)
      : Promise.resolve({ data: [], error: null }),
    assignmentIds.length
      ? supabase
          .from('student_activity_progress')
          .select('assignment_id, student_id, confidence, last_saved_at')
          .in('assignment_id', assignmentIds)
          .not('confidence', 'is', null)
          .order('last_saved_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    recipientIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', recipientIds)
      : Promise.resolve({ data: [], error: null }),
    classIds.length
      ? supabase.from('class_memberships').select('class_id, student_id').in('class_id', classIds).eq('status', 'active')
      : Promise.resolve({ data: [], error: null }),
  ]);

  const progressRows = (progressResult.data ?? []) as ProgressRow[];
  const confidenceRows = (confidenceResult.data ?? []) as ConfidenceRow[];
  const profiles = new Map(((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile.full_name?.trim() || 'Student']));
  const progressByKey = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));
  const confidenceByKey = new Map<string, number>();

  confidenceRows.forEach((row) => {
    const key = `${row.assignment_id}:${row.student_id}`;
    if (!confidenceByKey.has(key) && row.confidence !== null) confidenceByKey.set(key, row.confidence);
  });

  const membershipCounts = new Map<string, number>();
  (membershipsResult.data ?? []).forEach((membership: any) => {
    membershipCounts.set(membership.class_id, (membershipCounts.get(membership.class_id) ?? 0) + 1);
  });

  const attention = assignments.flatMap((assignment) =>
    (assignment.assignment_recipients ?? [])
      .filter((recipient) => recipient.status === 'assigned')
      .flatMap((recipient) => {
        const key = `${assignment.id}:${recipient.student_id}`;
        const progress = progressByKey.get(key);
        const confidence = confidenceByKey.get(key);
        const reason = attentionReason(assignment, progress, confidence);
        if (!reason) return [];
        return [{
          assignment,
          studentId: recipient.student_id,
          studentName: profiles.get(recipient.student_id) ?? 'Student',
          progress,
          reason,
        }];
      }),
  )
    .sort((a, b) => a.reason.rank - b.reason.rank || (a.progress?.progress_percent ?? 0) - (b.progress?.progress_percent ?? 0))
    .slice(0, 6);

  const activeAssignmentCards = assignments.slice(0, 4).map((assignment) => {
    const recipients = (assignment.assignment_recipients ?? []).filter((recipient) => recipient.status === 'assigned');
    const completed = recipients.filter((recipient) => progressByKey.get(`${assignment.id}:${recipient.student_id}`)?.status === 'complete').length;
    const average = recipients.length
      ? Math.round(recipients.reduce((sum, recipient) => sum + (progressByKey.get(`${assignment.id}:${recipient.student_id}`)?.progress_percent ?? 0), 0) / recipients.length)
      : 0;
    return { assignment, recipients: recipients.length, completed, average };
  });

  const totalStudents = recipientIds.length;
  const notStartedCount = assignments.reduce((total, assignment) => total + (assignment.assignment_recipients ?? []).filter((recipient) => {
    if (recipient.status !== 'assigned') return false;
    const progress = progressByKey.get(`${assignment.id}:${recipient.student_id}`);
    return !progress || progress.status === 'not_started';
  }).length, 0);
  const lowConfidenceCount = Array.from(confidenceByKey.values()).filter((value) => value <= 2).length;
  const completedCount = progressRows.filter((row) => row.status === 'complete').length;
  const loadError = assignmentError || progressResult.error || confidenceResult.error || profilesResult.error || membershipsResult.error;

  return (
    <main className={styles.dashboard}>
      <section className={styles.welcome}>
        <div>
          <h2>Welcome back, {firstName(auth.profile.full_name)}</h2>
          <p>Your live teaching picture across classes and published assignments.</p>
        </div>
        <div className={styles.summaryLine} aria-label="Teacher account summary">
          <span className={styles.summaryPill}>{activeClasses.length} active {activeClasses.length === 1 ? 'class' : 'classes'}</span>
          <span className={styles.summaryPill}>{assignments.length} published {assignments.length === 1 ? 'assignment' : 'assignments'}</span>
          <span className={styles.summaryPill}>{totalStudents} assigned {totalStudents === 1 ? 'student' : 'students'}</span>
        </div>
      </section>

      {loadError && (
        <section className={styles.empty} role="alert">
          <h3>Some dashboard information could not be loaded</h3>
          <p>{loadError.message}</p>
        </section>
      )}

      <section className={styles.metrics} aria-label="Teaching summary">
        <article className={`${styles.metric} ${styles.metricAttention}`}><span>Needs attention</span><strong>{attention.length}</strong></article>
        <article className={styles.metric}><span>Not started</span><strong>{notStartedCount}</strong></article>
        <article className={styles.metric}><span>Low confidence</span><strong>{lowConfidenceCount}</strong></article>
        <article className={styles.metric}><span>Completed assignments</span><strong>{completedCount}</strong></article>
      </section>

      <section className={styles.mainGrid}>
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <div><h2>Needs attention</h2><p>Students prioritised by deadline, confidence and stalled progress.</p></div>
            <Link className={styles.sectionLink} href="/teacher/progress">Open progress</Link>
          </header>

          {attention.length === 0 ? (
            <div className={styles.empty}>
              <h3>No immediate concerns</h3>
              <p>There are no overdue non-starters, low-confidence students or stalled assignments in the current data.</p>
            </div>
          ) : (
            <div className={styles.attentionList}>
              {attention.map((item) => {
                const teachingClass = firstRelation(item.assignment.teaching_classes);
                return (
                  <article className={styles.attentionItem} key={`${item.assignment.id}:${item.studentId}`}>
                    <div>
                      <h3>{item.studentName}</h3>
                      <p>{teachingClass?.name ?? 'Class'} · {item.assignment.lesson_title}</p>
                      <span className={styles.attentionReason}>{item.reason.label}</span>
                    </div>
                    <Link className={styles.actionLink} href={`/teacher/progress/${item.assignment.id}/${item.studentId}`}>View evidence</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className={styles.section}>
          <header className={styles.sectionHeader}><div><h2>Quick actions</h2><p>Common tasks without large dashboard cards.</p></div></header>
          <div className={styles.quickActions}>
            <Link className={styles.quickAction} href="/teacher/set-study"><span>Set work</span><span>→</span></Link>
            <Link className={styles.quickAction} href="/teacher/classes"><span>Create or view classes</span><span>→</span></Link>
            <Link className={styles.quickAction} href="/teacher/progress"><span>Review progress</span><span>→</span></Link>
            <Link className={styles.quickAction} href="/student/lesson/1905"><span>Preview student pathway</span><span>→</span></Link>
          </div>
        </aside>
      </section>

      <section className={styles.lowerGrid}>
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <div><h2>Active assignments</h2><p>Recent published work and class completion.</p></div>
            <Link className={styles.sectionLink} href="/teacher/set-study">View assignments</Link>
          </header>

          {activeAssignmentCards.length === 0 ? (
            <div className={styles.empty}>
              <h3>No published assignments</h3>
              <p><Link className={styles.inlineLink} href="/teacher/set-study">Set your first assignment</Link> to begin collecting student progress.</p>
            </div>
          ) : (
            <div className={styles.assignmentList}>
              {activeAssignmentCards.map(({ assignment, recipients, completed, average }) => {
                const teachingClass = firstRelation(assignment.teaching_classes);
                return (
                  <article className={styles.assignmentCard} key={assignment.id}>
                    <div>
                      <h3>{assignment.title}</h3>
                      <p>{teachingClass?.name ?? 'Class'} · {assignment.lesson_title}</p>
                      <div className={styles.assignmentMeta}>
                        <span>{completed}/{recipients} complete</span>
                        <span>{dueLabel(assignment.due_at)}</span>
                        <span>{average}% average progress</span>
                      </div>
                      <div className={styles.progressTrack} aria-label={`${average}% average progress`}>
                        <div className={styles.progressFill} style={{ width: `${average}%` }} />
                      </div>
                    </div>
                    <Link className={styles.actionLink} href={`/teacher/progress?assignment=${assignment.id}`}>View progress</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <div><h2>Classes</h2><p>Your active teaching groups.</p></div>
            <Link className={styles.sectionLink} href="/teacher/classes">All classes</Link>
          </header>

          {activeClasses.length === 0 ? (
            <div className={styles.empty}>
              <h3>No active classes</h3>
              <p><Link className={styles.inlineLink} href="/teacher/classes">Create a class</Link> and share its join code with students.</p>
            </div>
          ) : (
            <div className={styles.classList}>
              {activeClasses.slice(0, 4).map((teachingClass) => {
                const classAssignments = assignments.filter((assignment) => assignment.class_id === teachingClass.id).length;
                return (
                  <article className={styles.classCard} key={teachingClass.id}>
                    <div>
                      <h3>{teachingClass.name}</h3>
                      <p>{teachingClass.academic_year || 'Academic year not set'}</p>
                      <div className={styles.classMeta}>
                        <span>{membershipCounts.get(teachingClass.id) ?? 0} students</span>
                        <span>{classAssignments} active {classAssignments === 1 ? 'assignment' : 'assignments'}</span>
                      </div>
                    </div>
                    <Link className={styles.actionLink} href="/teacher/classes">View</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
