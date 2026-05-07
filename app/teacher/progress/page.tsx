import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const DEMO_CLASS_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

type ResponseJson = {
  maxScore?: number;
  percentage?: number;
  fullResponse?: string;
  wordCount?: number;
  confidence?: number;
  leastSecureArea?: string;
  reflection?: string;
  understandBetter?: string;
  needHelpWith?: string;
  totalCards?: number;
  ratedCount?: number;
  secureCount?: number;
  revisitCount?: number;
  securePercentage?: number;
};

type StudentResponseRow = {
  student_id: string;
  activity_id: string;
  status: string;
  score: number | null;
  response_type: string;
  response_json: ResponseJson | null;
};

type ActivityRow = {
  id: string;
  activity_type: string;
  title: string;
};

type GuidedStudyAssignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
  assigned_class: string;
  assigned_student_id?: string | null;
  assigned_student_ids?: string[] | null;
  recipient_count?: number | null;
  status: string;
  created_at: string;
};

type StudentProfile = {
  id: string;
  display_name: string;
  year_group: string | null;
};

type TeacherClass = {
  id: string;
  class_name: string;
  year_group: string;
};

type Membership = {
  student_id: string;
  class_id: string;
};

function orderActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second);
    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex);
  });
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function isComplete(activityType: string, response: StudentResponseRow | undefined) {
  if (activityType === 'lesson_content') return true;
  if (!response) return false;

  if (activityType === 'flashcards') {
    const ratedCount = response.response_json?.ratedCount ?? 0;
    const totalCards = response.response_json?.totalCards ?? Number.POSITIVE_INFINITY;
    return response.status === 'complete' || ratedCount >= totalCards;
  }

  return response.status === 'complete' || response.status === 'submitted';
}

function getRiskFlag(response: StudentResponseRow | undefined, activityType: string) {
  if (!response) return activityType === 'lesson_content' ? 'Support activity' : 'Missing evidence';

  if (activityType === 'peel_response') {
    return (response.response_json?.wordCount ?? 0) < 40 ? 'Needs development' : 'Submitted';
  }

  if (activityType === 'confidence_exit_ticket') {
    const confidence = response.response_json?.confidence ?? response.score ?? 0;
    if (confidence <= 2) return 'Low confidence';
    if (confidence === 3) return 'Check confidence';
    return 'Confident';
  }

  if (activityType === 'flashcards') {
    const totalCards = response.response_json?.totalCards ?? 0;
    const ratedCount = response.response_json?.ratedCount ?? 0;
    const revisitCount = response.response_json?.revisitCount ?? 0;
    const securePercentage = response.response_json?.securePercentage ?? 0;
    if (ratedCount < totalCards) return 'Incomplete';
    if (revisitCount > 0) return 'Revisit needed';
    if (securePercentage >= 80) return 'Secure';
    return 'Check understanding';
  }

  const percentage = response.response_json?.percentage;
  if (typeof percentage === 'number' && percentage < 60) return 'Intervention';
  if (typeof percentage === 'number' && percentage < 80) return 'Check understanding';
  if (typeof percentage === 'number' && percentage >= 80) return 'Secure';
  return 'Submitted';
}

function getRiskClass(risk: string) {
  if (risk === 'Secure' || risk === 'Confident' || risk === 'On track') return styles.secure;
  if (risk === 'Intervention' || risk === 'Needs development' || risk === 'Low confidence' || risk === 'Revisit needed' || risk === 'Missing evidence') return styles.intervention;
  if (risk === 'Check understanding' || risk === 'Check confidence' || risk === 'Incomplete') return styles.check;
  if (risk === 'Submitted') return styles.submitted;
  return styles.neutral;
}

function evidenceText(activityType: string, response: StudentResponseRow | undefined) {
  if (!response) return 'Missing';
  if (activityType === 'quiz') return `${response.score ?? '-'}/${response.response_json?.maxScore ?? '?'}${typeof response.response_json?.percentage === 'number' ? ` · ${response.response_json.percentage}%` : ''}`;
  if (activityType === 'flashcards') return `${response.response_json?.secureCount ?? 0} secure · ${response.response_json?.revisitCount ?? 0} revisit`;
  if (activityType === 'peel_response') return `${response.response_json?.wordCount ?? 0} words`;
  if (activityType === 'confidence_exit_ticket') return `${response.response_json?.confidence ?? response.score ?? '-'}/5`;
  return response.status;
}

function nextAction(flag: string) {
  if (flag === 'Missing evidence') return 'Complete the missing task.';
  if (flag === 'Needs development') return 'Review PEEL explanation and judgement.';
  if (flag === 'Low confidence') return 'Target the least secure area.';
  if (flag === 'Revisit needed') return 'Repeat revisit flashcards.';
  if (flag === 'Intervention') return 'Set recap or reteach weak knowledge.';
  if (flag === 'Check understanding' || flag === 'Check confidence' || flag === 'Incomplete') return 'Quick teacher check.';
  return 'No urgent action.';
}

