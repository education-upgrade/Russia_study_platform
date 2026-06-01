import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getActivityLabel, isTrackableActivity, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
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
type Response = { activity_id: string; status: string; score: number | null; response_type: string; response_json: any; last_saved_at: string | null };

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function summariseEvidence(activityType: string, response?: Response) {
  if (!response) return { value: 'Missing', detail: 'No saved evidence yet', flag: 'Missing evidence' };
  const json = response.response_json ?? {};

  if (activityType === 'quiz') {
    return { value: `${response.score ?? 0}/${json.maxScore ?? '?'}`, detail: typeof json.percentage === 'number' ? `${json.percentage}% retrieval` : 'Quiz submitted', flag: typeof json.percentage === 'number' && json.percentage < 60 ? 'Intervention' : 'Submitted' };
  }

  if (activityType === 'flashcards') {
    return { value: `${json.ratedCount ?? 0}/${json.totalCards ?? '?'}`, detail: `${json.secureCount ?? 0} secure · ${json.nearlyCount ?? 0} nearly · ${json.revisitCount ?? 0} revisit`, flag: (json.revisitCount ?? 0) > 0 ? 'Revisit needed' : 'Submitted' };
  }

  if (activityType === 'peel_response') {
    return { value: `${json.wordCount ?? 0} words`, detail: json.fullResponse ? String(json.fullResponse).slice(0, 110) : 'Written response submitted', flag: (json.wordCount ?? 0) < 60 ? 'Needs development' : 'Submitted' };
  }

  if (activityType === 'confidence_exit_ticket') {
    const confidence = json.confidence ?? response.score;
    return { value: confidence ? `${confidence}/5` : 'Submitted', detail: json.leastSecureArea || json.needHelpWith || json.reflection || 'Confidence saved', flag: Number(confidence ?? 5) <= 2 ? 'Low confidence' : 'Submitted' };
  }

  if (activityType === 'timeline') {
    return { value: 'Saved', detail: json.chosenEventTitle || json.significanceExplanation || 'Timeline judgement submitted', flag: 'Submitted' };
  }

  if (activityType === 'judgement_ranking') {
    return { value: 'Saved', detail: json.justification || json.topFactor || 'Ranking judgement submitted', flag: 'Submitted' };
  }

  if (activityType === 'ao3_interpretation') {
    return { value: 'Saved', detail: json.evaluation || json.judgement || 'AO3 interpretation response submitted', flag: 'Submitted' };
  }

  return { value: response.status, detail: 'Evidence saved', flag: response.status === 'complete' || response.status === 'submitted' ? 'Submitted' : 'In progress' };
}

function statusClass(flag: string) {
  if (flag === 'Missing evidence' || flag === 'Intervention' || flag === 'Low confidence' || flag === 'Needs development' || flag === 'Revisit needed') return styles.intervention;
  if (flag === 'Submitted') return styles.submitted;
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
    const summary = summariseEvidence(activityType, response);
    return { activityType, activity, response, summary };
  });

  const completed = evidenceRows.filter((row) => row.response && row.summary.flag !== 'Missing evidence').length;
  const missing = evidenceRows.length - completed;
  const flags = evidenceRows.filter((row) => ['Missing evidence', 'Intervention', 'Low confidence', 'Needs development', 'Revisit needed'].includes(row.summary.flag));

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><span>Teacher / Evidence</span><Link className={styles.navButton} href="/teacher/set-study">Set study</Link><Link className={styles.navButton} href="/student">Student view</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Live evidence dashboard</p><h1>{assignment.lesson_title ?? 'Guided study'}</h1><p>{assignment.assigned_class} · {formatMode(assignment.mode)} · Deadline: {formatDate(assignment.deadline_at)}</p></div>
          <aside className={styles.decisionCard}><strong>{completed}/{evidenceRows.length}</strong><span>evidence tasks complete</span></aside>
        </header>
        <section className={styles.snapshot}><article className={styles.metric}><span>Complete</span><strong>{completed}</strong><small>saved evidence rows</small></article><article className={styles.metric}><span>Missing</span><strong>{missing}</strong><small>tasks still to complete</small></article><article className={styles.metric}><span>Flags</span><strong>{flags.length}</strong><small>teacher checks needed</small></article></section>
        <section className={styles.priority}><div className={styles.sectionHeader}><h2>Priority checks</h2><span className={styles.badge}>{flags.length} flagged</span></div><div className={styles.priorityList}>{flags.length ? flags.map((row) => <article className={styles.priorityItem} key={row.activityType}><div><strong>{getActivityLabel(row.activityType)}</strong><small>{row.activity?.title ?? 'Virtual/content activity'}</small></div><p>{row.summary.detail}</p><span className={`${styles.statusPill} ${statusClass(row.summary.flag)}`}>{row.summary.flag}</span></article>) : <article className={styles.priorityItem}><strong>No urgent checks</strong><p>All available evidence is on track.</p><span className={`${styles.statusPill} ${styles.secure}`}>Secure</span></article>}</div></section>
        <section className={styles.studentEvidence}><div className={styles.sectionHeader}><h2>Evidence by activity</h2><span className={styles.badge}>canonical route</span></div><div className={styles.studentList}>{evidenceRows.map((row) => <article className={styles.studentCard} key={row.activityType}><div className={styles.studentTop}><div><h3>{getActivityLabel(row.activityType)}</h3><p>{row.activity?.title ?? 'Content-driven activity'}</p></div><span className={`${styles.statusPill} ${statusClass(row.summary.flag)}`}>{row.summary.flag}</span></div><div className={styles.diagnosticGrid}><div className={styles.diagnosticBox}><span>Evidence</span><strong>{row.summary.value}</strong><small>{row.summary.detail}</small></div><div className={styles.diagnosticBox}><span>Saved</span><strong>{row.response?.last_saved_at ? formatDate(row.response.last_saved_at) : 'Not yet'}</strong><small>{row.response?.response_type ?? 'No response'}</small></div></div></article>)}</div></section>
      </section>
    </main>
  );
}
