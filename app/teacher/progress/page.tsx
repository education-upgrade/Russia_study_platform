import Link from 'next/link';
import CopyCommentButton from '@/components/CopyCommentButton';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const DEMO_CLASS_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';
const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const DEMO_CLASSES = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', class_name: 'Year 12 Russia demo class', year_group: 'Y12' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', class_name: 'Year 13 Russia demo class', year_group: 'Y13' },
];

const activityLabels: Record<string, string> = {
  lesson_content: 'Lesson notes',
  quiz: 'Retrieval quiz',
  flashcards: 'Flashcards',
  peel_response: 'PEEL response',
  confidence_exit_ticket: 'Confidence check',
};

const filterLabels: Record<string, string> = {
  all: 'All students',
  missing: 'Missing work',
  quiz: 'Quiz support',
  flashcards: 'Flashcards revisit',
  peel: 'PEEL development',
  confidence: 'Low confidence',
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
  nearlyCount?: number;
  revisitCount?: number;
  completionPercentage?: number;
  securePercentage?: number;
};

type StudentResponseRow = { student_id: string; activity_id: string; status: string; score: number | null; response_type: string; response_json: ResponseJson | null; };
type ActivityRow = { id: string; activity_type: string; title: string; };
type GuidedStudyAssignment = { id: string; mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null; assigned_class: string; assigned_student_id?: string | null; assigned_student_ids?: string[] | null; recipient_count?: number | null; status: string; created_at: string; };
type StudentProfile = { id: string; display_name: string; year_group: string | null; };
type TeacherClass = { id: string; class_name: string; year_group: string; };
type Membership = { student_id: string; class_id: string; };
type SearchParams = { classId?: string; filter?: string; };

function mergeClasses(classData: TeacherClass[]) {
  const classMap = new Map<string, TeacherClass>();
  [...DEMO_CLASSES, ...classData].forEach((classItem) => classMap.set(classItem.id, classItem));
  return Array.from(classMap.values()).sort((first, second) => {
    if (first.year_group !== second.year_group) return first.year_group.localeCompare(second.year_group);
    return first.class_name.localeCompare(second.class_name);
  });
}

function orderActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second);
    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex);
  });
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function formatMode(mode: string) { return mode.replaceAll('_', ' '); }
function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }
function buildProgressUrl(classId: string, filter = 'all') {
  const params = new URLSearchParams();
  params.set('classId', classId);
  if (filter !== 'all') params.set('filter', filter);
  return `/teacher/progress?${params.toString()}`;
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
    const wordCount = response.response_json?.wordCount ?? 0;
    if (wordCount < 40) return 'Needs development';
    if (wordCount < 80) return 'Check PEEL depth';
    return 'Submitted';
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
    const nearlyCount = response.response_json?.nearlyCount ?? 0;
    const securePercentage = response.response_json?.securePercentage ?? 0;
    if (ratedCount < totalCards) return 'Incomplete';
    if (revisitCount > 0) return 'Revisit needed';
    if (nearlyCount >= 4) return 'Consolidate';
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
  if (['Intervention', 'Needs development', 'Low confidence', 'Revisit needed', 'Missing evidence'].includes(risk)) return styles.intervention;
  if (['Check understanding', 'Check confidence', 'Incomplete', 'Check PEEL depth', 'Consolidate'].includes(risk)) return styles.check;
  if (risk === 'Submitted') return styles.submitted;
  return styles.neutral;
}

