import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { getSubjectActivityLabel } from '@/lib/activeSubjectRuntime';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ assignmentId: string; studentId: string }> };
type Assignment = { id: string; class_id: string; title: string; lesson_title: string; pathway_slug: string; mode: string; required_activity_types: string[]; due_at: string | null; created_at: string; teaching_classes: { id: string; name: string } | { id: string; name: string }[] | null };
type Summary = { status: 'not_started' | 'in_progress' | 'complete'; completed_activity_count: number; total_activity_count: number; progress_percent: number; current_activity_type: string | null; started_at: string | null; completed_at: string | null; last_activity_at: string | null };
type ActivityProgress = { activity_type: string; status: 'not_started' | 'in_progress' | 'complete'; attempt_count: number; score: number | null; max_score: number | null; confidence: number | null; position: Record<string, unknown> | null; started_at: string | null; completed_at: string | null; last_saved_at: string | null };

function firstRelation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatDate(value: string | null) { return value ? formatSchoolDateTime(value, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Not yet'; }
function assignmentStatus(summary: Summary | null) { if (summary?.status === 'complete') return 'Complete'; if (!summary || summary.status === 'not_started' || summary.progress_percent === 0) return 'Not attempted'; return 'Incomplete'; }
function activityStatus(row?: ActivityProgress) { if (row?.status === 'complete') return 'Complete'; if (!row || row.status === 'not_started') return 'Not attempted'; return 'Incomplete'; }
function statusClass(status: string) { if (status === 'Complete') return styles.complete; if (status === 'Incomplete') return styles.incomplete; return styles.notAttempted; }
function scorePercent(row: ActivityProgress) { return row.score !== null && row.max_score ? Math.round((row.score / row.max_score) * 100) : null; }
function friendlyKey(key: string) { return key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function friendlyValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
function writtenResponse(position: Record<string, unknown> | null) {
  if (!position) return null;
  const candidates = ['lessonSummary', 'fullResponse', 'response', 'answer', 'writtenResponse'];
  for (const key of candidates) {
    const value = position[key];
    if (typeof value === 'string' && value.trim()) return { label: key === 'lessonSummary' ? 'Lesson notes summary' : 'Student written response', text: value.trim() };
  }
  return null;
}

export default async function StudentEvidencePage({ params }: Props) {
  const auth = await requireRoles(['teacher', 'admin']);
  const { assignmentId, studentId } = await params;
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) notFound();

  const [{ data: assignmentData }, { data: recipient }, { data: profile }, { data: summaryData }, { data: activityData }] = await Promise.all([
    supabase.from('classroom_assignments').select('id, class_id, title, lesson_title, pathway_slug, mode, required_activity_types, due_at, created_at, teaching_classes(id, name)').eq('id', assignmentId).maybeSingle<Assignment>(),
    supabase.from('assignment_recipients').select('student_id').eq('assignment_id', assignmentId).eq('student_id', studentId).maybeSingle(),
    supabase.from('profiles').select('id, full_name').eq('id', studentId).maybeSingle<{ id: string; full_name: string | null }>(),
    supabase.from('assignment_progress').select('status, completed_activity_count, total_activity_count, progress_percent, current_activity_type, started_at, completed_at, last_activity_at').eq('assignment_id', assignmentId).eq('student_id', studentId).maybeSingle<Summary>(),
    supabase.from('student_activity_progress').select('activity_type, status, attempt_count, score, max_score, confidence, position, started_at, completed_at, last_saved_at').eq('assignment_id', assignmentId).eq('student_id', studentId),
  ]);

  if (!assignmentData || !recipient) notFound();
  const assignment = assignmentData;
  const { data: teacherLink } = await supabase.from('class_teachers').select('class_id').eq('class_id', assignment.class_id).eq('teacher_id', auth.userId).maybeSingle();
  if (!teacherLink && auth.profile.role !== 'admin') notFound();

  const summary = summaryData ?? null;
  const activityRows = (activityData ?? []) as ActivityProgress[];
  const activityMap = new Map(activityRows.map((row) => [row.activity_type, row]));
  const name = profile?.full_name?.trim() || 'Student';
  const teachingClass = firstRelation(assignment.teaching_classes);
  const label = (activityType: string) => getSubjectActivityLabel(assignment.pathway_slug, activityType);
  const requiredRows = assignment.required_activity_types.map((activityType) => activityMap.get(activityType)).filter((row): row is ActivityProgress => Boolean(row));
  const scoredRows = requiredRows.filter((row) => scorePercent(row) !== null);
  const averageScore = scoredRows.length ? Math.round(scoredRows.reduce((sum, row) => sum + (scorePercent(row) ?? 0), 0) / scoredRows.length) : null;
  const confidenceRows = requiredRows.filter((row) => row.confidence !== null);
  const averageConfidence = confidenceRows.length ? confidenceRows.reduce((sum, row) => sum + (row.confidence ?? 0), 0) / confidenceRows.length : null;
  const lowConfidence = requiredRows.filter((row) => row.confidence !== null && row.confidence <= 2);
  const multipleAttempts = requiredRows.filter((row) => row.attempt_count > 1);
  const incompleteRows = assignment.required_activity_types.filter((activityType) => activityStatus(activityMap.get(activityType)) !== 'Complete');

  const reviewSignals: { tone: 'attention' | 'positive' | 'neutral'; title: string; detail: string }[] = [];
  if (assignmentStatus(summary) === 'Not attempted') reviewSignals.push({ tone: 'attention', title: 'No work attempted', detail: 'There is no recorded student activity for this assignment yet.' });
  else if (incompleteRows.length) reviewSignals.push({ tone: 'attention', title: `${incompleteRows.length} task${incompleteRows.length === 1 ? '' : 's'} still incomplete`, detail: incompleteRows.slice(0, 3).map(label).join(' · ') });
  if (lowConfidence.length) reviewSignals.push({ tone: 'attention', title: 'Low confidence reported', detail: lowConfidence.map((row) => `${label(row.activity_type)} ${row.confidence}/5`).join(' · ') });
  if (averageScore !== null && averageScore < 60) reviewSignals.push({ tone: 'attention', title: 'Scored evidence needs review', detail: `Average across ${scoredRows.length} scored task${scoredRows.length === 1 ? '' : 's'} is ${averageScore}%.` });
  if (multipleAttempts.length) reviewSignals.push({ tone: 'neutral', title: 'Repeated attempts', detail: multipleAttempts.map((row) => `${label(row.activity_type)} ×${row.attempt_count}`).join(' · ') });
  if (assignmentStatus(summary) === 'Complete' && !lowConfidence.length && (averageScore === null || averageScore >= 70)) reviewSignals.push({ tone: 'positive', title: 'No immediate concern', detail: averageScore === null ? 'All required activities are complete.' : `Complete with an average scored result of ${averageScore}%.` });
  if (!reviewSignals.length) reviewSignals.push({ tone: 'neutral', title: 'Evidence is still developing', detail: 'Open the activity records below for the latest saved student responses and evidence.' });

  return <main className={styles.page}>
    <nav className={styles.breadcrumbs} aria-label="Evidence navigation">
      <Link href={`/teacher/assignments/${assignmentId}?tab=students`}>← Student responses</Link>
      {teachingClass?.id && <Link href={`/teacher/classes/${teachingClass.id}/students/${studentId}`}>Full student history</Link>}
    </nav>

    <header className={styles.header}>
      <div className={styles.headerText}><p className={styles.eyebrow}>Student responses & evidence</p><h1>{name}</h1><p>{teachingClass?.name ?? 'Class'} · {assignment.lesson_title}</p><p className={styles.meta}>Due {formatDate(assignment.due_at)} · Last active {formatDate(summary?.last_activity_at ?? null)}</p></div>
      <div className={`${styles.assignmentState} ${statusClass(assignmentStatus(summary))}`}><span>{assignmentStatus(summary)}</span><strong>{summary?.progress_percent ?? 0}%</strong><small>{summary?.completed_activity_count ?? 0}/{summary?.total_activity_count ?? assignment.required_activity_types.length} activities</small></div>
    </header>

    <section className={styles.metrics} aria-label="Evidence summary">
      <article><span>Progress</span><strong>{summary?.progress_percent ?? 0}%</strong><small>{summary?.completed_activity_count ?? 0} of {summary?.total_activity_count ?? assignment.required_activity_types.length} complete</small></article>
      <article><span>Scored evidence</span><strong>{averageScore === null ? '—' : `${averageScore}%`}</strong><small>{scoredRows.length ? `${scoredRows.length} scored task${scoredRows.length === 1 ? '' : 's'}` : 'No scored tasks yet'}</small></article>
      <article><span>Confidence</span><strong>{averageConfidence === null ? '—' : `${averageConfidence.toFixed(1)}/5`}</strong><small>{confidenceRows.length ? `${confidenceRows.length} confidence record${confidenceRows.length === 1 ? '' : 's'}` : 'No confidence data yet'}</small></article>
      <article><span>Attempts</span><strong>{requiredRows.reduce((sum, row) => sum + row.attempt_count, 0)}</strong><small>{multipleAttempts.length ? `${multipleAttempts.length} task${multipleAttempts.length === 1 ? '' : 's'} repeated` : 'No repeated tasks'}</small></article>
    </section>

    <section className={styles.reviewPanel}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Teacher review</p><h2>What stands out</h2></div><span>{reviewSignals.length} signal{reviewSignals.length === 1 ? '' : 's'}</span></div><div className={styles.signalGrid}>{reviewSignals.map((signal, index) => <article className={`${styles.signal} ${styles[signal.tone]}`} key={`${signal.title}-${index}`}><strong>{signal.title}</strong><p>{signal.detail}</p></article>)}</div></section>

    <section className={styles.evidenceSection}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Required route</p><h2>Responses and activity evidence</h2><p>Written responses are shown directly; scores, confidence, attempts and other saved detail remain available for every activity.</p></div><span>{assignment.required_activity_types.length} activities</span></div>
      <div className={styles.activityList}>{assignment.required_activity_types.map((activityType, index) => {
        const row = activityMap.get(activityType);
        const status = activityStatus(row);
        const percent = row ? scorePercent(row) : null;
        const response = writtenResponse(row?.position ?? null);
        const positionEntries = row?.position ? Object.entries(row.position).filter(([key, value]) => !['lessonSummary', 'fullResponse', 'response', 'answer', 'writtenResponse'].includes(key) && value !== null && value !== undefined && value !== '').slice(0, 12) : [];
        return <article className={styles.activityCard} key={activityType}>
          <div className={styles.activityTop}><div className={styles.activityTitle}><span>{index + 1}</span><div><h3>{label(activityType)}</h3><p>{row?.last_saved_at ? `Last saved ${formatDate(row.last_saved_at)}` : 'No saved evidence yet'}</p></div></div><span className={`${styles.status} ${statusClass(status)}`}>{status}</span></div>
          <div className={styles.activityFacts}><div><span>Score</span><strong>{row?.score !== null && row?.score !== undefined ? `${row.score}${row.max_score ? `/${row.max_score}` : ''}` : '—'}</strong>{percent !== null && <small>{percent}%</small>}</div><div><span>Confidence</span><strong>{row?.confidence !== null && row?.confidence !== undefined ? `${row.confidence}/5` : '—'}</strong><small>{row?.confidence !== null && row?.confidence !== undefined && row.confidence <= 2 ? 'Low' : row?.confidence !== null && row?.confidence !== undefined ? 'Recorded' : 'Not recorded'}</small></div><div><span>Attempts</span><strong>{row?.attempt_count ?? 0}</strong><small>{(row?.attempt_count ?? 0) > 1 ? 'Repeated' : '—'}</small></div><div><span>Completed</span><strong>{row?.completed_at ? formatDate(row.completed_at) : '—'}</strong><small>{row?.started_at ? `Started ${formatDate(row.started_at)}` : 'Not opened'}</small></div></div>
          {response && <div className={styles.responseBox}><h4>{response.label}</h4><p>{response.text}</p></div>}
          {positionEntries.length > 0 ? <details className={styles.savedDetail}><summary>View additional saved detail</summary><dl>{positionEntries.map(([key, value]) => <div key={key}><dt>{friendlyKey(key)}</dt><dd>{friendlyValue(value)}</dd></div>)}</dl></details> : !response && <p className={styles.noDetail}>{row ? 'This activity has progress data but no additional saved response detail.' : 'The student has not attempted this activity.'}</p>}
        </article>;
      })}</div>
    </section>
  </main>;
}
