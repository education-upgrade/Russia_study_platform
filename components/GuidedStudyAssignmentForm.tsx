'use client';

import { useMemo, useState } from 'react';
import { getActivityLabel, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import { pathwayOptions } from '@/lib/pathwayRegistry';
import { getOrganisedReadyUnits, getPathwayDisplayTitle } from '@/lib/pathwayCourseOrganisation';
import styles from './GuidedStudyAssignmentForm.module.css';
import unitStyles from './GuidedStudyUnitPicker.module.css';

type StudyMode = 'full_guided_study' | 'exam_practice' | 'recap' | 'confidence_repair';

type ClassOption = {
  id: string;
  className: string;
  yearGroup: string;
  studentCount: number;
};

type GuidedStudyAssignmentFormProps = {
  classOptions: ClassOption[];
};

const fullGuidedStudyActivities = [
  'lesson_content',
  'timeline',
  'flashcards',
  'quiz',
  'judgement_ranking',
  'ao3_interpretation',
  'peel_response',
  'confidence_exit_ticket',
];

const activityOptions = [
  { value: 'lesson_content', label: 'Lesson notes', description: 'Core explanation and context-building.' },
  { value: 'timeline', label: 'Timeline', description: 'Chronology, sequencing and turning-point awareness.' },
  { value: 'flashcards', label: 'Flashcards', description: 'Secure key terms, people and concepts.' },
  { value: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.' },
  { value: 'judgement_ranking', label: 'Judgement ranking', description: 'Rank causes, significance or relative importance.' },
  { value: 'ao3_interpretation', label: 'AO3 interpretation', description: 'Evaluate historical interpretations.' },
  { value: 'peel_response', label: 'PEEL response', description: 'Written argument / exam-skill evidence.' },
  { value: 'confidence_exit_ticket', label: 'Confidence check', description: 'Final metacognitive reflection.' },
];

const modeOptions: { value: StudyMode; title: string; description: string; bestFor: string }[] = [
  { value: 'full_guided_study', title: 'Full study', description: 'Notes, timeline, retrieval, judgement, AO3, PEEL and confidence.', bestFor: 'Best for a complete independent guided-study pathway.' },
  { value: 'exam_practice', title: 'Exam practice', description: 'Retrieval, AO3, PEEL and reflection.', bestFor: 'Best when students need written evidence and exam skill.' },
  { value: 'recap', title: 'Recap', description: 'Notes, flashcards, retrieval and reflection.', bestFor: 'Best when knowledge is insecure or recently taught.' },
  { value: 'confidence_repair', title: 'Confidence repair', description: 'Full pathway with reflection emphasis.', bestFor: 'Best after assessment or low-confidence exit tickets.' },
];

const organisedUnits = getOrganisedReadyUnits();

function orderSelectedActivities(activityTypes: string[]) {
  return orderSupportedActivityTypes(activityTypes);
}

function getDefaultInstructions(mode: StudyMode, topicTitle: string) {
  if (mode === 'exam_practice') return `Complete the retrieval and AO3 tasks first, then produce a focused PEEL paragraph on ${topicTitle}. Finish with the confidence check.`;
  if (mode === 'recap') return `Use the lesson notes, flashcards and quiz to repair weak knowledge on ${topicTitle}. Complete the confidence check last.`;
  if (mode === 'confidence_repair') return `Move carefully through the ${topicTitle} pathway. Complete the confidence check last and be honest about which part still feels insecure.`;
  return `Complete the full ${topicTitle} guided study pathway. Build knowledge first, then chronology, judgement, AO3 interpretation and written argument. Complete the confidence check last.`;
}

function getSelectedModeTitle(mode: StudyMode) {
  return modeOptions.find((option) => option.value === mode)?.title ?? 'Guided study';
}

function getDisplayActivityLabel(activityType: string) {
  return activityOptions.find((activity) => activity.value === activityType)?.label ?? getActivityLabel(activityType);
}

export default function GuidedStudyAssignmentForm({ classOptions }: GuidedStudyAssignmentFormProps) {
  const firstClass = classOptions[0];
  const firstTopic = organisedUnits[0]?.lessons[0] ?? pathwayOptions[0];
  const [classId, setClassId] = useState(firstClass.id);
  const [topicSlug, setTopicSlug] = useState(firstTopic.pathwaySlug);
  const selectedTopic = pathwayOptions.find((topic) => topic.pathwaySlug === topicSlug) ?? firstTopic;
  const selectedTopicTitle = getPathwayDisplayTitle(selectedTopic);
  const [mode, setMode] = useState<StudyMode>('full_guided_study');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(orderSelectedActivities(fullGuidedStudyActivities));
  const [deadlineAt, setDeadlineAt] = useState('');
  const [instructions, setInstructions] = useState(getDefaultInstructions('full_guided_study', selectedTopicTitle));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const selectedClass = classOptions.find((option) => option.id === classId) ?? firstClass;

  const deadlineLabel = useMemo(() => {
    if (!deadlineAt) return 'No deadline set';
    return new Date(deadlineAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }, [deadlineAt]);

  function resetSaveState() {
    setSaveStatus('idle');
    setSaveMessage('');
  }

  function updateTopic(nextSlug: string) {
    const nextTopic = pathwayOptions.find((topic) => topic.pathwaySlug === nextSlug) ?? firstTopic;
    setTopicSlug(nextSlug);
    setInstructions(getDefaultInstructions(mode, getPathwayDisplayTitle(nextTopic)));
    resetSaveState();
  }

  function updateMode(nextMode: StudyMode) {
    setMode(nextMode);
    setInstructions(getDefaultInstructions(nextMode, selectedTopicTitle));
    if (nextMode === 'exam_practice') setSelectedActivities(orderSelectedActivities(['quiz', 'ao3_interpretation', 'peel_response', 'confidence_exit_ticket']));
    else if (nextMode === 'recap') setSelectedActivities(orderSelectedActivities(['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket']));
    else setSelectedActivities(orderSelectedActivities(fullGuidedStudyActivities));
    resetSaveState();
  }

  function toggleActivity(activityType: string) {
    setSelectedActivities((current) => current.includes(activityType)
      ? orderSelectedActivities(current.filter((item) => item !== activityType))
      : orderSelectedActivities([...current, activityType]));
    resetSaveState();
  }

  async function createAssignment() {
    setSaveStatus('saving');
    setSaveMessage('Publishing guided study assignment...');
    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          pathwaySlug: selectedTopic.pathwaySlug,
          lessonTitle: selectedTopic.lessonTitle,
          mode,
          requiredActivityTypes: orderSelectedActivities(selectedActivities),
          deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : undefined,
          instructions,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Assignment could not be created.');
      setSaveStatus('saved');
      setSaveMessage(`Published for ${result.recipientCount ?? 0} student${(result.recipientCount ?? 0) === 1 ? '' : 's'}. Route: ${result.route ?? selectedActivities.map(getDisplayActivityLabel).join(' → ')}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <div className={styles.builder}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Set guided study</p><h2>{selectedTopicTitle}</h2><p>Choose the topic, class, route type and the activities students will complete.</p></div>
          <aside className={styles.headerSummary}><span>Selected lesson</span><strong>{selectedTopic.yearGroup} · {selectedActivities.length} activities</strong></aside>
        </header>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}><span className={styles.stepNumber}>1</span><div><p className={styles.eyebrow}>Choose topic</p><h3>What should students study?</h3></div></div>
          <div className={unitStyles.unitList}>
            {organisedUnits.map((unit) => (
              <details className={unitStyles.unitGroup} key={`${unit.yearGroup}-${unit.unitNumber}`} open={unit.unitNumber === 1 && unit.yearGroup === 'Y12'}>
                <summary className={unitStyles.unitSummary}><span className={unitStyles.unitSummaryText}><span>{unit.yearGroup} · Unit {unit.unitNumber}</span><strong>{unit.unitTitle}</strong></span><span className={unitStyles.chevron}>⌄</span></summary>
                <div className={unitStyles.lessonGrid}>
                  {unit.lessons.map((topic) => (
                    <button type="button" className={`${unitStyles.lessonButton} ${topicSlug === topic.pathwaySlug ? unitStyles.selectedLesson : ''}`} key={topic.pathwaySlug} onClick={() => updateTopic(topic.pathwaySlug)}>
                      <strong>{topic.lessonNumber}. {topic.displayTitle}</strong><small>{topic.subtitle}</small>
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}><span className={styles.stepNumber}>2</span><div><p className={styles.eyebrow}>Choose class</p><h3>Who is this for?</h3></div></div>
          <div className={styles.classGrid}>
            {classOptions.map((option) => (
              <button type="button" className={`${styles.classButton} ${classId === option.id ? styles.selectedClass : ''}`} key={option.id} onClick={() => { setClassId(option.id); resetSaveState(); }}>
                <strong>{option.className}</strong><span>{option.yearGroup} · {option.studentCount} student{option.studentCount === 1 ? '' : 's'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}><span className={styles.stepNumber}>3</span><div><p className={styles.eyebrow}>Choose route</p><h3>What kind of study?</h3></div></div>
          <div className={styles.modeStrip}>{modeOptions.map((option) => <button type="button" className={`${styles.modeButton} ${mode === option.value ? styles.selected : ''}`} key={option.value} onClick={() => updateMode(option.value)}><strong>{option.title}</strong><span>{option.description}</span><small>{option.bestFor}</small></button>)}</div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}><span className={styles.stepNumber}>4</span><div><p className={styles.eyebrow}>Review activities</p><h3>What will students complete?</h3></div></div>
          <div className={styles.activityList}>{activityOptions.map((activity) => { const selectedIndex = selectedActivities.indexOf(activity.value); return <label className={`${styles.activityChoice} ${selectedIndex !== -1 ? styles.selected : ''}`} key={activity.value}><input type="checkbox" checked={selectedIndex !== -1} onChange={() => toggleActivity(activity.value)} /><span><strong>{activity.label}</strong><small>{activity.description}</small></span><span className={styles.orderBadge}>{selectedIndex === -1 ? '–' : selectedIndex + 1}</span></label>; })}</div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}><span className={styles.stepNumber}>5</span><div><p className={styles.eyebrow}>Set and publish</p><h3>Confirm the assignment</h3></div></div>
          <div className={styles.confirmGrid}>
            <div className={styles.finalControls}><label className={styles.field}><span>Deadline</span><input type="datetime-local" value={deadlineAt} onChange={(event) => { setDeadlineAt(event.target.value); resetSaveState(); }} /></label><label className={styles.field}><span>Student instruction</span><textarea value={instructions} onChange={(event) => { setInstructions(event.target.value); resetSaveState(); }} rows={4} /></label></div>
            <aside className={styles.summaryBox}>
              <p className={styles.eyebrow}>Teacher check</p><h3>Ready to publish</h3>
              <div className={styles.summaryLine}><span>Topic</span><strong>{selectedTopicTitle}</strong></div>
              <div className={styles.summaryLine}><span>Class</span><strong>{selectedClass.className}</strong></div>
              <div className={styles.summaryLine}><span>Students</span><strong>{selectedClass.studentCount}</strong></div>
              <div className={styles.summaryLine}><span>Route</span><strong>{getSelectedModeTitle(mode)}</strong></div>
              <div className={styles.summaryLine}><span>Activities</span><strong>{selectedActivities.map(getDisplayActivityLabel).join(' → ')}</strong></div>
              <div className={styles.summaryLine}><span>Deadline</span><strong>{deadlineLabel}</strong></div>
              <button type="button" className={styles.submitButton} onClick={createAssignment} disabled={saveStatus === 'saving' || selectedActivities.length === 0}>{saveStatus === 'saving' ? 'Publishing...' : `Publish for ${selectedClass.className}`}</button>
              {saveMessage && <p className={`${styles.saveMessage} ${styles[saveStatus]}`}><strong>Status:</strong> {saveMessage}</p>}
            </aside>
          </div>
        </section>
      </section>
    </div>
  );
}
