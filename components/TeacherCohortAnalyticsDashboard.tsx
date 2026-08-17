import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/analytics/page.module.css';

type Props = { initialClassId?: string };
type Assignment = {
  id: string;
  class_id: string;
  title: string;
  lesson_title: string;
  status: string;
  created_at: string;
  teaching_classes: { id: string; name: string } | { id: string; name: string }[] | null;
  assignment_recipients: { student_id: string; status: string }[] | null;
};
type Progress = {
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
  progress_percent: number;
  last_activity_at: string | null;
};
type ActivityProgress = {
  assignment_id: string;
  student_id: string;
  activity_type: string;
  status: 'not_started' | 'in_progress' | 'complete';
  score: number | null;
  max_score: number | null;
  confidence: number | null;
  attempt_count: number;
  last_saved_at: string | null;
};

type Insight = { title: string; detail: string; level: 'attention' | 'watch' | 'positive'; href?: string };

function relation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function average(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
function pct(value: number | null) { return value === null ? '—' : `${Math.round(value)}%`; }
function scorePercent(row: ActivityProgress) { return row.score !== null && row.max_score ? Math.round((row.score / row.max_score) * 100) : null; }

export default async function TeacherCohortAnalyticsDashboard({ initialClassId }: Props) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return null;

  const { data: classLinks } = await supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name)')
    .eq('teacher_id', auth.userId);

  const classes = (classLinks ?? []).map((row: any) => relation(row.teaching_classes)).filter(Boolean) as { id: string; name: string }[];
  const allowedClassIds = new Set(classes.map((item) => item.id));
  const selectedClassId = initialClassId && allowedClassIds.has(initialClassId) ? initialClassId : '';
  const scopedClassIds = selectedClassId ? [selectedClassId] : classes.map((item) => item.id);

  if (!scopedClassIds.length) {
    return <main className={styles.page}><section className={styles.empty}><h2>No classes yet</h2><p>Create a class before teacher insights can identify learning patterns.</p><Link className={styles.primaryButton} href="/teacher/classes">Go to classes</Link></section></main>;
  }

  const { data: assignmentData, error: assignmentError } = await supabase
    .from('classroom_assignments')
    .select('id, class_id, title, lesson_title, status, created_at, teaching_classes(id, name), assignment_recipients(student_id, status)')
    .in('class_id', scopedClassIds)
    .in('status', ['published', 'archived'])
    .order('created_at', { ascending: false });

  const assignments = (assignmentData ?? []) as Assignment[];
  const assignmentIds = assignments.map((item) => item.id);
  const studentIds = Array.from(new Set(assignments.flatMap((assignment) => (assignment.assignment_recipients ?? []).filter((r) => r.status === 'assigned').map((r) => r.student_id))));

  const [profilesResult, progressResult, activityResult] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, student_id, status, progress_percent, last_activity_at').in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, student_id, activity_type, status, score, max_score, confidence, attempt_count, last_saved_at').in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
  ]);

  const profileMap = new Map((profilesResult.data ?? []).map((row: any) => [row.id, row.full_name?.trim() || 'Student']));
  const progressRows = (progressResult.data ?? []) as Progress[];
  const activityRows = (activityResult.data ?? []) as ActivityProgress[];
  const progressMap = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));

  const recipientPairs = assignments.flatMap((assignment) => (assignment.assignment_recipients ?? [])
    .filter((recipient) => recipient.status === 'assigned')
    .map((recipient) => ({ assignment, studentId: recipient.student_id, progress: progressMap.get(`${assignment.id}:${recipient.student_id}`) })));

  const totalRecipients = recipientPairs.length;
  const completedRecipients = recipientPairs.filter((item) => item.progress?.status === 'complete').length;
  const overallCompletion = totalRecipients ? Math.round((completedRecipients / totalRecipients) * 100) : 0;

  const confidenceValues = activityRows.map((row) => row.confidence).filter((value): value is number => value !== null);
  const averageConfidence = average(confidenceValues);
  const scoredRows = activityRows.filter((row) => scorePercent(row) !== null);
  const averageScore = average(scoredRows.map((row) => scorePercent(row) as number));

  const studentSummaries = studentIds.map((studentId) => {
    const pairs = recipientPairs.filter((item) => item.studentId === studentId);
    const incomplete = pairs.filter((item) => item.progress?.status !== 'complete').length;
    const complete = pairs.length - incomplete;
    const studentActivities = activityRows.filter((row) => row.student_id === studentId);
    const lowConfidenceAssignments = new Set(studentActivities.filter((row) => row.confidence !== null && row.confidence <= 2).map((row) => row.assignment_id)).size;
    const repeatedAttemptActivities = studentActivities.filter((row) => row.attempt_count >= 3).length;
    const weakScoredActivities = studentActivities.filter((row) => { const score = scorePercent(row); return score !== null && score < 60; }).length;
    return { studentId, name: profileMap.get(studentId) ?? 'Student', assigned: pairs.length, incomplete, complete, lowConfidenceAssignments, repeatedAttemptActivities, weakScoredActivities };
  });

  const persistentIncomplete = studentSummaries.filter((student) => student.incomplete >= 2);
  const repeatedLowConfidence = studentSummaries.filter((student) => student.lowConfidenceAssignments >= 2);
  const repeatedAttempts = studentSummaries.filter((student) => student.repeatedAttemptActivities >= 2);
  const weakScores = studentSummaries.filter((student) => student.weakScoredActivities >= 2);

  const activityTypes = Array.from(new Set(activityRows.map((row) => row.activity_type)));
  const activityPatterns = activityTypes.map((activityType) => {
    const rows = activityRows.filter((row) => row.activity_type === activityType);
    const completed = rows.filter((row) => row.status === 'complete').length;
    const completion = rows.length ? (completed / rows.length) * 100 : null;
    const scores = rows.map(scorePercent).filter((value): value is number => value !== null);
    const confidence = rows.map((row) => row.confidence).filter((value): value is number => value !== null);
    return { activityType, label: getActivityLabel(activityType), evidenceCount: rows.length, completion, score: average(scores), confidence: average(confidence) };
  }).filter((item) => item.evidenceCount >= 2)
    .sort((a, b) => (a.completion ?? 100) - (b.completion ?? 100) || (a.score ?? 100) - (b.score ?? 100));

  const weakestActivity = activityPatterns[0] ?? null;
  const strongestActivity = [...activityPatterns].sort((a, b) => (b.completion ?? 0) - (a.completion ?? 0) || (b.score ?? 0) - (a.score ?? 0))[0] ?? null;

  const insights: Insight[] = [];
  if (persistentIncomplete.length) insights.push({ title: `${persistentIncomplete.length} student${persistentIncomplete.length === 1 ? '' : 's'} repeatedly leave assignments incomplete`, detail: 'These students have at least two assigned pieces of work that are not complete. This is a pattern across assignments, not a single missed task.', level: 'attention', href: '/teacher/progress?filter=all' });
  if (repeatedLowConfidence.length) insights.push({ title: `${repeatedLowConfidence.length} student${repeatedLowConfidence.length === 1 ? '' : 's'} repeatedly report low confidence`, detail: 'Each has confidence of 1–2/5 recorded across at least two different assignments.', level: 'attention', href: '/teacher/progress?filter=low_confidence' });
  if (repeatedAttempts.length) insights.push({ title: `${repeatedAttempts.length} student${repeatedAttempts.length === 1 ? '' : 's'} show repeated attempts across activities`, detail: 'These students have at least two activities with three or more recorded attempts. Review their evidence before deciding whether this reflects productive practice or difficulty.', level: 'watch' });
  if (weakScores.length) insights.push({ title: `${weakScores.length} student${weakScores.length === 1 ? '' : 's'} have repeated weak scored evidence`, detail: 'Each has at least two scored activities below 60%. This signal uses only activities that store a score and maximum score.', level: 'watch' });
  if (weakestActivity) insights.push({ title: `${weakestActivity.label} is currently the weakest activity pattern`, detail: `${pct(weakestActivity.completion)} completion${weakestActivity.score !== null ? ` · ${pct(weakestActivity.score)} average scored evidence` : ''}${weakestActivity.confidence !== null ? ` · ${weakestActivity.confidence.toFixed(1)}/5 confidence` : ''}. Based on ${weakestActivity.evidenceCount} saved activity records.`, level: weakestActivity.completion !== null && weakestActivity.completion < 70 ? 'attention' : 'watch' });
  if (!insights.length && totalRecipients) insights.push({ title: 'No repeated concern pattern is currently strong enough to flag', detail: 'The rules did not find repeated incomplete work, repeated low confidence, repeated weak scored evidence or repeated high-attempt activity.', level: 'positive' });

  const classRows = classes.filter((item) => scopedClassIds.includes(item.id)).map((classItem) => {
    const classAssignments = assignments.filter((assignment) => assignment.class_id === classItem.id);
    const pairs = recipientPairs.filter((item) => item.assignment.class_id === classItem.id);
    const complete = pairs.filter((item) => item.progress?.status === 'complete').length;
    return { ...classItem, assignments: classAssignments.length, recipients: pairs.length, completion: pairs.length ? Math.round((complete / pairs.length) * 100) : 0 };
  });

  const loadError = assignmentError || profilesResult.error || progressResult.error || activityResult.error;

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><Link className={styles.backLink} href="/teacher/progress">← Interventions</Link><p className={styles.eyebrow}>Rule-based teacher intelligence</p><h1>Insights</h1><p>Patterns across assignment history and saved evidence. Every flag below is generated from explicit rules, not AI.</p></div>
      <form className={styles.classFilter}><label htmlFor="classId">Class</label><select id="classId" name="classId" defaultValue={selectedClassId}><option value="">All my classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="submit">Apply</button></form>
    </header>

    {loadError && <div className={styles.error}>Some insight data could not be loaded: {loadError.message}</div>}

    <section className={styles.metrics} aria-label="Insight summary">
      <article><span>Assignment completion</span><strong>{overallCompletion}%</strong><small>{completedRecipients}/{totalRecipients} student-assignment records complete</small></article>
      <article><span>Average confidence</span><strong>{averageConfidence === null ? '—' : `${averageConfidence.toFixed(1)}/5`}</strong><small>{confidenceValues.length} saved confidence records</small></article>
      <article><span>Average scored evidence</span><strong>{pct(averageScore)}</strong><small>{scoredRows.length} activities with comparable scores</small></article>
      <article><span>Repeated concerns</span><strong>{new Set([...persistentIncomplete, ...repeatedLowConfidence, ...weakScores].map((item) => item.studentId)).size}</strong><small>students meeting at least one repeated-pattern rule</small></article>
    </section>

    <section className={styles.panel}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>What stands out</p><h2>Current teaching signals</h2><p>Use these as prompts to inspect evidence, not as automatic judgements about attainment.</p></div><span>{insights.length} signal{insights.length === 1 ? '' : 's'}</span></div>
      <div className={styles.insightGrid}>{insights.map((insight) => <article key={insight.title} className={`${styles.insight} ${styles[insight.level]}`}><div><strong>{insight.title}</strong><p>{insight.detail}</p></div>{insight.href && <Link href={insight.href}>Review students →</Link>}</article>)}</div>
    </section>

    <section className={styles.twoColumn}>
      <article className={styles.panel}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Activity patterns</p><h2>Where students appear to struggle</h2></div></div>{activityPatterns.length === 0 ? <div className={styles.emptyInline}>Not enough saved activity evidence yet.</div> : <div className={styles.patternList}>{activityPatterns.slice(0, 8).map((item) => <div key={item.activityType}><div><strong>{item.label}</strong><small>{item.evidenceCount} records</small></div><span>{pct(item.completion)} complete</span><span>{item.score === null ? 'No score' : `${pct(item.score)} score`}</span><span>{item.confidence === null ? 'No confidence' : `${item.confidence.toFixed(1)}/5 confidence`}</span></div>)}</div>}</article>
      <article className={styles.panel}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Class picture</p><h2>Completion by class</h2></div></div><div className={styles.classList}>{classRows.map((item) => <Link href={`/teacher/classes/${item.id}/tracking`} key={item.id}><div><strong>{item.name}</strong><small>{item.assignments} assignments · {item.recipients} student-assignment records</small></div><span>{item.completion}% complete</span></Link>)}</div>{strongestActivity && <div className={styles.positiveNote}><strong>Current strongest pattern: {strongestActivity.label}</strong><p>{pct(strongestActivity.completion)} completion{strongestActivity.score !== null ? ` · ${pct(strongestActivity.score)} average scored evidence` : ''}.</p></div>}</article>
    </section>

    <section className={styles.panel}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Students to review</p><h2>Repeated-pattern groups</h2><p>Students may appear in more than one group.</p></div></div>
      <div className={styles.groupGrid}>
        <article><h3>Repeated incomplete work</h3><p>{persistentIncomplete.length ? persistentIncomplete.map((item) => item.name).join(', ') : 'No students currently meet this rule.'}</p><small>Rule: at least 2 assigned pieces not complete.</small></article>
        <article><h3>Repeated low confidence</h3><p>{repeatedLowConfidence.length ? repeatedLowConfidence.map((item) => item.name).join(', ') : 'No students currently meet this rule.'}</p><small>Rule: confidence 1–2/5 across at least 2 assignments.</small></article>
        <article><h3>Repeated weak scores</h3><p>{weakScores.length ? weakScores.map((item) => item.name).join(', ') : 'No students currently meet this rule.'}</p><small>Rule: at least 2 scored activities below 60%.</small></article>
        <article><h3>Repeated attempts</h3><p>{repeatedAttempts.length ? repeatedAttempts.map((item) => item.name).join(', ') : 'No students currently meet this rule.'}</p><small>Rule: at least 2 activities with 3+ attempts.</small></article>
      </div>
    </section>
  </main>;
}
