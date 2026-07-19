import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/progress/page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ assignmentId: string; studentId: string }> };
type Assignment = { id: string; title: string; lesson_title: string; mode: string; required_activity_types: string[]; due_at: string | null; teaching_classes: { name: string } | { name: string }[] | null };
type Summary = { status: 'not_started' | 'in_progress' | 'complete'; completed_activity_count: number; total_activity_count: number; progress_percent: number; current_activity_type: string | null; started_at: string | null; completed_at: string | null; last_activity_at: string | null };
type ActivityProgress = { activity_type: string; status: 'not_started' | 'in_progress' | 'complete'; attempt_count: number; score: number | null; max_score: number | null; confidence: number | null; position: Record<string, unknown> | null; started_at: string | null; completed_at: string | null; last_saved_at: string | null };

function firstRelation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatDate(value: string | null) { return value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Not yet'; }
function statusLabel(status?: string) { if (status === 'complete') return 'Complete'; if (status === 'in_progress') return 'In progress'; return 'Not started'; }
function statusStyle(status?: string) { if (status === 'complete') return styles.secure; if (status === 'in_progress') return styles.submitted; return styles.neutral; }
function evidenceSummary(row?: ActivityProgress) {
  if (!row) return 'No evidence saved yet.';
  const parts: string[] = [];
  if (row.score !== null) parts.push(row.max_score ? `Score ${row.score}/${row.max_score}` : `Score ${row.score}`);
  if (row.confidence !== null) parts.push(`Confidence ${row.confidence}/5`);
  if (row.attempt_count > 0) parts.push(`${row.attempt_count} attempt${row.attempt_count === 1 ? '' : 's'}`);
  return parts.length ? parts.join(' · ') : row.status === 'complete' ? 'Completion recorded.' : 'Activity opened; no scored evidence yet.';
}

export default async function StudentEvidencePage({ params }: Props) {
  await requireRoles(['teacher', 'admin']);
  const { assignmentId, studentId } = await params;
  const supabase = await createServerSupabaseClient();
  if (!supabase) notFound();

  const [{ data: assignmentData }, { data: recipient }, { data: profile }, { data: summaryData }, { data: activityData }] = await Promise.all([
    supabase.from('classroom_assignments').select('id, title, lesson_title, mode, required_activity_types, due_at, teaching_classes(name)').eq('id', assignmentId).eq('status', 'published').maybeSingle<Assignment>(),
    supabase.from('assignment_recipients').select('student_id').eq('assignment_id', assignmentId).eq('student_id', studentId).maybeSingle(),
    supabase.from('profiles').select('id, full_name').eq('id', studentId).maybeSingle<{ id: string; full_name: string | null }>(),
    supabase.from('assignment_progress').select('status, completed_activity_count, total_activity_count, progress_percent, current_activity_type, started_at, completed_at, last_activity_at').eq('assignment_id', assignmentId).eq('student_id', studentId).maybeSingle<Summary>(),
    supabase.from('student_activity_progress').select('activity_type, status, attempt_count, score, max_score, confidence, position, started_at, completed_at, last_saved_at').eq('assignment_id', assignmentId).eq('student_id', studentId),
  ]);

  if (!assignmentData || !recipient) notFound();
  const assignment = assignmentData;
  const summary = summaryData ?? null;
  const activityMap = new Map(((activityData ?? []) as ActivityProgress[]).map((row) => [row.activity_type, row]));
  const name = profile?.full_name?.trim() || 'Student';
  const teachingClass = firstRelation(assignment.teaching_classes);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Student evidence</span>
        <Link className={styles.navButton} href={`/teacher/progress?assignment=${assignmentId}`}>Back to class</Link>
        <Link className={styles.navButton} href="/teacher/set-study">Set study</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Individual evidence</p><h1>{name}</h1><p>{teachingClass?.name ?? 'Class'} · {assignment.lesson_title} · Due {formatDate(assignment.due_at)}</p></div>
          <aside className={styles.decisionCard}><strong>{summary?.progress_percent ?? 0}% complete</strong><span>{summary?.completed_activity_count ?? 0}/{summary?.total_activity_count ?? assignment.required_activity_types.length} activities · {statusLabel(summary?.status)}</span></aside>
        </header>

        <section className={styles.snapshot}>
          <article className={styles.metric}><span>Current task</span><strong style={{ fontSize: '1.15rem' }}>{summary?.current_activity_type ? getActivityLabel(summary.current_activity_type) : '—'}</strong></article>
          <article className={styles.metric}><span>Started</span><strong style={{ fontSize: '1.05rem' }}>{formatDate(summary?.started_at ?? null)}</strong></article>
          <article className={styles.metric}><span>Last active</span><strong style={{ fontSize: '1.05rem' }}>{formatDate(summary?.last_activity_at ?? null)}</strong></article>
          <article className={styles.metric}><span>Finished</span><strong style={{ fontSize: '1.05rem' }}>{formatDate(summary?.completed_at ?? null)}</strong></article>
        </section>

        <section className={styles.studentEvidence}>
          <div className={styles.sectionHeader}><h2>Activity evidence</h2><span className={styles.badge}>{assignment.required_activity_types.length} required</span></div>
          <div className={styles.studentList}>
            {assignment.required_activity_types.map((activityType, index) => {
              const row = activityMap.get(activityType);
              const positionEntries = row?.position && Object.keys(row.position).length ? Object.entries(row.position).slice(0, 4) : [];
              return (
                <article className={styles.studentCard} key={activityType}>
                  <div className={styles.studentTop}>
                    <div><h3>{index + 1}. {getActivityLabel(activityType)}</h3><p>{evidenceSummary(row)}</p></div>
                    <span className={`${styles.statusPill} ${statusStyle(row?.status)}`}>{statusLabel(row?.status)}</span>
                  </div>
                  <div className={styles.diagnosticGrid}>
                    <div className={styles.diagnosticBox}><span>Saved</span><strong>{formatDate(row?.last_saved_at ?? null)}</strong></div>
                    <div className={styles.diagnosticBox}><span>Score</span><strong>{row?.score !== null && row?.score !== undefined ? `${row.score}${row.max_score ? `/${row.max_score}` : ''}` : '—'}</strong></div>
                    <div className={styles.diagnosticBox}><span>Confidence</span><strong>{row?.confidence !== null && row?.confidence !== undefined ? `${row.confidence}/5` : '—'}</strong></div>
                  </div>
                  {positionEntries.length > 0 && <details className={styles.details} style={{ marginTop: 10 }}><summary>Saved activity detail</summary><div style={{ marginTop: 8 }}>{positionEntries.map(([key, value]) => <p key={key} style={{ margin: '4px 0' }}><strong>{key.replaceAll('_', ' ')}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>)}</div></details>}
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
