import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { tryGetActivePathwayConfig } from '@/lib/activeSubjectRuntime';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Assignment = {
  id: string;
  title: string;
  lesson_title: string;
  pathway_slug: string;
  required_activity_types: string[];
  due_at: string | null;
  instructions: string | null;
  teaching_classes: { name: string } | { name: string }[] | null;
};

type Recipient = {
  assignment_id: string;
  classroom_assignments: Assignment | Assignment[] | null;
};

type AssignmentProgress = {
  status: 'not_started' | 'in_progress' | 'complete';
  progress_percent: number;
  completed_activity_count: number;
  total_activity_count: number;
  current_activity_type: string | null;
};

type ActivityProgress = {
  activity_type: string;
  status: 'not_started' | 'in_progress' | 'complete';
  attempt_count: number;
  score: number | null;
  max_score: number | null;
  confidence: number | null;
  position: Record<string, unknown> | null;
};

type WrittenEntry = { label: string; value: string };

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  flashcards: 'Flashcards',
  quiz: 'Knowledge quiz',
  peel_response: 'Written response',
  ao3_interpretation: 'AO3 interpretation',
  judgement_ranking: 'Judgement task',
  timeline: 'Timeline task',
  confidence_exit_ticket: 'Confidence check',
  card_sort: 'Card sort',
};

const writtenFields: Array<[string, string]> = [
  ['fullResponse', 'Written response'],
  ['writtenResponse', 'Written response'],
  ['lessonSummary', 'Lesson summary'],
  ['reflection', 'Reflection'],
  ['significanceExplanation', 'Significance explanation'],
  ['evaluation', 'Evaluation'],
  ['support', 'Support'],
  ['challenge', 'Challenge'],
  ['judgement', 'Judgement'],
  ['overallJudgement', 'Overall judgement'],
  ['justification', 'Justification'],
  ['understand_better', 'What I understand better'],
  ['need_help_with', 'What I still need help with'],
];