function quizEvidence(response: StudentResponseRow | undefined) {
  const score = response?.score ?? null;
  const max = response?.response_json?.maxScore ?? null;
  const percentage = response?.response_json?.percentage ?? null;
  return { value: score === null ? 'Missing' : `${score}/${max ?? '?'}`, detail: typeof percentage === 'number' ? `${percentage}% retrieval` : 'no quiz evidence yet', percentage };
}
function flashcardEvidence(response: StudentResponseRow | undefined) {
  const total = response?.response_json?.totalCards ?? null;
  const rated = response?.response_json?.ratedCount ?? 0;
  const secure = response?.response_json?.secureCount ?? 0;
  const nearly = response?.response_json?.nearlyCount ?? 0;
  const revisit = response?.response_json?.revisitCount ?? 0;
  return { value: total ? `${rated}/${total}` : 'Missing', detail: total ? `${secure} secure · ${nearly} nearly · ${revisit} revisit` : 'no flashcard evidence yet', secure, nearly, revisit, rated, total: total ?? 0 };
}
function peelEvidence(response: StudentResponseRow | undefined) {
  const words = response?.response_json?.wordCount ?? 0;
  return { value: response ? `${words} words` : 'Missing', detail: words >= 80 ? 'developed written evidence' : words >= 40 ? 'submitted but check depth' : 'needs fuller PEEL response', words };
}
function confidenceEvidence(response: StudentResponseRow | undefined) {
  const confidence = response?.response_json?.confidence ?? response?.score ?? null;
  const area = response?.response_json?.leastSecureArea ?? response?.response_json?.needHelpWith ?? '';
  return { value: confidence === null ? 'Missing' : `${confidence}/5`, detail: area ? `least secure: ${area}` : confidence === null ? 'no confidence check yet' : 'confidence submitted', confidence, area };
}

function evidenceText(activityType: string, response: StudentResponseRow | undefined) {
  if (activityType === 'quiz') {
    const quiz = quizEvidence(response);
    return `${quiz.value}${quiz.percentage !== null ? ` · ${quiz.percentage}%` : ''}`;
  }
  if (activityType === 'flashcards') {
    const flashcards = flashcardEvidence(response);
    return flashcards.total ? `${flashcards.secure} secure · ${flashcards.nearly} nearly · ${flashcards.revisit} revisit` : 'Missing';
  }
  if (activityType === 'peel_response') return peelEvidence(response).value;
  if (activityType === 'confidence_exit_ticket') return confidenceEvidence(response).value;
  return response?.status ?? 'Missing';
}

function nextAction(flag: string) {
  if (flag === 'Missing evidence') return 'Complete the missing task.';
  if (flag === 'Needs development') return 'Review PEEL explanation and judgement.';
  if (flag === 'Check PEEL depth') return 'Check whether the explanation links back to authority.';
  if (flag === 'Low confidence') return 'Target the least secure area.';
  if (flag === 'Revisit needed') return 'Repeat revisit flashcards.';
  if (flag === 'Consolidate') return 'Use nearly-secure flashcards for quick recap.';
  if (flag === 'Intervention') return 'Set recap or reteach weak knowledge.';
  if (flag === 'Check understanding' || flag === 'Check confidence' || flag === 'Incomplete') return 'Quick teacher check.';
  return 'No urgent action.';
}

function buildTeacherComment(student: {
  name: string; progress: number; completed: number; required: number; quizPercentage: number | null; flashcardsSecure: number; flashcardsNearly: number; flashcardsRevisit: number; peelWords: number; confidence: string; confidenceArea: string; flag: string; action: string;
}) {
  const quizText = student.quizPercentage === null ? 'There is not yet any quiz evidence recorded' : `The retrieval quiz score is ${student.quizPercentage}%`;
  const confidenceText = student.confidence === 'Missing' ? 'The confidence check has not yet been completed' : `The confidence check is ${student.confidence}${student.confidenceArea ? `, with ${student.confidenceArea} identified as the least secure area` : ''}`;
  const strengths: string[] = [];
  const targets: string[] = [];

  if ((student.quizPercentage ?? 0) >= 80) strengths.push('secure factual recall in the quiz');
  if (student.flashcardsSecure > 0) strengths.push(`${student.flashcardsSecure} flashcard${student.flashcardsSecure === 1 ? '' : 's'} rated secure`);
  if (student.peelWords >= 80) strengths.push('a developed PEEL response');
  if (student.peelWords > 0 && student.peelWords < 80) targets.push('develop the PEEL response with fuller evidence and explanation');
  if (student.flashcardsRevisit > 0 || student.flashcardsNearly >= 4) targets.push('revisit the least secure flashcards');
  if (student.quizPercentage !== null && student.quizPercentage < 80) targets.push('repair weaker retrieval knowledge');
  if (student.confidence !== 'Missing' && Number.parseInt(student.confidence, 10) <= 3) targets.push('use the confidence check to target the least secure area');
  if (student.completed < student.required) targets.push('complete the remaining required activities');

  const strengthSentence = strengths.length ? `Strengths shown: ${strengths.join(', ')}.` : 'There is limited secure evidence recorded so far.';
  const targetSentence = targets.length ? `Next step: ${targets.join('; ')}.` : `Next step: ${student.action}`;

  return `${student.name} has completed ${student.completed}/${student.required} required activities (${student.progress}%) on the 1905 Revolution guided study pathway. ${quizText}. Flashcards show ${student.flashcardsSecure} secure, ${student.flashcardsNearly} nearly secure and ${student.flashcardsRevisit} revisit. The PEEL response is currently ${student.peelWords} words. ${confidenceText}. ${strengthSentence} ${targetSentence}`;
}