function buildStudentSummary(student: StudentProfile, requiredTypes: string[], activities: ActivityRow[], responses: StudentResponseRow[]) {
  const studentResponses = responses.filter((response) => response.student_id === student.id);
  const responseFor = (activityType: string) => {
    const activity = activities.find((item) => item.activity_type === activityType);
    return activity ? studentResponses.find((response) => response.activity_id === activity.id) : undefined;
  };

  const evidenceTypes = requiredTypes.filter((type) => type !== 'lesson_content');
  const completeCount = evidenceTypes.filter((type) => isComplete(type, responseFor(type))).length;
  const progress = evidenceTypes.length ? Math.round((completeCount / evidenceTypes.length) * 100) : 0;
  const risks = evidenceTypes.map((type) => getRiskFlag(responseFor(type), type));
  const priorityRisk = risks.find((risk) => ['Intervention', 'Needs development', 'Low confidence', 'Revisit needed', 'Missing evidence', 'Incomplete'].includes(risk)) ?? 'On track';

  return {
    id: student.id,
    name: student.display_name,
    progress,
    completed: completeCount,
    required: evidenceTypes.length,
    quiz: evidenceText('quiz', responseFor('quiz')),
    flashcards: evidenceText('flashcards', responseFor('flashcards')),
    peel: evidenceText('peel_response', responseFor('peel_response')),
    confidence: evidenceText('confidence_exit_ticket', responseFor('confidence_exit_ticket')),
    flag: priorityRisk,
    action: nextAction(priorityRisk),
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage() {
  if (!supabase) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Teacher progress</p>
              <h1>Supabase is not configured</h1>
              <p>Add the Supabase environment variables in Vercel and redeploy.</p>
            </div>
          </header>
        </section>
      </main>
    );
  }

  const { data: classData, error: classError } = await supabase
    .from('teacher_classes')
    .select('id, class_name, year_group')
    .eq('status', 'active')
    .order('year_group', { ascending: true })
    .order('class_name', { ascending: true });

  const classes = ((classData ?? []) as TeacherClass[]);
  const activeClass = classes[0] ?? { id: DEMO_CLASS_ID, class_name: 'Year 12 Russia demo class', year_group: 'Y12' };

  const { data: assignmentData, error: assignmentError } = await supabase
    .from('guided_study_assignments')
    .select('id, mode, required_activity_types, deadline_at, instructions, assigned_class, assigned_student_id, assigned_student_ids, recipient_count, status, created_at')
    .eq('class_id', activeClass.id)
    .eq('status', 'active')
    .eq('pathway_slug', '1905-revolution')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const activeAssignment = assignmentData as GuidedStudyAssignment | null;
  const requiredTypes = orderActivityTypes(activeAssignment?.required_activity_types?.length ? activeAssignment.required_activity_types : PATHWAY_ACTIVITY_ORDER);

  const { data: membershipData, error: membershipError } = await supabase
    .from('class_memberships')
    .select('class_id, student_id')
    .eq('class_id', activeClass.id)
    .eq('status', 'active');

  const memberships = (membershipData ?? []) as Membership[];
  const membershipStudentIds = memberships.map((membership) => membership.student_id);
  const assignmentStudentIds = activeAssignment?.assigned_student_ids ?? [];
  const legacyAssignmentStudentId = activeAssignment?.assigned_student_id ? [activeAssignment.assigned_student_id] : [];
  const studentIds = unique([...assignmentStudentIds, ...legacyAssignmentStudentId, ...membershipStudentIds, DEMO_STUDENT_ID]);

  const { data: profileData, error: profileError } = studentIds.length
    ? await supabase
        .from('app_profiles')
        .select('id, display_name, year_group')
        .in('id', studentIds)
    : { data: [], error: null };

  const profileRows = (profileData ?? []) as StudentProfile[];
  const students = studentIds.map((id, index) => profileRows.find((profile) => profile.id === id) ?? {
    id,
    display_name: id === DEMO_STUDENT_ID ? 'Demo Student' : `Student ${index + 1}`,
    year_group: activeClass.year_group,
  });

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  const { data: activityData } = lesson?.id
    ? await supabase
        .from('activities')
        .select('id, activity_type, title')
        .eq('lesson_id', lesson.id)
    : { data: [] };

  const activities = (activityData ?? []) as ActivityRow[];
  const activityIds = activities.map((activity) => activity.id);

  const { data: responseData, error: responseError } = activityIds.length && studentIds.length
    ? await supabase
        .from('student_responses')
        .select('student_id, activity_id, status, score, response_type, response_json')
        .in('student_id', studentIds)
        .in('activity_id', activityIds)
    : { data: [], error: null };

  const responses = (responseData ?? []) as StudentResponseRow[];
  const summaries = students.map((student) => buildStudentSummary(student, requiredTypes, activities, responses));
  const averageProgress = summaries.length ? Math.round(summaries.reduce((total, student) => total + student.progress, 0) / summaries.length) : 0;
  const flaggedStudents = summaries.filter((student) => student.flag !== 'On track');
  const completedStudents = summaries.filter((student) => student.progress === 100).length;
  const averageQuiz = summaries
    .map((student) => Number((student.quiz.match(/· (\d+)%/) ?? [])[1]))
    .filter((value) => Number.isFinite(value));
  const quizAverage = averageQuiz.length ? Math.round(averageQuiz.reduce((total, value) => total + value, 0) / averageQuiz.length) : null;
  const decision = flaggedStudents.length ? `${flaggedStudents[0].name} needs attention` : 'No urgent action';
  const decisionDetail = flaggedStudents.length ? flaggedStudents[0].action : 'The class is currently on track for the required route.';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Progress / 1905 Revolution / {activeClass.class_name}</span>
        <Link className={styles.navButton} href="/teacher/set-study">Set study</Link>
        <Link className={styles.navButton} href="/student/dashboard">Student view</Link>
      </div>

      {(classError || membershipError || profileError || assignmentError || responseError) && (
        <section className={styles.error}>
          Setup warning: {classError?.message ?? membershipError?.message ?? profileError?.message ?? assignmentError?.message ?? responseError?.message}. Run supabase/multi-class-platform.sql if class data is missing.
        </section>
      )}

      <section className={styles.mainCard}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Teacher class dashboard</p>
            <h1>1905 progress</h1>
            <p>{activeAssignment?.instructions ?? 'Progress is shown against the current 1905 guided study route.'}</p>
          </div>
          <aside className={styles.decisionCard}>
            <p className={styles.eyebrow}>Next action</p>
            <strong>{decision}</strong>
            <span>{decisionDetail}</span>
          </aside>
        </header>

        <section className={styles.snapshot}>
          <article className={styles.metric}>
            <span>Class</span>
            <strong>{students.length}</strong>
            <small>{activeClass.year_group} students</small>
          </article>
          <article className={styles.metric}>
            <span>Complete</span>
            <strong>{completedStudents}/{students.length || 0}</strong>
            <small>students at 100%</small>
          </article>
          <article className={styles.metric}>
            <span>Progress</span>
            <strong>{averageProgress}%</strong>
            <small>{activeAssignment ? formatMode(activeAssignment.mode) : 'default route'}</small>
          </article>
          <article className={styles.metric}>
            <span>Quiz avg</span>
            <strong>{quizAverage ?? '-'}</strong>
            <small>{quizAverage === null ? 'no quiz data' : 'average %'}</small>
          </article>
        </section>

        <section className={styles.priority}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Priority students</p>
              <h2>Who needs attention?</h2>
            </div>
            <span className={styles.badge}>{activeAssignment ? formatDate(activeAssignment.deadline_at) : 'No active deadline'}</span>
          </div>

          {flaggedStudents.length === 0 ? (
            <div className={styles.empty}>
              <h3>No urgent action</h3>
              <p>No students currently have high-priority intervention flags on this route.</p>
            </div>
          ) : (
            <div className={styles.priorityList}>
              {flaggedStudents.slice(0, 5).map((student) => (
                <article className={styles.priorityItem} key={student.id}>
                  <div>
                    <strong>{student.name}</strong>
                    <small>{student.completed}/{student.required} complete</small>
                  </div>
                  <p>{student.action}</p>
                  <span className={`${styles.statusPill} ${getRiskClass(student.flag)}`}>{student.flag}</span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.studentEvidence}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Class overview</p>
              <h2>{activeClass.class_name}</h2>
            </div>
            <span className={styles.badge}>{students.length} students</span>
          </div>

          <article className={styles.studentCard}>
            {summaries.length === 0 ? (
              <div className={styles.empty}>
                <h3>No students found</h3>
                <p>Run supabase/multi-class-platform.sql to add demo classes and memberships.</p>
              </div>
            ) : (
              <div className={styles.priorityList}>
                {summaries.map((student) => (
                  <article className={styles.priorityItem} key={student.id}>
                    <div>
                      <strong>{student.name}</strong>
                      <small>{student.progress}% · {student.completed}/{student.required} complete</small>
                    </div>
                    <p>Quiz: {student.quiz} · Flashcards: {student.flashcards} · PEEL: {student.peel} · Confidence: {student.confidence}</p>
                    <span className={`${styles.statusPill} ${getRiskClass(student.flag)}`}>{student.flag}</span>
                  </article>
                ))}
              </div>
            )}

            <details className={styles.details}>
              <summary>Open assignment detail</summary>
              <div className={styles.detailGrid}>
                <article className={styles.detailPanel}>
                  <h4>Current assignment</h4>
                  <p><strong>Class:</strong> {activeClass.class_name}</p>
                  <p><strong>Mode:</strong> {activeAssignment ? formatMode(activeAssignment.mode) : 'Default route'}</p>
                  <p><strong>Deadline:</strong> {activeAssignment ? formatDate(activeAssignment.deadline_at) : 'No active deadline'}</p>
                  <p><strong>Responses found:</strong> {responses.length}</p>
                </article>
                <article className={styles.detailPanel}>
                  <h4>Required route</h4>
                  {requiredTypes.map((type, index) => (
                    <p key={type}><strong>{index + 1}. {activityLabels[type] ?? type}:</strong> required</p>
                  ))}
                </article>
              </div>
            </details>
          </article>
        </section>
      </section>
    </main>
  );
}
