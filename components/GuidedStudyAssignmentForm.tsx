'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { formatSchoolDateTime, schoolLocalInputToIso, toSchoolDateTimeInput } from '@/lib/dateTime';
import { getOrganisedReadyUnits, getPathwayDisplayTitle } from '@/lib/pathwayCourseOrganisation';
import { activeSubjectPack } from '@/subjects/activeSubject';
import type { StudyMode } from '@/subjects/types';
import styles from './GuidedStudyAssignmentForm.module.css';
import unitStyles from './GuidedStudyUnitPicker.module.css';

type BuilderStep = 1 | 2 | 3;
type ClassOption = { id: string; className: string; yearGroup: string; studentCount: number };
type ExistingDeadline = { classId: string; assignmentId: string; title: string; dueAt: string };
type AssignmentHistoryItem = { classId: string; pathwaySlug: string; assignmentId: string; title: string; createdAt: string; status: string };
type AssignmentHistorySummary = { count: number; lastSetAt: string };
type Template = { classId: string; pathwaySlug: string; mode: StudyMode; requiredActivityTypes: string[]; dueAt: string | null; instructions: string | null } | null;
type Props = { classOptions: ClassOption[]; initialClassId?: string; existingDeadlines?: ExistingDeadline[]; assignmentHistory?: AssignmentHistoryItem[]; template?: Template };

const pathwayOptions = activeSubjectPack.pathways;
const activityOptions = activeSubjectPack.activityOptions;
const modes = activeSubjectPack.activityPresets;
const activityMinutes = Object.fromEntries(activityOptions.map((item) => [item.activityType, item.estimatedMinutes]));
const organisedUnits = getOrganisedReadyUnits(pathwayOptions);

