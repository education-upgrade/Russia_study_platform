import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { isTrackableActivity, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { aggregateActivityEvidence, normaliseActivityEvidence, type RawActivityResponse } from '@/lib/activityEvidence';
import { recommendIntervention } from '@/lib/interventionEngine';
import { buildAdaptivePathwayBlueprint } from '@/lib/pathwayBlueprintBuilder';
import { buildTeacherAnalyticsDecision } from '@/lib/teacherAnalytics';
import TeacherOverviewTable from '@/components/teacher-dashboard/TeacherOverviewTable';
import TeacherStudentSummary from '@/components/teacher-dashboard/TeacherStudentSummary';
import styles from '@/app/teacher/progress/page.module.css';

const STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const STUDENT_NAME = 'Demo Student';

type Assignment = {
  id: string;
  pathway_slug: string | null;
  lesson_title: string | null;
  mode: string;
  required_activity_types: string[];
  assigned_class: string;
  created_at: string;
  deadline_at: string | null;
};

type Activity = { id: string; activity_type: string; title: string };
type Response = RawActivityResponse & { activity_id: string };

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function statusClass(flag: string) {
  if (flag === 'Submitted') return styles.submitted;
  if (flag.includes('intervention') || flag.includes('needed') || flag.includes('confidence') || flag.includes('Missing')) return styles.intervention;
  return styles.neutral;
}

export default async function TeacherEvidenceDashboard() {
  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><h1>Supabase not configured</h1></header></section></main>;
  }

  const { data: assignment } = await supabase
    .from('guided_study_assignments')
    .select('id, pathway_slug, lesson_title, mode, required_activity_types, assigned_class, created_at, deadline_at')
    .eq('assigned_student_id', STUDENT_ID)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<Assignment>();

  if (!assignment) {
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><div><p className={styles.eyebrow}>Teacher evidence</p><h1>No active assignment</h1></div></header></section></main>;
  }

  const { data: lesson } = await supabase.from('lessons').select('id').eq('title', assignment.lesson_title).limit(1).maybeSingle<{ id: string }>();
  const { data: activities } = lesson?.id ? await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id) : { data: [] };

  const activityRows = (activities ?? []) as Activity[];
  const requiredTypes = orderSupportedActivityTypes(assignment.required_activity_types ?? []);
  const realIds = activityRows.map((activity) => activity.id);

  const { data: responses } = realIds.length
    ? await supabase.from('student_responses').select('activity_id, status, score, response_type, response_json, last_saved_at').eq('student_id', STUDENT_ID).in('activity_id', realIds)
    : { data: [] };

  const responseRows = (responses ?? []) as Response[];

  const evidenceRows = requiredTypes.filter(isTrackableActivity).map((activityType) => {
    const activity = activityRows.find((row) => row.activity_type === activityType);
    const response = activity ? responseRows.find((row) => row.activity_id === activity.id) : undefined;
    const evidence = normaliseActivityEvidence(activityType, response);
    return { activityType, activity, response, evidence };
  });

  const evidence = evidenceRows.map((row) => row.evidence);
  const aggregate = aggregateActivityEvidence(evidence);
  const flags = evidenceRows.filter((row) => row.evidence.interventionFlag !== 'Submitted');
  const recommendation = recommendIntervention(evidence);
  const analyticsDecision = buildTeacherAnalyticsDecision(evidence, recommendation);

  const blueprint = buildAdaptivePathwayBlueprint({
    pathwaySlug: assignment.pathway_slug ?? 'russia-1855',
    lessonTitle: assignment.lesson_title ?? 'Russia in 1855',
    evidence,
    recommendation,
  });

  const route = {
    pathwaySlug: blueprint.pathwaySlug,
    lessonTitle: blueprint.lessonTitle,
    routeMode: blueprint.routeMode,
    requiredActivityTypes: blueprint.requiredActivityTypes,
    instructions: blueprint.teacherInstructions,
  };

  const instructionCopy = `${blueprint.teacherInstructions}\n\nSuccess criteria: ${blueprint.successCriteria.join(' ')}`;
  const feedbackCopy = `${analyticsDecision.headline}. ${analyticsDecision.explanation} Next step: ${analyticsDecision.nextTeachingMove}`;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Progress dashboard</span>
        <Link className={styles.navButton} href="/teacher/set-study">Set study</Link>
        <Link className={styles.navButton} href="/student">Student view</Link>
      </div>

      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Class overview</p>
            <h1>{assignment.assigned_class}</h1>
            <p>{assignment.lesson_title} · {formatMode(assignment.mode)}</p>
          </div>

          <aside className={styles.decisionCard}>
            <strong>{aggregate.completionPercentage}% complete</strong>
            <span>{aggregate.complete}/{aggregate.trackable} activities complete</span>
          </aside>
        </header>

        <section className={styles.snapshot}>
          <article className={styles.metric}><span>Students on track</span><strong>{flags.length === 0 ? 1 : 0}</strong></article>
          <article className={styles.metric}><span>Need intervention</span><strong>{flags.length > 0 ? 1 : 0}</strong></article>
          <article className={styles.metric}><span>Low confidence</span><strong>{aggregate.averageConfidence && aggregate.averageConfidence < 60 ? 1 : 0}</strong></article>
          <article className={styles.metric}><span>Average mastery</span><strong>{aggregate.averageMastery ?? '–'}</strong></article>
        </section>

        <TeacherOverviewTable
          studentName={STUDENT_NAME}
          progress={`${aggregate.complete}/${aggregate.trackable}`}
          mastery={aggregate.averageMastery}
          confidence={aggregate.averageConfidence}
          status={analyticsDecision.status.replaceAll('_', ' ')}
          nextAssignmentTitle={blueprint.title}
          route={route}
          instructionCopy={instructionCopy}
          feedbackCopy={feedbackCopy}
        />

        <TeacherStudentSummary
          studentName={STUDENT_NAME}
          headline={analyticsDecision.headline}
          priorityFocus={analyticsDecision.priorityFocus}
          explanation={analyticsDecision.explanation}
          nextMove={analyticsDecision.nextTeachingMove}
          route={route}
        />

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Priority checks</h2><span className={styles.badge}>{Math.min(flags.length, 3)} shown</span></div>
          <div className={styles.priorityList}>
            {flags.slice(0, 3).map((row) => (
              <article className={styles.priorityItem} key={row.activityType}>
                <div><strong>{row.evidence.label}</strong><small>{row.activity?.title ?? 'Content-driven activity'}</small></div>
                <p>{row.evidence.recommendedAction}</p>
                <span className={`${styles.statusPill} ${statusClass(row.evidence.interventionFlag)}`}>{row.evidence.interventionFlag}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.studentEvidence}>
          <details className={styles.details}>
            <summary>Detailed evidence log</summary>
            <div className={styles.studentList}>
              {evidenceRows.map((row) => (
                <article className={styles.studentCard} key={row.activityType}>
                  <div className={styles.studentTop}>
                    <div><h3>{row.evidence.label}</h3><p>{row.activity?.title ?? 'Content-driven activity'}</p></div>
                    <span className={`${styles.statusPill} ${statusClass(row.evidence.interventionFlag)}`}>{row.evidence.interventionFlag}</span>
                  </div>
                  <div className={styles.diagnosticGrid}>
                    <div className={styles.diagnosticBox}><span>Evidence</span><strong>{row.evidence.evidenceValue}</strong></div>
                    <div className={styles.diagnosticBox}><span>Mastery</span><strong>{row.evidence.masteryScore ?? '–'}</strong></div>
                    <div className={styles.diagnosticBox}><span>Saved</span><strong>{row.evidence.savedAt ? formatDate(row.evidence.savedAt) : 'Not yet'}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </details>
        </section>
      </section>
    </main>
  );
}
