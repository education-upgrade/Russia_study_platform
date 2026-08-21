import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Assignment = {
  id: string;
  title: string;
  lesson_title: string;
  created_at: string;
  status: string;
  assignment_recipients: { student_id: string; status: string }[] | null;
};
type Progress = { assignment_id: string; status: 'not_started' | 'in_progress' | 'complete'; progress_percent: number; completed_activity_count: number; total_activity_count: number; last_activity_at: string | null };
type Activity = { assignment_id: string; activity_type: string; score: number | null; max_score: number | null; confidence: number | null; attempt_count: number; position: Record<string, unknown> | null };

function relation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function statusFor(progress?: Progress) { if (progress?.status === 'complete') return 'Complete'; if (!progress || progress.status === 'not_started' || progress.progress_percent === 0) return 'Not attempted'; return 'Incomplete'; }
function scorePercent(row: Activity) { return row.score !== null && row.max_score ? Math.round((row.score / row.max_score) * 100) : null; }
function formatDate(value: string | null) { return value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; }

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentInsightPage({ params }: { params: Promise<{ classId: string; studentId: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { classId, studentId } = await params;
  if (!auth || !supabase) notFound();

  const [{ data: teacherLink }, { data: membership }, { data: profile }, { data: assignmentRows }] = await Promise.all([
    supabase.from('class_teachers').select('class_id, teaching_classes(id, name, academic_year)').eq('class_id', classId).eq('teacher_id', auth.userId).maybeSingle(),
    supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('student_id', studentId).maybeSingle(),
    supabase.from('profiles').select('id, full_name').eq('id', studentId).maybeSingle(),
    supabase.from('classroom_assignments').select('id, title, lesson_title, created_at, status, assignment_recipients(student_id, status)').eq('class_id', classId).order('created_at', { ascending: true }),
  ]);
  const teachingClass = relation((teacherLink as any)?.teaching_classes);
  if ((!teachingClass && auth.profile.role !== 'admin') || !membership || !profile) notFound();

  const assignments = ((assignmentRows ?? []) as Assignment[]).filter((assignment) => (assignment.status === 'published' || assignment.status === 'archived') && (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned'));
  const assignmentIds = assignments.map((assignment) => assignment.id);
  const [progressResult, activityResult] = await Promise.all([
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, status, progress_percent, completed_activity_count, total_activity_count, last_activity_at').eq('student_id', studentId).in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, activity_type, score, max_score, confidence, attempt_count, position').eq('student_id', studentId).in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
  ]);

  const progressMap = new Map(((progressResult.data ?? []) as Progress[]).map((row) => [row.assignment_id, row]));
  const activityRows = (activityResult.data ?? []) as Activity[];
  const activitiesByAssignment = new Map<string, Activity[]>();
  activityRows.forEach((row) => { const list = activitiesByAssignment.get(row.assignment_id) ?? []; list.push(row); activitiesByAssignment.set(row.assignment_id, list); });

  const rows = assignments.map((assignment) => {
    const progress = progressMap.get(assignment.id);
    const activities = activitiesByAssignment.get(assignment.id) ?? [];
    const scored = activities.map(scorePercent).filter((value): value is number => value !== null);
    const confidences = activities.map((row) => row.confidence).filter((value): value is number => value !== null);
    return {
      assignment,
      progress,
      status: statusFor(progress),
      quiz: scored.length ? Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length) : null,
      confidence: confidences.length ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length : null,
      attempts: activities.reduce((sum, row) => sum + Math.max(row.attempt_count, 0), 0),
    };
  });

  const completed = rows.filter((row) => row.status === 'Complete').length;
  const completionRate = rows.length ? Math.round((completed / rows.length) * 100) : 0;
  const scoredRows = rows.filter((row) => row.quiz !== null);
  const averageQuiz = scoredRows.length ? Math.round(scoredRows.reduce((sum, row) => sum + (row.quiz ?? 0), 0) / scoredRows.length) : null;
  const confidenceRows = rows.filter((row) => row.confidence !== null);
  const averageConfidence = confidenceRows.length ? confidenceRows.reduce((sum, row) => sum + (row.confidence ?? 0), 0) / confidenceRows.length : null;

  const strengths: string[] = [];
  const development: string[] = [];
  const priorities: string[] = [];
  if (completionRate >= 80) strengths.push(`Strong assignment completion: ${completed} of ${rows.length} assignments complete (${completionRate}%).`);
  if (averageQuiz !== null && averageQuiz >= 70) strengths.push(`Secure scored knowledge overall: average quiz/scored result ${averageQuiz}%.`);
  const highScoring = rows.filter((row) => row.quiz !== null && row.quiz >= 75).slice(-3);
  if (highScoring.length) strengths.push(`Strong recent evidence in: ${highScoring.map((row) => row.assignment.lesson_title).join(', ')}.`);
  const secureConfidence = rows.filter((row) => row.confidence !== null && row.confidence >= 4).slice(-3);
  if (secureConfidence.length) strengths.push(`High confidence reported in: ${secureConfidence.map((row) => row.assignment.lesson_title).join(', ')}.`);
  if (!strengths.length) strengths.push('Evidence is still developing; use the assignment grid below to discuss recent progress and engagement.');

  const outstanding = rows.filter((row) => row.status !== 'Complete');
  if (outstanding.length) development.push(`${outstanding.length} assignment${outstanding.length === 1 ? '' : 's'} currently incomplete or not attempted: ${outstanding.slice(-4).map((row) => row.assignment.lesson_title).join(', ')}.`);
  const lowScoring = rows.filter((row) => row.quiz !== null && row.quiz < 60).slice(-4);
  if (lowScoring.length) development.push(`Lower scored evidence in: ${lowScoring.map((row) => `${row.assignment.lesson_title} (${row.quiz}%)`).join(', ')}.`);
  const lowConfidence = rows.filter((row) => row.confidence !== null && row.confidence <= 2).slice(-4);
  if (lowConfidence.length) development.push(`Low confidence reported in: ${lowConfidence.map((row) => row.assignment.lesson_title).join(', ')}.`);
  if (!development.length) development.push('No major concern is currently indicated by completion, scored evidence or confidence data.');

  if (outstanding.length) priorities.push(`Complete outstanding work, beginning with ${outstanding.at(-1)?.assignment.lesson_title}.`);
  if (lowScoring.length) priorities.push(`Revisit the knowledge and retrieval tasks for ${lowScoring.at(-1)?.assignment.lesson_title}.`);
  if (lowConfidence.length) priorities.push(`Review the lesson material for ${lowConfidence.at(-1)?.assignment.lesson_title} and identify one specific area to ask for help with.`);
  if (!priorities.length) priorities.push('Maintain current completion and retrieval performance, and use written tasks to deepen explanation and evaluation.');

  const name = profile.full_name?.trim() || 'Student';
  const generated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return <main className={styles.report}>
    <div className={styles.screenActions}><Link href={`/teacher/classes/${classId}/students/${studentId}`}>← Back to student history</Link><button type="button" onClick={undefined as never}>Use browser Print / Save as PDF</button></div>
    <header><p className={styles.eyebrow}>Student insight</p><h1>{name}</h1><p>{teachingClass?.name ?? 'Class'} · {teachingClass?.academic_year || 'Academic year'} · generated {generated}</p></header>
    <section className={styles.summary}><article><span>Assignments</span><strong>{rows.length}</strong></article><article><span>Complete</span><strong>{completed}</strong></article><article><span>Completion</span><strong>{completionRate}%</strong></article><article><span>Average scored result</span><strong>{averageQuiz === null ? '—' : `${averageQuiz}%`}</strong></article><article><span>Average confidence</span><strong>{averageConfidence === null ? '—' : `${averageConfidence.toFixed(1)}/5`}</strong></article></section>
    <section className={styles.section}><h2>Assignment summary</h2><div className={styles.tableWrap}><table><thead><tr><th>Assignment</th><th>Status</th><th>Progress</th><th>Score</th><th>Confidence</th><th>Last active</th></tr></thead><tbody>{rows.map((row) => <tr key={row.assignment.id}><td><strong>{row.assignment.lesson_title}</strong><small>{row.assignment.title}</small></td><td>{row.status}</td><td>{row.progress?.progress_percent ?? 0}%</td><td>{row.quiz === null ? '—' : `${row.quiz}%`}</td><td>{row.confidence === null ? '—' : `${row.confidence.toFixed(1)}/5`}</td><td>{formatDate(row.progress?.last_activity_at ?? null)}</td></tr>)}</tbody></table></div></section>
    <section className={styles.insights}><article><h2>Strengths</h2><ul>{strengths.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>Areas to develop</h2><ul>{development.map((item) => <li key={item}>{item}</li>)}</ul></article></section>
    <section className={styles.section}><h2>Suggested priorities</h2><ol>{priorities.map((item) => <li key={item}>{item}</li>)}</ol></section>
    <footer><p>This report is generated from assignment completion, scored activity and confidence evidence recorded in the platform. Private teacher notes are not included.</p></footer>
  </main>;
}