function buildStudentSummary(student: StudentProfile, requiredTypes: string[], activities: ActivityRow[], responses: StudentResponseRow[]) {
  const studentResponses = responses.filter((response) => response.student_id === student.id);
  const responseFor = (activityType: string) => {
    const activity = activities.find((item) => item.activity_type === activityType);
    return activity ? studentResponses.find((response) => response.activity_id === activity.id) : undefined;
  };
  const evidenceTypes = requiredTypes.filter((type) => type !== 'lesson_content');
  const quizResponse = responseFor('quiz');
  const flashcardsResponse = responseFor('flashcards');
  const peelResponse = responseFor('peel_response');
  const confidenceResponse = responseFor('confidence_exit_ticket');
  const completeCount = evidenceTypes.filter((type) => isComplete(type, responseFor(type))).length;
  const progress = evidenceTypes.length ? Math.round((completeCount / evidenceTypes.length) * 100) : 0;
  const risks = evidenceTypes.map((type) => getRiskFlag(responseFor(type), type));
  const priorityRisk = risks.find((risk) => ['Intervention', 'Needs development', 'Low confidence', 'Revisit needed', 'Missing evidence', 'Incomplete', 'Check PEEL depth', 'Check understanding', 'Check confidence', 'Consolidate'].includes(risk)) ?? 'On track';
  const confidenceValue = confidenceResponse?.response_json?.confidence ?? confidenceResponse?.score ?? null;
  const quiz = quizEvidence(quizResponse);
  const flashcards = flashcardEvidence(flashcardsResponse);
  const peel = peelEvidence(peelResponse);
  const confidence = confidenceEvidence(confidenceResponse);
  const diagnostics = [
    { key: 'quiz', label: 'Quiz', value: quiz.value, detail: quiz.detail, flag: getRiskFlag(quizResponse, 'quiz') },
    { key: 'flashcards', label: 'Flashcards', value: flashcards.value, detail: flashcards.detail, flag: getRiskFlag(flashcardsResponse, 'flashcards') },
    { key: 'peel', label: 'PEEL', value: peel.value, detail: peel.detail, flag: getRiskFlag(peelResponse, 'peel_response') },
    { key: 'confidence', label: 'Confidence', value: confidence.value, detail: confidence.detail, flag: getRiskFlag(confidenceResponse, 'confidence_exit_ticket') },
  ];
  const baseSummary = {
    id: student.id, name: student.display_name, progress, completed: completeCount, required: evidenceTypes.length,
    quiz: evidenceText('quiz', quizResponse), quizPercentage: quiz.percentage,
    flashcards: evidenceText('flashcards', flashcardsResponse), flashcardsSecure: flashcards.secure, flashcardsNearly: flashcards.nearly, flashcardsRevisit: flashcards.revisit,
    peel: evidenceText('peel_response', peelResponse), peelWords: peel.words,
    confidence: evidenceText('confidence_exit_ticket', confidenceResponse), confidenceArea: confidence.area,
    diagnostics, flag: priorityRisk, action: nextAction(priorityRisk),
    hasMissing: evidenceTypes.some((type) => !responseFor(type)),
    quizSupport: !quizResponse || ((quizResponse.response_json?.percentage ?? 100) < 80),
    flashcardsSupport: !flashcardsResponse || ((flashcardsResponse.response_json?.revisitCount ?? 0) > 0) || ((flashcardsResponse.response_json?.nearlyCount ?? 0) >= 4) || ((flashcardsResponse.response_json?.ratedCount ?? 0) < (flashcardsResponse.response_json?.totalCards ?? 0)),
    peelSupport: !peelResponse || ((peelResponse.response_json?.wordCount ?? 0) < 80),
    confidenceSupport: !confidenceResponse || (typeof confidenceValue === 'number' && confidenceValue <= 3),
  };
  return { ...baseSummary, teacherComment: buildTeacherComment(baseSummary) };
}

