import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { isTrackableActivity, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { aggregateActivityEvidence, normaliseActivityEvidence, type ActivityEvidence, type RawActivityResponse } from '@/lib/activityEvidence';
import { recommendIntervention } from '@/lib/interventionEngine';
import styles from '@/app/teacher/progress/page.module.css';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

type Assignment = {
  id: string;
  pathway_slug: string | null;
  lesson_title: string | null;
  mode: string;
  required_activity_types: string[];
  assigned_class: string | null;
  assigned_student_id: string | null;
  assigned_student_ids?: string[] | null;
  recipient_count?: number | null;
  deadline_at: string | null;
  created_at: string;
};

type UserRow = { id: string; name: string; email: string };
type ActivityRow = { id: string; lesson_id: string | null; activity_type: string; title: string };
type LessonRow = { id: string; title: string };
type ResponseRow = RawActivityResponse & { student_id: string; activity_id: string };

type StudentAnalytics = {
  id: string;
  name: string;
  assignment: Assignment;
  evidence: ActivityEvidence[];
  complete: number;
  required: number;
  completionPercentage: number;
  averageMastery: number | null;
  averageConfidence: number | null;
  recommendationTitle: string;
  recommendationMode: string;
  flags: string[];
};

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : null;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function getAssignmentStudentIds(assignment: Assignment) {
  const ids = assignment.assigned_student_ids?.length ? assignment.assigned_student_ids : [];
  if (assignment.assigned_student_id) ids.push(assignment.assigned_student_id);
  return unique(ids.length ? ids : [DEMO_STUDENT_ID]);
}

function getStatusClass(flag: string) {
  if (flag === 'Submitted') return styles.submitted;
  if (flag === 'Secure progression') return styles.secure;
  return styles.intervention;
}

export default async function TeacherCohortAnalyticsDashboard() {
  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><h1>Supabase not configured</h1></header></section></main>;
  }

  const { data: assignmentsData } = await supabase
    .from('guided_study_assignments')
    .select('id, pathway_slug, lesson_title, mode, required_activity_types, assigned_class, assigned_student_id, assigned_student_ids, recipient_count, deadline_at, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(30);

  const assignments = (assignmentsData ?? []) as Assignment[];

  if (!assignments.length) {
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><div><p className={styles.eyebrow}>Teacher analytics</p><h1>No active assignments</h1><p>Create a guided study assignment first.</p></div><Link className={styles.navButton} href="/teacher/set-study">Set study</Link></header></section></main>;
  }

  const studentIds = unique(assignments.flatMap(getAssignmentStudentIds));
  const lessonTitles = unique(assignments.map((assignment) => assignment.lesson_title).filter((title): title is string => Boolean(title)));

  const { data: usersData } = studentIds.length ? await supabase.from('users').select('id, name, email').in('id', studentIds) : { data: [] };
  const users = (usersData ?? []) as UserRow[];

  const { data: lessonsData } = lessonTitles.length ? await supabase.from('lessons').select('id, title').in('title', lessonTitles) : { data: [] };
  const lessons = (lessonsData ?? []) as LessonRow[];
  const lessonIds = lessons.map((lesson) => lesson.id);

  const { data: activitiesData } = lessonIds.length ? await supabase.from('activities').select('id, lesson_id, activity_type, title').in('lesson_id', lessonIds) : { data: [] };
  const activities = (activitiesData ?? []) as ActivityRow[];
  const activityIds = activities.map((activity) => activity.id);

  const { data: responsesData } = activityIds.length && studentIds.length
    ? await supabase.from('student_responses').select('student_id, activity_id, status, score, response_type, response_json, last_saved_at').in('activity_id', activityIds).in('student_id', studentIds)
    : { data: [] };
  const responses = (responsesData ?? []) as ResponseRow[];

  const analytics: StudentAnalytics[] = assignments.flatMap((assignment) => {
    const assignmentStudentIds = getAssignmentStudentIds(assignment);
    const lesson = lessons.find((item) => item.title === assignment.lesson_title);
    const lessonActivities = activities.filter((activity) => activity.lesson_id === lesson?.id);
    const requiredTypes = orderSupportedActivityTypes(assignment.required_activity_types ?? []).filter(isTrackableActivity);

    return assignmentStudentIds.map((studentId) => {
      const user = users.find((item) => item.id === studentId);
      const evidence = requiredTypes.map((activityType) => {
        const activity = lessonActivities.find((item) => item.activity_type === activityType);
        const response = activity ? responses.find((item) => item.student_id === studentId && item.activity_id === activity.id) : undefined;
        return normaliseActivityEvidence(activityType, response);
      });
      const aggregate = aggregateActivityEvidence(evidence);
      const recommendation = recommendIntervention(evidence);
      return {
        id: studentId,
        name: user?.name ?? (studentId === DEMO_STUDENT_ID ? 'Demo Student' : 'Student'),
        assignment,
        evidence,
        complete: aggregate.complete,
        required: aggregate.trackable,
        completionPercentage: aggregate.completionPercentage,
        averageMastery: aggregate.averageMastery,
        averageConfidence: aggregate.averageConfidence,
        recommendationTitle: recommendation.title,
        recommendationMode: recommendation.routeMode,
        flags: aggregate.flags.map((flag) => flag.interventionFlag),
      };
    });
  });

  const cohortCompletion = average(analytics.map((item) => item.completionPercentage)) ?? 0;
  const cohortMastery = average(analytics.map((item) => item.averageMastery).filter((value): value is number => typeof value === 'number'));
  const cohortConfidence = analytics.map((item) => item.averageConfidence).filter((value): value is number => typeof value === 'number');
  const confidenceAverage = cohortConfidence.length ? Math.round((cohortConfidence.reduce((total, value) => total + value, 0) / cohortConfidence.length) * 10) / 10 : null;
  const studentsWithFlags = analytics.filter((item) => item.flags.length > 0);

  const activityWeaknesses = orderSupportedActivityTypes(unique(analytics.flatMap((item) => item.evidence.map((evidence) => evidence.activityType))))
    .map((activityType) => {
      const matching = analytics.flatMap((item) => item.evidence).filter((evidence) => evidence.activityType === activityType);
      const flagged = matching.filter((evidence) => evidence.interventionFlag !== 'Submitted');
      const masteryScores = matching.map((evidence) => evidence.masteryScore).filter((value): value is number => typeof value === 'number');
      return {
        activityType,
        label: matching[0]?.label ?? activityType,
        flaggedCount: flagged.length,
        averageMastery: average(masteryScores),
      };
    })
    .sort((a, b) => b.flaggedCount - a.flaggedCount || (a.averageMastery ?? 999) - (b.averageMastery ?? 999));

  const interventionGroups = unique(analytics.map((item) => item.recommendationTitle)).map((title) => ({
    title,
    students: analytics.filter((item) => item.recommendationTitle === title),
  }));

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><span>Teacher / Cohort analytics</span><Link className={styles.navButton} href="/teacher/progress">Evidence view</Link><Link className={styles.navButton} href="/teacher/set-study">Set study</Link></div>
      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Class intelligence</p><h1>Russia guided study analytics</h1><p>Live cohort overview across active guided-study assignments.</p></div>
          <aside className={styles.decisionCard}><strong>{analytics.length}</strong><span>student-assignment profiles analysed</span></aside>
        </header>

        <section className={styles.snapshot}>
          <article className={styles.metric}><span>Completion</span><strong>{cohortCompletion}%</strong><small>average route completion</small></article>
          <article className={styles.metric}><span>Mastery</span><strong>{cohortMastery ?? '–'}</strong><small>average evidence score</small></article>
          <article className={styles.metric}><span>Confidence</span><strong>{confidenceAverage ?? '–'}</strong><small>average confidence score</small></article>
          <article className={styles.metric}><span>Flagged</span><strong>{studentsWithFlags.length}</strong><small>profiles needing checks</small></article>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Weakest activity types</h2><span className={styles.badge}>{activityWeaknesses.length} tracked</span></div>
          <div className={styles.priorityList}>{activityWeaknesses.map((item) => <article className={styles.priorityItem} key={item.activityType}><div><strong>{item.label}</strong><small>average mastery {item.averageMastery ?? '–'}</small></div><p>{item.flaggedCount} profile{item.flaggedCount === 1 ? '' : 's'} flagged for this activity type.</p><span className={`${styles.statusPill} ${item.flaggedCount ? styles.intervention : styles.secure}`}>{item.flaggedCount ? 'Intervention' : 'Secure'}</span></article>)}</div>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}><h2>Intervention groups</h2><span className={styles.badge}>{interventionGroups.length} groups</span></div>
          <div className={styles.priorityList}>{interventionGroups.map((group) => <article className={styles.priorityItem} key={group.title}><div><strong>{group.title}</strong><small>{group.students.map((student) => student.name).join(', ')}</small></div><p>{group.students.length} student profile{group.students.length === 1 ? '' : 's'} should receive this route.</p><span className={`${styles.statusPill} ${getStatusClass(group.title === 'Stretch exam-practice route' ? 'Secure progression' : 'Intervention')}`}>{group.title === 'Stretch exam-practice route' ? 'Stretch' : 'Assign group'}</span></article>)}</div>
        </section>

        <section className={styles.studentEvidence}>
          <div className={styles.sectionHeader}><h2>Student profiles</h2><span className={styles.badge}>live analytics</span></div>
          <div className={styles.studentList}>{analytics.map((student) => <article className={styles.studentCard} key={`${student.id}-${student.assignment.id}`}><div className={styles.studentTop}><div><h3>{student.name}</h3><p>{student.assignment.lesson_title} · {student.assignment.assigned_class ?? 'class'} · deadline {formatDate(student.assignment.deadline_at)}</p></div><span className={`${styles.statusPill} ${student.flags.length ? styles.intervention : styles.secure}`}>{student.flags.length ? `${student.flags.length} flag${student.flags.length === 1 ? '' : 's'}` : 'On track'}</span></div><div className={styles.diagnosticGrid}><div className={styles.diagnosticBox}><span>Completion</span><strong>{student.complete}/{student.required}</strong><small>{student.completionPercentage}% complete</small></div><div className={styles.diagnosticBox}><span>Mastery</span><strong>{student.averageMastery ?? '–'}</strong><small>normalised score</small></div><div className={styles.diagnosticBox}><span>Confidence</span><strong>{student.averageConfidence ?? '–'}</strong><small>average confidence</small></div><div className={styles.diagnosticBox}><span>Next route</span><strong>{student.recommendationMode.replaceAll('_', ' ')}</strong><small>{student.recommendationTitle}</small></div></div></article>)}</div>
        </section>
      </section>
    </main>
  );
}
