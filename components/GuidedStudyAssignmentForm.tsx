'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { getOrganisedReadyUnits, getPathwayDisplayTitle } from '@/lib/pathwayCourseOrganisation';
import { activeSubjectPack } from '@/subjects/activeSubject';
import type { StudyMode } from '@/subjects/types';
import styles from './GuidedStudyAssignmentForm.module.css';
import unitStyles from './GuidedStudyUnitPicker.module.css';

type BuilderStep = 1 | 2 | 3;

type ClassOption = { id: string; className: string; yearGroup: string; studentCount: number };
type ExistingDeadline = { classId: string; assignmentId: string; title: string; dueAt: string };
type Template = {
  classId: string;
  pathwaySlug: string;
  mode: StudyMode;
  requiredActivityTypes: string[];
  dueAt: string | null;
  instructions: string | null;
} | null;

type Props = {
  classOptions: ClassOption[];
  initialClassId?: string;
  existingDeadlines?: ExistingDeadline[];
  template?: Template;
};

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
function localInput(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
function deadlineText(value: string) {
  return value ? new Date(value).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No deadline';
}

export default function GuidedStudyAssignmentForm({ classOptions, initialClassId, existingDeadlines = [], template = null }: Props) {
  const router = useRouter();
  const firstClass = classOptions.find((item) => item.id === (template?.classId || initialClassId)) ?? classOptions[0];
  const firstTopic = pathwayOptions.find((item) => item.pathwaySlug === template?.pathwaySlug) ?? organisedUnits[0]?.lessons[0] ?? pathwayOptions[0];
  const initialMode = template?.mode ?? 'full_guided_study';
  const initialActivities = template?.requiredActivityTypes?.length ? template.requiredActivityTypes : modes.find((item) => item.id === initialMode)!.activities;
  const [step, setStep] = useState<BuilderStep>(1);
  const [classId, setClassId] = useState(firstClass.id);
  const [topicSlug, setTopicSlug] = useState(firstTopic.pathwaySlug);
  const [mode, setMode] = useState<StudyMode>(initialMode);
  const [activities, setActivities] = useState(orderSupportedActivityTypes(initialActivities));
  const selectedTopic = pathwayOptions.find((item) => item.pathwaySlug === topicSlug) ?? firstTopic;
  const topicTitle = getPathwayDisplayTitle(selectedTopic);
  const [deadlineAt, setDeadlineAt] = useState(localInput(template?.dueAt));
  const [instructions, setInstructions] = useState(template?.instructions || defaultInstructions(initialMode, topicTitle));
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [message, setMessage] = useState(template ? 'Duplicated details loaded. Review them before publishing.' : '');
  const selectedClass = classOptions.find((item) => item.id === classId) ?? firstClass;
  const estimatedMinutes = activities.reduce((sum, item) => sum + (activityMinutes[item] ?? 5), 0);

  const collisions = useMemo(() => {
    if (!deadlineAt) return [];
    const selectedDate = new Date(deadlineAt).toDateString();
    return existingDeadlines.filter((item) => item.classId === classId && new Date(item.dueAt).toDateString() === selectedDate);
  }, [classId, deadlineAt, existingDeadlines]);

  function chooseTopic(slug: string) {
    const next = pathwayOptions.find((item) => item.pathwaySlug === slug) ?? firstTopic;
    setTopicSlug(slug);
    setInstructions(defaultInstructions(mode, getPathwayDisplayTitle(next)));
  }
  function chooseMode(next: StudyMode) {
    setMode(next);
    setActivities(orderSupportedActivityTypes(modes.find((item) => item.id === next)!.activities));
    setInstructions(defaultInstructions(next, topicTitle));
  }
  function toggleActivity(value: string) {
    setActivities((current) => orderSupportedActivityTypes(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  async function save(publishNow: boolean) {
    setStatus('saving');
    setMessage(publishNow ? 'Publishing assignment…' : 'Saving draft…');
    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, pathwaySlug: selectedTopic.pathwaySlug, lessonTitle: selectedTopic.lessonTitle, mode, requiredActivityTypes: activities, deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : undefined, instructions, publishNow }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Assignment could not be created.');
      router.push(`/teacher/assignments/${result.assignmentId}`);
      router.refresh();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <section className={styles.builder}>
      <header className={styles.hero}>
        <div><p className={styles.eyebrow}>Assignment builder</p><h2>Set the right work, without surprises</h2><p>Choose the class and topic, configure the route, then check exactly what students will receive.</p></div>
        <div className={styles.stepper} aria-label="Assignment creation progress">
          {[1, 2, 3].map((item) => <button type="button" key={item} onClick={() => setStep(item as BuilderStep)} className={step === item ? styles.activeStep : step > item ? styles.completeStep : ''}><span>{step > item ? '✓' : item}</span>{item === 1 ? 'Class & topic' : item === 2 ? 'Configure' : 'Review'}</button>)}
        </div>
      </header>

      {step === 1 && <section className={styles.panel}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 1</p><h3>What do you want this class to study?</h3></div><span>{selectedClass.studentCount} recipients</span></div>
        <div className={styles.classGrid}>{classOptions.map((item) => <button type="button" key={item.id} onClick={() => setClassId(item.id)} className={classId === item.id ? styles.selectedCard : styles.choiceCard}><strong>{item.className}</strong><span>{item.yearGroup}</span><small>{item.studentCount} student{item.studentCount === 1 ? '' : 's'}</small></button>)}</div>
        <div className={unitStyles.unitList}>{organisedUnits.map((unit) => <details className={unitStyles.unitGroup} key={`${unit.yearGroup}-${unit.unitNumber}`} open={unit.lessons.some((item) => item.pathwaySlug === topicSlug)}><summary className={unitStyles.unitSummary}><span className={unitStyles.unitSummaryText}><span>{unit.yearGroup} · Unit {unit.unitNumber}</span><strong>{unit.unitTitle}</strong></span><span className={unitStyles.chevron}>⌄</span></summary><div className={unitStyles.lessonGrid}>{unit.lessons.map((topic) => <button type="button" className={`${unitStyles.lessonButton} ${topicSlug === topic.pathwaySlug ? unitStyles.selectedLesson : ''}`} key={topic.pathwaySlug} onClick={() => chooseTopic(topic.pathwaySlug)}><strong>{topic.lessonNumber}. {topic.displayTitle}</strong><small>{topic.subtitle}</small></button>)}</div></details>)}</div>
        <div className={styles.footer}><span>{selectedClass.className} · {topicTitle}</span><button type="button" onClick={() => setStep(2)}>Configure assignment →</button></div>
      </section>}

      {step === 2 && <section className={styles.panel}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 2</p><h3>Configure the student experience</h3></div><span>About {estimatedMinutes} minutes</span></div>
        <div className={styles.modeGrid}>{modes.map((item) => <button type="button" key={item.id} onClick={() => chooseMode(item.id)} className={mode === item.id ? styles.selectedCard : styles.choiceCard}><strong>{item.title}</strong><span>{item.description}</span></button>)}</div>
        <div className={styles.configureGrid}>
          <div><h4>Required activities</h4><div className={styles.activityList}>{activityOptions.map((item) => { const selected = activities.includes(item.activityType); return <label key={item.activityType} className={selected ? styles.selectedActivity : styles.activity}><input type="checkbox" checked={selected} onChange={() => toggleActivity(item.activityType)} /><span><strong>{item.label}</strong><small>{item.description}</small></span><em>{selected ? activities.indexOf(item.activityType) + 1 : '–'}</em></label>; })}</div></div>
          <div className={styles.controls}><label><span>Deadline</span><input type="datetime-local" value={deadlineAt} onChange={(event) => setDeadlineAt(event.target.value)} /></label>{collisions.length > 0 && <div className={styles.warning}><strong>{collisions.length} other assignment{collisions.length === 1 ? '' : 's'} due that day</strong>{collisions.map((item) => <span key={item.assignmentId}>{item.title}</span>)}</div>}<label><span>Student instructions</span><textarea rows={7} value={instructions} onChange={(event) => setInstructions(event.target.value)} /></label></div>
        </div>
        <div className={styles.footer}><button type="button" className={styles.secondary} onClick={() => setStep(1)}>← Back</button><span>{activities.length} activities · about {estimatedMinutes} minutes</span><button type="button" onClick={() => setStep(3)} disabled={!activities.length}>Review assignment →</button></div>
      </section>}

      {step === 3 && <section className={styles.panel}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Step 3</p><h3>Check before publishing</h3></div><span>{selectedClass.studentCount} students</span></div>
        <div className={styles.reviewGrid}>
          <article className={styles.reviewCard}><span>Class</span><strong>{selectedClass.className}</strong><p>{selectedClass.yearGroup} · {selectedClass.studentCount} active students</p></article>
          <article className={styles.reviewCard}><span>Study</span><strong>{topicTitle}</strong><p>{modes.find((item) => item.id === mode)?.title}</p></article>
          <article className={styles.reviewCard}><span>Deadline</span><strong>{deadlineText(deadlineAt)}</strong><p>{collisions.length ? `${collisions.length} deadline clash${collisions.length === 1 ? '' : 'es'}` : 'No same-day class clash'}</p></article>
          <article className={styles.reviewCard}><span>Estimated time</span><strong>{estimatedMinutes} minutes</strong><p>{activities.length} required activities</p></article>
        </div>
        <ol className={styles.route}>{activities.map((item) => <li key={item}>{activityLabel(item)}</li>)}</ol>
        <div className={styles.instructionPreview}><span>Students will see</span><p>{instructions || 'No additional instructions.'}</p></div>
        {message && <div className={status === 'error' ? styles.error : styles.notice}>{message}</div>}
        <div className={styles.footer}><button type="button" className={styles.secondary} onClick={() => setStep(2)}>← Edit</button><div className={styles.publishActions}><button type="button" className={styles.secondary} onClick={() => save(false)} disabled={status === 'saving'}>Save draft</button><button type="button" onClick={() => save(true)} disabled={status === 'saving' || !activities.length}>{status === 'saving' ? 'Saving…' : `Publish to ${selectedClass.studentCount} students`}</button></div></div>
      </section>}
    </section>
  );
}