function activityLabel(activityType: string) {
  return activityOptions.find((item) => item.activityType === activityType)?.label ?? activityType.replaceAll('_', ' ');
}
function defaultInstructions(mode: StudyMode, title: string) {
  return activeSubjectPack.defaultInstructions(mode, title);
}
function deadlineText(value: string) {
  return value
    ? formatSchoolDateTime(schoolLocalInputToIso(value), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'No deadline';
}
function previouslySetText(summary: AssignmentHistorySummary) {
  const lastSet = formatSchoolDateTime(summary.lastSetAt, { day: 'numeric', month: 'short', year: 'numeric' });
  return summary.count === 1 ? `Set once · ${lastSet}` : `Set ${summary.count}× · last ${lastSet}`;
}

export default function GuidedStudyAssignmentForm({ classOptions, initialClassId, existingDeadlines = [], assignmentHistory = [], template = null }: Props) {
  const router = useRouter();
  const initialClass = classOptions.find((item) => item.id === (template?.classId || initialClassId)) ?? null;
  const initialTopic = template ? pathwayOptions.find((item) => item.pathwaySlug === template.pathwaySlug) ?? null : null;
  const initialMode = template?.mode ?? 'full_guided_study';
  const initialActivities = template?.requiredActivityTypes?.length
    ? template.requiredActivityTypes
    : modes.find((item) => item.id === initialMode)!.activities;

  const [step, setStep] = useState<BuilderStep>(1);
  const [classId, setClassId] = useState(initialClass?.id ?? '');
  const [topicSlugs, setTopicSlugs] = useState<string[]>(initialTopic ? [initialTopic.pathwaySlug] : []);
  const [mode, setMode] = useState<StudyMode>(initialMode);
  const [activities, setActivities] = useState(orderSupportedActivityTypes(initialActivities));
  const [deadlineAt, setDeadlineAt] = useState(toSchoolDateTimeInput(template?.dueAt));
  const [instructions, setInstructions] = useState(
    template?.instructions || (initialTopic ? defaultInstructions(initialMode, getPathwayDisplayTitle(initialTopic)) : ''),
  );
  const [emailStudents, setEmailStudents] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [message, setMessage] = useState(template ? 'Duplicated details loaded. Review them before publishing.' : '');

  const selectedClass = classOptions.find((item) => item.id === classId) ?? null;
  const selectedTopics = pathwayOptions.filter((item) => topicSlugs.includes(item.pathwaySlug));
  const selectedTopic = selectedTopics.length === 1 ? selectedTopics[0] : null;
  const topicTitle = selectedTopics.length === 0
    ? 'Choose one or more topics'
    : selectedTopics.length === 1
      ? getPathwayDisplayTitle(selectedTopics[0])
      : `${selectedTopics.length} assignments selected`;
  const canConfigure = Boolean(selectedClass && selectedTopics.length > 0);
  const canReview = canConfigure && activities.length > 0;
  const estimatedMinutes = activities.reduce((sum, item) => sum + (activityMinutes[item] ?? 5), 0);
  const totalEstimatedMinutes = estimatedMinutes * Math.max(selectedTopics.length, 1);

  const collisions = useMemo(() => {
    if (!deadlineAt || !classId) return [];
    const selectedDate = deadlineAt.slice(0, 10);
    return existingDeadlines.filter((item) => (
      item.classId === classId && toSchoolDateTimeInput(item.dueAt).slice(0, 10) === selectedDate
    ));
  }, [classId, deadlineAt, existingDeadlines]);

  const assignmentHistoryByPathway = useMemo(() => {
    const summaries = new Map<string, AssignmentHistorySummary>();
    if (!classId) return summaries;

    assignmentHistory.filter((item) => item.classId === classId).forEach((item) => {
      const current = summaries.get(item.pathwaySlug);
      if (!current) {
        summaries.set(item.pathwaySlug, { count: 1, lastSetAt: item.createdAt });
        return;
      }

      summaries.set(item.pathwaySlug, {
        count: current.count + 1,
        lastSetAt: new Date(item.createdAt).getTime() > new Date(current.lastSetAt).getTime() ? item.createdAt : current.lastSetAt,
      });
    });

    return summaries;
  }, [assignmentHistory, classId]);

  function chooseTopic(slug: string) {
    const next = pathwayOptions.find((item) => item.pathwaySlug === slug);
    if (!next) return;

    const nextSlugs = topicSlugs.includes(slug)
      ? topicSlugs.filter((item) => item !== slug)
      : [...topicSlugs, slug];
    const nextTopics = pathwayOptions.filter((item) => nextSlugs.includes(item.pathwaySlug));

    if (nextTopics.length > 1 && selectedTopics.length === 1 && selectedTopic) {
      const currentDefault = defaultInstructions(mode, getPathwayDisplayTitle(selectedTopic));
      if (instructions === currentDefault) setInstructions('');
    } else if (nextTopics.length === 1 && !instructions.trim()) {
      setInstructions(defaultInstructions(mode, getPathwayDisplayTitle(nextTopics[0])));
    }

    setTopicSlugs(nextSlugs);
  }

  function chooseMode(next: StudyMode) {
    setMode(next);
    setActivities(orderSupportedActivityTypes(modes.find((item) => item.id === next)!.activities));
    if (selectedTopic) {
      const previousDefault = defaultInstructions(mode, getPathwayDisplayTitle(selectedTopic));
      if (!instructions.trim() || instructions === previousDefault) {
        setInstructions(defaultInstructions(next, getPathwayDisplayTitle(selectedTopic)));
      }
    }
  }

  function toggleActivity(value: string) {
    setActivities((current) => orderSupportedActivityTypes(
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    ));
  }

  function goToStep(nextStep: BuilderStep) {
    if (nextStep === 1 || (nextStep === 2 && canConfigure) || (nextStep === 3 && canReview)) setStep(nextStep);
  }

  async function save(publishNow: boolean) {
    if (!selectedClass || selectedTopics.length === 0) {
      setStatus('error');
      setMessage('Choose a class and at least one topic before saving.');
      setStep(1);
      return;
    }

    setStatus('saving');
    setMessage(publishNow ? 'Publishing assignment…' : 'Saving draft…');
    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.id,
          assignments: selectedTopics.map((topic) => ({
            pathwaySlug: topic.pathwaySlug,
            lessonTitle: topic.lessonTitle,
            instructions: instructions.trim() || defaultInstructions(mode, getPathwayDisplayTitle(topic)),
          })),
          mode,
          requiredActivityTypes: activities,
          deadlineAt: deadlineAt ? schoolLocalInputToIso(deadlineAt) : undefined,
          publishNow,
          emailStudents: publishNow && emailStudents,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Assignment could not be created.');
      router.push(result.assignmentCount > 1 ? '/teacher/assignments' : `/teacher/assignments/${result.assignmentId}`);
      router.refresh();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return <section className={styles.builder}>
    <header className={styles.hero}>
      <div><p className={styles.eyebrow}>Assignment builder</p><h2>Set the right work, without surprises</h2><p>Choose the class and one or more topics, configure the shared route, then check exactly what students will receive.</p></div>
      <div className={styles.stepper} aria-label="Assignment creation progress">{[1, 2, 3].map((item) => {
        const disabled = item === 2 ? !canConfigure : item === 3 ? !canReview : false;
        return <button type="button" key={item} onClick={() => goToStep(item as BuilderStep)} disabled={disabled} className={step === item ? styles.activeStep : step > item ? styles.completeStep : ''}><span>{step > item ? '✓' : item}</span>{item === 1 ? 'Class & topic' : item === 2 ? 'Configure' : 'Review'}</button>;
      })}</div>
    </header>

    {step === 1 && <section className={styles.panel}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 1</p><h3>What do you want this class to study?</h3></div><span>{selectedTopics.length ? `${selectedTopics.length} assignment${selectedTopics.length === 1 ? '' : 's'} selected` : selectedClass ? `${selectedClass.studentCount} recipients` : 'Choose a class'}</span></div>
      <div className={styles.classGrid}>{classOptions.map((item) => <button type="button" key={item.id} onClick={() => setClassId(item.id)} className={classId === item.id ? styles.selectedCard : styles.choiceCard}><strong>{item.className}</strong><span>{item.yearGroup}</span><small>{item.studentCount} student{item.studentCount === 1 ? '' : 's'}</small></button>)}</div>
      <div className={unitStyles.unitList}>{organisedUnits.map((unit) => <details className={unitStyles.unitGroup} key={`${unit.yearGroup}-${unit.unitNumber}`} open={unit.lessons.some((item) => topicSlugs.includes(item.pathwaySlug))}><summary className={unitStyles.unitSummary}><span className={unitStyles.unitSummaryText}><span>{unit.yearGroup} · Unit {unit.unitNumber}</span><strong>{unit.unitTitle}</strong></span><span className={unitStyles.chevron}>⌄</span></summary><div className={unitStyles.lessonGrid}>{unit.lessons.map((topic) => {
        const history = assignmentHistoryByPathway.get(topic.pathwaySlug);
        const selected = topicSlugs.includes(topic.pathwaySlug);
        return <button type="button" aria-pressed={selected} className={`${unitStyles.lessonButton} ${selected ? unitStyles.selectedLesson : ''}`} key={topic.pathwaySlug} onClick={() => chooseTopic(topic.pathwaySlug)}><span className={unitStyles.lessonHeading}><strong>{topic.lessonNumber}. {topic.displayTitle}</strong><span className={unitStyles.lessonBadges}>{selected && <span className={unitStyles.selectedBadge}>Selected</span>}{history && <span className={unitStyles.previousBadge}>Previously set</span>}</span></span><small>{topic.subtitle}</small>{history && <span className={unitStyles.historyMeta}>{previouslySetText(history)}</span>}</button>;
      })}</div></details>)}</div>
      <div className={styles.footer}><span>{selectedClass?.className ?? 'Choose a class'} · {topicTitle}</span><button type="button" onClick={() => goToStep(2)} disabled={!canConfigure}>Configure {selectedTopics.length || ''} assignment{selectedTopics.length === 1 ? '' : 's'} →</button></div>
    </section>}

    {step === 2 && <section className={styles.panel}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 2</p><h3>Configure the student experience</h3></div><span>{selectedTopics.length > 1 ? `About ${estimatedMinutes} min each` : `About ${estimatedMinutes} minutes`}</span></div>
      <div className={styles.modeGrid}>{modes.map((item) => <button type="button" key={item.id} onClick={() => chooseMode(item.id)} className={mode === item.id ? styles.selectedCard : styles.choiceCard}><strong>{item.title}</strong><span>{item.description}</span></button>)}</div>
      <div className={styles.configureGrid}><div><h4>Required activities</h4><div className={styles.activityList}>{activityOptions.map((item) => { const selected = activities.includes(item.activityType); return <label key={item.activityType} className={selected ? styles.selectedActivity : styles.activity}><input type="checkbox" checked={selected} onChange={() => toggleActivity(item.activityType)} /><span><strong>{item.label}</strong><small>{item.description}</small></span><em>{selected ? activities.indexOf(item.activityType) + 1 : '–'}</em></label>; })}</div></div><div className={styles.controls}><label><span>Deadline (UK time)</span><input type="datetime-local" value={deadlineAt} onChange={(event) => setDeadlineAt(event.target.value)} /></label>{collisions.length > 0 && <div className={styles.warning}><strong>{collisions.length} other assignment{collisions.length === 1 ? '' : 's'} due that day</strong>{collisions.map((item) => <span key={item.assignmentId}>{item.title}</span>)}</div>}<label><span>{selectedTopics.length > 1 ? 'Shared student instructions (optional)' : 'Student instructions'}</span><textarea rows={7} value={instructions} placeholder={selectedTopics.length > 1 ? 'Leave blank to use the normal topic-specific instructions for each assignment.' : undefined} onChange={(event) => setInstructions(event.target.value)} />{selectedTopics.length > 1 && <small className={styles.fieldHint}>Leave blank and each assignment will use its normal topic-specific instructions.</small>}</label></div></div>
      <div className={styles.footer}><button type="button" className={styles.secondary} onClick={() => setStep(1)}>← Back</button><span>{selectedTopics.length} assignment{selectedTopics.length === 1 ? '' : 's'} · {activities.length} activities each · about {totalEstimatedMinutes} minutes total</span><button type="button" onClick={() => goToStep(3)} disabled={!canReview}>Review assignments →</button></div>
    </section>}

    {step === 3 && selectedClass && selectedTopics.length > 0 && <section className={styles.panel}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 3</p><h3>Check before publishing</h3></div><span>{selectedTopics.length} assignment{selectedTopics.length === 1 ? '' : 's'} · {selectedClass.studentCount} students</span></div>
      <div className={styles.reviewGrid}><article className={styles.reviewCard}><span>Class</span><strong>{selectedClass.className}</strong><p>{selectedClass.yearGroup} · {selectedClass.studentCount} active students</p></article><article className={styles.reviewCard}><span>Assignments</span><strong>{selectedTopics.length}</strong><p>{modes.find((item) => item.id === mode)?.title} for each</p></article><article className={styles.reviewCard}><span>Deadline</span><strong>{deadlineText(deadlineAt)}</strong><p>{collisions.length ? `${collisions.length} existing deadline clash${collisions.length === 1 ? '' : 'es'}` : 'No existing same-day class clash'}</p></article><article className={styles.reviewCard}><span>Estimated time</span><strong>~{totalEstimatedMinutes} minutes</strong><p>About {estimatedMinutes} minutes per assignment</p></article></div>
      <div className={styles.assignmentReviewList}><span>Assignments to create</span>{selectedTopics.map((topic) => <div key={topic.pathwaySlug}><strong>{getPathwayDisplayTitle(topic)}</strong><small>{topic.subtitle}</small></div>)}</div>
      <ol className={styles.route}>{activities.map((item) => <li key={item}>{activityLabel(item)}</li>)}</ol>
      <div className={styles.instructionPreview}><span>Students will see</span><p>{instructions || (selectedTopics.length > 1 ? 'Each assignment will use its normal topic-specific instructions.' : defaultInstructions(mode, getPathwayDisplayTitle(selectedTopics[0])))}</p></div>
      <div className={styles.instructionPreview}><label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}><input type="checkbox" checked={emailStudents} onChange={(event) => setEmailStudents(event.target.checked)} style={{ marginTop: 5 }} /><span><strong>Email students when this assignment is published</strong><br /><small>Each student receives the instructions, deadline and a link to My work. When publishing several assignments, students receive one email per assignment. Drafts never send email.</small></span></label></div>
      {message && <div className={status === 'error' ? styles.error : styles.notice}>{message}</div>}
      <div className={styles.footer}><button type="button" className={styles.secondary} onClick={() => setStep(2)}>← Edit</button><div className={styles.publishActions}><button type="button" className={styles.secondary} onClick={() => save(false)} disabled={status === 'saving'}>Save {selectedTopics.length} draft{selectedTopics.length === 1 ? '' : 's'}</button><button type="button" onClick={() => save(true)} disabled={status === 'saving' || !canReview}>{status === 'saving' ? 'Saving…' : `Publish ${selectedTopics.length} assignment${selectedTopics.length === 1 ? '' : 's'} to ${selectedClass.studentCount} students`}</button></div></div>
    </section>}
  </section>;
}
