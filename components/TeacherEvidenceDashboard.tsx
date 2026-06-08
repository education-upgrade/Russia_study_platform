import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { isTrackableActivity, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { aggregateActivityEvidence, normaliseActivityEvidence, type RawActivityResponse } from '@/lib/activityEvidence';
import { recommendIntervention } from '@/lib/interventionEngine';
import { buildAdaptivePathwayBlueprint } from '@/lib/pathwayBlueprintBuilder';
import { buildTeacherAnalyticsDecision } from '@/lib/teacherAnalytics';
import AssignRecommendedRouteButton from '@/components/AssignRecommendedRouteButton';
import styles from '@/app/teacher/progress/page.module.css';

const STUDENT_ID = '22222222-2222-2222-2222-222222222222';

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
  if (flag === 'Missing evidence' || flag.includes('intervention') || flag.includes('development') || flag.includes('needed') || flag.includes('Low confidence') || flag.includes('check')) return styles.intervention;
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
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><div><p className={styles.eyebrow}>Teacher evidence</p><h1>No active assignment</h1><p>Create an assignment first.</p></div><Link className={styles.navButton} href="/teacher/set-study">Set study</Link></header></section></main>;
  }

  const { data: lesson } = await supabase.from('lessons').select('id').eq('title', assignment.lesson_title).limit(1).maybeSingle<{ id: string }>();
  const { data: activities } = lesson?.id ? await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id) : { data: [] };
  const activityRows = (activities ?? []) as Activity[];
  const requiredTypes = orderSupportedActivityTypes(assignment.required_activity_types ?? []);
  const realIds = activityRows.map((activity) => activity.id);
  const { data: responses } = realIds.length ? await supabase.from('student_responses').select('activity_id, status, score, response_type, response_json, last_saved_at').eq('student_id', STUDENT_ID).in('activity_id', realIds) : { data: [] };
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

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><span>Teacher / Evidence</span><Link className={styles.navButton} href="/teacher/set-study">Set study</Link><Link className={styles.navButton} href="/student">Student view</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Live evidence dashboard</p><h1>{assignment.lesson_title ?? 'Guided study'}</h1><p>{assignment.assigned_class} · {formatMode(assignment.mode)} · Deadline: {formatDate(assignment.deadline_at)}</p></div>
          <aside className={styles.decisionCard}><strong>{aggregate.complete}/{aggregate.trackable}</strong><span>{aggregate.completionPercentage}% complete · mastery {aggregate.averageMastery ?? 'n/a'}</span></aside>
        </header>

        <section className={styles.snapshot}><article className={styles.metric}><span>Complete</span><strong>{aggregate.complete}</strong><small>saved evidence rows</small></article><article className={styles.metric}><span>Missing</span><strong>{aggregate.missing}</strong><small>tasks still to complete</small></article><article className={styles.metric}><span>Flags</span><strong>{flags.length}</strong><small>teacher checks needed</small></article><article className={styles.metric}><span>Mastery</span><strong>{aggregate.averageMastery ?? '–'}</strong><small>average evidence score</small></article><article className={styles.metric}><span>Confidence</span><strong>{aggregate.averageConfidence ?? '–'}</strong><small>average confidence score</small></article></section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Teacher decision layer</h2><span className={styles.badge}>{analyticsDecision.status.replaceAll('_', ' ')}</span></div>
          <div className={styles.priorityList}>
            <article className={styles.priorityItem}>
              <div><strong>{analyticsDecision.headline}</strong><small>{analyticsDecision.priorityFocus}</small></div>
              <p>{analyticsDecision.explanation}</p>
              <p><strong>Next move:</strong> {analyticsDecision.nextTeachingMove}</p>
              <p><strong>Suggested Do Now:</strong> {analyticsDecision.suggestedDoNow}</p>
              <div className={styles.diagnosticGrid}>
                {analyticsDecision.reviewQuestions.map((question) => (
                  <div key={question} className={styles.diagnosticBox}>
                    <span>Review question</span>
                    <strong>{question}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Adaptive route blueprint</h2><span className={styles.badge}>{blueprint.scaffoldLevel}</span></div>
          <div className={styles.priorityList}>
            <article className={styles.priorityItem}>
              <div><strong>{blueprint.title}</strong><small>{blueprint.requiredActivityTypes.join(' → ')}</small></div>
              <p>{blueprint.rationale}</p>
              <p>{blueprint.teacherInstructions}</p>
              <p>{blueprint.successCriteria.join(' ')}</p>
              <span className={`${styles.statusPill} ${styles.intervention}`}>{blueprint.routeMode.replaceAll('_', ' ')}</span>
              <AssignRecommendedRouteButton
                pathwaySlug={blueprint.pathwaySlug}
                lessonTitle={blueprint.lessonTitle}
                routeMode={blueprint.routeMode}
                requiredActivityTypes={blueprint.requiredActivityTypes}
                instructions={blueprint.teacherInstructions}
              />
            </article>
          </div>
        </section>

        <section className={styles.priority}><div className={styles.sectionHeader}><h2>Priority checks</h2><span className={styles.badge}>{flags.length} flagged</span></div><div className={styles.priorityList}>{flags.length ? flags.map((row) => <article className={styles.priorityItem} key={row.activityType}><div><strong>{row.evidence.label}</strong><small>{row.activity?.title ?? 'Content-driven activity'}</small></div><p>{row.evidence.recommendedAction}</p><span className={`${styles.statusPill} ${statusClass(row.evidence.interventionFlag)}`}>{row.evidence.interventionFlag}</span></article>) : <article className={styles.priorityItem}><strong>No urgent checks</strong><p>All available evidence is on track.</p><span className={`${styles.statusPill} ${styles.secure}`}>Secure</span></article>}</div></section>

        <section className={styles.studentEvidence}><div className={styles.sectionHeader}><h2>Evidence by activity</h2><span className={styles.badge}>normalised evidence</span></div><div className={styles.studentList}>{evidenceRows.map((row) => <article className={styles.studentCard} key={row.activityType}><div className={styles.studentTop}><div><h3>{row.evidence.label}</h3><p>{row.activity?.title ?? 'Content-driven activity'}</p></div><span className={`${styles.statusPill} ${statusClass(row.evidence.interventionFlag)}`}>{row.evidence.interventionFlag}</span></div><div className={styles.diagnosticGrid}><div className={styles.diagnosticBox}><span>Evidence</span><strong>{row.evidence.evidenceValue}</strong><small>{row.evidence.evidenceSummary}</small></div><div className={styles.diagnosticBox}><span>Mastery</span><strong>{row.evidence.masteryScore ?? '–'}</strong><small>{row.evidence.masteryStatus}</small></div><div className={styles.diagnosticBox}><span>Saved</span><strong>{row.evidence.savedAt ? formatDate(row.evidence.savedAt) : 'Not yet'}</strong><small>{row.response?.response_type ?? 'No response'}</small></div></div></article>)}</div></section>
      </section>
    </main>
  );
}