function activityLabel(value: string) {
  return activityLabels[value] ?? value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function deadline(value: string | null) {
  return value
    ? formatSchoolDateTime(value, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'No deadline';
}

function writtenEntries(position: Record<string, unknown> | null): WrittenEntry[] {
  if (!position) return [];
  const entries: WrittenEntry[] = [];
  const seen = new Set<string>();

  for (const [key, label] of writtenFields) {
    const raw = position[key];
    if (typeof raw !== 'string' || !raw.trim()) continue;
    const value = raw.trim();
    if (seen.has(value)) continue;
    seen.add(value);
    entries.push({ label, value });
  }

  return entries;
}

function percentage(row: ActivityProgress) {
  const fromPosition = row.position?.percentage;
  if (typeof fromPosition === 'number') return Math.round(fromPosition);
  if (typeof row.score === 'number' && typeof row.max_score === 'number' && row.max_score > 0) {
    return Math.round((row.score / row.max_score) * 100);
  }
  return null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentAssignmentPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const auth = await getAuthenticatedProfile();
  if (!auth) redirect('/account');
  if (auth.profile.role !== 'student') redirect('/student/dashboard');

  const { assignmentId } = await params;
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  await supabase.rpc('sync_my_assignment_recipients');

  const [{ data: recipientData }, { data: progressData }, { data: activityData }] = await Promise.all([
    supabase
      .from('assignment_recipients')
      .select('assignment_id, classroom_assignments(id,title,lesson_title,pathway_slug,required_activity_types,due_at,instructions,teaching_classes(name))')
      .eq('student_id', auth.userId)
      .eq('assignment_id', assignmentId)
      .eq('status', 'assigned')
      .maybeSingle(),
    supabase
      .from('assignment_progress')
      .select('status,progress_percent,completed_activity_count,total_activity_count,current_activity_type')
      .eq('student_id', auth.userId)
      .eq('assignment_id', assignmentId)
      .maybeSingle(),
    supabase
      .from('student_activity_progress')
      .select('activity_type,status,attempt_count,score,max_score,confidence,position')
      .eq('student_id', auth.userId)
      .eq('assignment_id', assignmentId),
  ]);

  const recipient = recipientData as Recipient | null;
  const assignment = Array.isArray(recipient?.classroom_assignments)
    ? recipient?.classroom_assignments[0]
    : recipient?.classroom_assignments;
  if (!assignment) notFound();

  const pathway = tryGetActivePathwayConfig(assignment.pathway_slug);
  if (!pathway) notFound();

  const progress = progressData as AssignmentProgress | null;
  const rows = (activityData ?? []) as ActivityProgress[];
  const activityMap = new Map(rows.map((row) => [row.activity_type, row]));
  const teachingClass = Array.isArray(assignment.teaching_classes)
    ? assignment.teaching_classes[0]
    : assignment.teaching_classes;
  const launchHref = `${pathway.routeBase}?assignment=${assignment.id}`;
  const recordedCount = assignment.required_activity_types.filter((type) => activityMap.get(type)?.status === 'complete').length;

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/student/work">← Back to assignments</Link>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Assignment</p>
          <h1>{assignment.title}</h1>
          <p>{teachingClass?.name ?? 'Your class'} · {assignment.lesson_title}</p>
          <p className={styles.meta}>{deadline(assignment.due_at)}</p>
          {assignment.instructions && <p className={styles.instructions}>{assignment.instructions}</p>}
        </div>
        <div className={styles.progressBox}>
          <strong>{progress?.progress_percent ?? 0}%</strong>
          <span>{progress?.status === 'complete' ? 'Complete' : progress?.progress_percent ? 'In progress' : 'Not started'}</span>
          <Link className={styles.launch} href={launchHref}>{progress?.status === 'complete' ? 'Review / try again' : progress?.progress_percent ? 'Continue assignment' : 'Start assignment'}</Link>
        </div>
      </header>

      <section className={styles.recordedSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Recorded work</p>
            <h2>What has been saved for this assignment</h2>
            <p>These are your latest submitted results. You can try activities again; a new submission replaces the recorded result shown here.</p>
          </div>
          <span>{recordedCount}/{assignment.required_activity_types.length} recorded</span>
        </div>

        <div className={styles.recordList}>
          {assignment.required_activity_types.map((activityType) => {
            const row = activityMap.get(activityType);
            const isRecorded = row?.status === 'complete';
            const writing = row ? writtenEntries(row.position) : [];
            const quizPercentage = row && activityType === 'quiz' ? percentage(row) : null;
            const leastSecure = typeof row?.position?.least_secure_area === 'string' ? row.position.least_secure_area : null;

            return (
              <article className={styles.recordCard} key={activityType}>
                <div className={styles.recordHeader}>
                  <div>
                    <span className={`${styles.badge} ${isRecorded ? styles.recorded : ''}`}>{isRecorded ? 'Recorded' : 'Not yet submitted'}</span>
                    <h3>{activityLabel(activityType)}</h3>
                  </div>
                  {row && row.attempt_count > 1 && <span className={styles.attempts}>{row.attempt_count} attempts</span>}
                </div>

                {!isRecorded && <p className={styles.emptyText}>Nothing has been recorded for this activity yet.</p>}

                {isRecorded && activityType === 'quiz' && row && (
                  <div className={styles.scoreRow}>
                    <div><span>Score</span><strong>{row.score ?? 0}/{row.max_score ?? '—'}</strong></div>
                    {quizPercentage !== null && <div><span>Percentage</span><strong>{quizPercentage}%</strong></div>}
                  </div>
                )}

                {isRecorded && activityType === 'confidence_exit_ticket' && row && (
                  <div className={styles.confidenceBlock}>
                    <div className={styles.confidenceScore}><span>Confidence</span><strong>{row.confidence ?? '—'}/5</strong></div>
                    {leastSecure && <p><strong>Least secure area:</strong> {leastSecure}</p>}
                  </div>
                )}

                {isRecorded && writing.length > 0 && (
                  <div className={styles.writingList}>
                    {writing.map((entry) => <div className={styles.writing} key={`${activityType}-${entry.label}`}><span>{entry.label}</span><p>{entry.value}</p></div>)}
                  </div>
                )}

                {isRecorded && writing.length === 0 && activityType !== 'quiz' && activityType !== 'confidence_exit_ticket' && (
                  <p className={styles.emptyText}>Completion has been recorded for this activity.</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.updateNote}>
        <div><strong>Want to improve something?</strong><p>Open the assignment and complete the activity again. Your current recorded work stays in place while you work, then updates when you submit the new attempt.</p></div>
        <Link className={styles.launch} href={launchHref}>Open assignment</Link>
      </section>
    </main>
  );
}