function filterSummaries<T extends ReturnType<typeof buildStudentSummary>>(summaries: T[], filter: string) {
  if (filter === 'missing') return summaries.filter((student) => student.hasMissing);
  if (filter === 'quiz') return summaries.filter((student) => student.quizSupport);
  if (filter === 'flashcards') return summaries.filter((student) => student.flashcardsSupport);
  if (filter === 'peel') return summaries.filter((student) => student.peelSupport);
  if (filter === 'confidence') return summaries.filter((student) => student.confidenceSupport);
  return summaries;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const selectedFilter = filterLabels[params.filter ?? ''] ? params.filter as string : 'all';

  if (!supabase) {
    return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.header}><div><p className={styles.eyebrow}>Teacher progress</p><h1>Supabase is not configured</h1><p>Add the Supabase environment variables in Vercel and redeploy.</p></div></header></section></main>;
  }

  const { data: classData, error: classError } = await supabase.from('teacher_classes').select('id, class_name, year_group').eq('status', 'active').order('year_group', { ascending: true }).order('class_name', { ascending: true });
  const classes = mergeClasses((classData ?? []) as TeacherClass[]);
  const selectedClass = classes.find((classItem) => classItem.id === params.classId);
  const activeClass = selectedClass ?? classes[0] ?? DEMO_CLASSES[0];
  const { data: assignmentData, error: assignmentError } = await supabase.from('guided_study_assignments').select('id, mode, required_activity_types, deadline_at, instructions, assigned_class, assigned_student_id, assigned_student_ids, recipient_count, status, created_at').eq('class_id', activeClass.id).eq('status', 'active').eq('pathway_slug', '1905-revolution').order('created_at', { ascending: false }).limit(1).maybeSingle();
  const activeAssignment = assignmentData as GuidedStudyAssignment | null;
  const requiredTypes = orderActivityTypes(activeAssignment?.required_activity_types?.length ? activeAssignment.required_activity_types : PATHWAY_ACTIVITY_ORDER);
  const { data: membershipData, error: membershipError } = await supabase.from('class_memberships').select('class_id, student_id').eq('class_id', activeClass.id).eq('status', 'active');
  const memberships = (membershipData ?? []) as Membership[];
  const membershipStudentIds = memberships.map((membership) => membership.student_id);
  const assignmentStudentIds = activeAssignment?.assigned_student_ids ?? [];
  const legacyAssignmentStudentId = activeAssignment?.assigned_student_id ? [activeAssignment.assigned_student_id] : [];
  const fallbackStudentIds = activeClass.id === DEMO_CLASS_ID ? [DEMO_STUDENT_ID] : [];
  const studentIds = unique([...assignmentStudentIds, ...legacyAssignmentStudentId, ...membershipStudentIds, ...fallbackStudentIds]);
  const { data: profileData, error: profileError } = studentIds.length ? await supabase.from('app_profiles').select('id, display_name, year_group').in('id', studentIds) : { data: [], error: null };
  const profileRows = (profileData ?? []) as StudentProfile[];
  const students = studentIds.map((id, index) => profileRows.find((profile) => profile.id === id) ?? { id, display_name: id === DEMO_STUDENT_ID ? 'Demo Student' : `Student ${index + 1}`, year_group: activeClass.year_group });
  const { data: lesson } = await supabase.from('lessons').select('id, title').eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?').single();
  const { data: activityData } = lesson?.id ? await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id) : { data: [] };
  const activities = (activityData ?? []) as ActivityRow[];
  const activityIds = activities.map((activity) => activity.id);
  const { data: responseData, error: responseError } = activityIds.length && studentIds.length ? await supabase.from('student_responses').select('student_id, activity_id, status, score, response_type, response_json').in('student_id', studentIds).in('activity_id', activityIds) : { data: [], error: null };
  const responses = (responseData ?? []) as StudentResponseRow[];
  const summaries = students.map((student) => buildStudentSummary(student, requiredTypes, activities, responses));
  const filteredSummaries = filterSummaries(summaries, selectedFilter);
  const averageProgress = summaries.length ? Math.round(summaries.reduce((total, student) => total + student.progress, 0) / summaries.length) : 0;
  const flaggedStudents = summaries.filter((student) => student.flag !== 'On track');
  const completedStudents = summaries.filter((student) => student.progress === 100).length;
  const averageQuiz = summaries.map((student) => student.quizPercentage).filter((value): value is number => typeof value === 'number');
  const quizAverage = averageQuiz.length ? Math.round(averageQuiz.reduce((total, value) => total + value, 0) / averageQuiz.length) : null;
  const averageConfidence = summaries.map((student) => Number.parseInt(student.confidence, 10)).filter((value) => Number.isFinite(value));
  const confidenceAverage = averageConfidence.length ? (averageConfidence.reduce((total, value) => total + value, 0) / averageConfidence.length).toFixed(1) : null;
  const totalRevisit = summaries.reduce((total, student) => total + student.flashcardsRevisit, 0);
  const filterCounts = { all: summaries.length, missing: summaries.filter((student) => student.hasMissing).length, quiz: summaries.filter((student) => student.quizSupport).length, flashcards: summaries.filter((student) => student.flashcardsSupport).length, peel: summaries.filter((student) => student.peelSupport).length, confidence: summaries.filter((student) => student.confidenceSupport).length };
  const decision = flaggedStudents.length ? `${flaggedStudents[0].name} needs attention` : 'No urgent action';
  const decisionDetail = flaggedStudents.length ? flaggedStudents[0].action : 'The class is currently on track for the required route.';

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}><span>Teacher / Progress / 1905 Revolution / {activeClass.class_name}</span><Link className={styles.navButton} href="/teacher/set-study">Set study</Link><Link className={styles.navButton} href="/student/dashboard">Student view</Link></div>
      {(classError || membershipError || profileError || assignmentError || responseError) && <section className={styles.error}>Setup warning: {classError?.message ?? membershipError?.message ?? profileError?.message ?? assignmentError?.message ?? responseError?.message}. Run supabase/multi-class-platform.sql if class data is missing.</section>}
      <section className={styles.mainCard}>
        <header className={styles.header}><div><p className={styles.eyebrow}>Teacher class dashboard</p><h1>1905 progress</h1><p>{activeAssignment?.instructions ?? 'Progress is shown against the current 1905 guided study route.'}</p></div><aside className={styles.decisionCard}><p className={styles.eyebrow}>Next action</p><strong>{decision}</strong><span>{decisionDetail}</span></aside></header>
        <section className={styles.controls}>
          <div><p className={styles.eyebrow}>Class view</p><div className={styles.classSwitch}>{classes.map((classItem) => <Link className={`${styles.switchPill} ${classItem.id === activeClass.id ? styles.activeSwitch : ''}`} href={buildProgressUrl(classItem.id, selectedFilter)} key={classItem.id}><strong>{classItem.class_name}</strong><small>{classItem.year_group}</small></Link>)}</div></div>
          <div><p className={styles.eyebrow}>Quick filters</p><div className={styles.filterStrip}>{Object.entries(filterLabels).map(([filterKey, filterLabel]) => <Link className={`${styles.filterPill} ${selectedFilter === filterKey ? styles.activeFilter : ''}`} href={buildProgressUrl(activeClass.id, filterKey)} key={filterKey}>{filterLabel} <span>{filterCounts[filterKey as keyof typeof filterCounts] ?? 0}</span></Link>)}</div></div>
        </section>
        <section className={styles.snapshot}>
          <article className={styles.metric}><span>Class</span><strong>{students.length}</strong><small>{activeClass.year_group} students</small></article>
          <article className={styles.metric}><span>Complete</span><strong>{completedStudents}/{students.length || 0}</strong><small>students at 100%</small></article>
          <article className={styles.metric}><span>Quiz avg</span><strong>{quizAverage ?? '-'}</strong><small>{quizAverage === null ? 'no quiz data' : 'average %'}</small></article>
          <article className={styles.metric}><span>Confidence</span><strong>{confidenceAverage ?? '-'}</strong><small>{confidenceAverage === null ? 'no exit data' : 'average /5'}</small></article>
          <article className={styles.metric}><span>Progress</span><strong>{averageProgress}%</strong><small>{activeAssignment ? formatMode(activeAssignment.mode) : 'default route'}</small></article>
          <article className={styles.metric}><span>Revisit</span><strong>{totalRevisit}</strong><small>flashcards marked revisit</small></article>
        </section>
        <section className={styles.priority}><div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Priority students</p><h2>Who needs attention?</h2></div><span className={styles.badge}>{activeAssignment ? formatDate(activeAssignment.deadline_at) : 'No active deadline'}</span></div>{flaggedStudents.length === 0 ? <div className={styles.empty}><h3>No urgent action</h3><p>No students currently have high-priority intervention flags on this route.</p></div> : <div className={styles.priorityList}>{flaggedStudents.slice(0, 5).map((student) => <article className={styles.priorityItem} key={student.id}><div><strong>{student.name}</strong><small>{student.completed}/{student.required} complete</small></div><p>{student.action}</p><span className={`${styles.statusPill} ${getRiskClass(student.flag)}`}>{student.flag}</span></article>)}</div>}</section>
        <section className={styles.studentEvidence}>
          <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Class overview</p><h2>{filterLabels[selectedFilter]} · {activeClass.class_name}</h2></div><span className={styles.badge}>{filteredSummaries.length}/{summaries.length} shown</span></div>
          <div className={styles.studentList}>{filteredSummaries.length === 0 ? <div className={styles.empty}><h3>No students match this filter</h3><p>Switch back to All students or choose another support filter.</p></div> : filteredSummaries.map((student) => <article className={styles.studentCard} key={student.id}><div className={styles.studentTop}><div><h3>{student.name}</h3><p>{student.progress}% complete · {student.completed}/{student.required} required activities</p></div><span className={`${styles.statusPill} ${getRiskClass(student.flag)}`}>{student.flag}</span></div><div className={styles.diagnosticGrid}>{student.diagnostics.map((item) => <div className={`${styles.diagnosticBox} ${getRiskClass(item.flag)}`} key={item.key}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></div>)}</div><div className={styles.actionStrip}><strong>Suggested action</strong><span>{student.action}</span></div><div className={styles.commentBox}><div className={styles.commentHeader}><strong>Teacher comment</strong><CopyCommentButton text={student.teacherComment} className={styles.copyButton} /></div><p>{student.teacherComment}</p></div></article>)}</div>
          <details className={styles.details}><summary>Open assignment detail</summary><div className={styles.detailGrid}><article className={styles.detailPanel}><h4>Current assignment</h4><p><strong>Class:</strong> {activeClass.class_name}</p><p><strong>Mode:</strong> {activeAssignment ? formatMode(activeAssignment.mode) : 'Default route'}</p><p><strong>Deadline:</strong> {activeAssignment ? formatDate(activeAssignment.deadline_at) : 'No active deadline'}</p><p><strong>Responses found:</strong> {responses.length}</p><p><strong>Classes shown:</strong> {classes.length}</p></article><article className={styles.detailPanel}><h4>Required route</h4>{requiredTypes.map((type, index) => <p key={type}><strong>{index + 1}. {activityLabels[type] ?? type}:</strong> required</p>)}</article></div></details>
        </section>
      </section>
    </main>
  );
}
