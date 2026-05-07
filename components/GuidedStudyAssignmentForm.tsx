'use client';

import { useState } from 'react';
import styles from './GuidedStudyAssignmentForm.module.css';

type StudyMode = 'full_guided_study' | 'exam_practice' | 'recap' | 'confidence_repair';

type ClassOption = {
  id: string;
  className: string;
  yearGroup: string;
  studentCount: number;
};

type GuidedStudyAssignmentFormProps = {
  classOptions?: ClassOption[];
};

const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const fallbackClasses: ClassOption[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    className: 'Year 12 Russia demo class',
    yearGroup: 'Y12',
    studentCount: 1,
  },
];

const modeOptions: { value: StudyMode; title: string; description: string }[] = [
  {
    value: 'full_guided_study',
    title: 'Full study',
    description: 'All pathway activities in order.',
  },
  {
    value: 'exam_practice',
    title: 'Exam practice',
    description: 'Retrieval, flashcards, PEEL and reflection.',
  },
  {
    value: 'recap',
    title: 'Recap',
    description: 'Notes, retrieval, flashcards and reflection.',
  },
  {
    value: 'confidence_repair',
    title: 'Confidence repair',
    description: 'Full pathway with reflection emphasis.',
  },
];

const activityOptions = [
  { value: 'lesson_content', label: 'Lesson notes', description: 'Short explanatory notes.' },
  { value: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.' },
  { value: 'flashcards', label: 'Flashcards', description: 'Secure / nearly / revisit ratings.' },
  { value: 'peel_response', label: 'PEEL response', description: 'Written exam-skill evidence.' },
  { value: 'confidence_exit_ticket', label: 'Confidence check', description: 'Final reflection.' },
];

const defaultActivities = PATHWAY_ACTIVITY_ORDER;

function orderSelectedActivities(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => PATHWAY_ACTIVITY_ORDER.indexOf(first) - PATHWAY_ACTIVITY_ORDER.indexOf(second));
}

function getDefaultInstructions(mode: StudyMode) {
  if (mode === 'exam_practice') {
    return 'Complete the retrieval quiz and flashcards first, then produce a focused PEEL paragraph. Finish with the confidence check.';
  }

  if (mode === 'recap') {
    return 'Use the lesson notes, quiz and flashcards to repair weak knowledge. Complete the confidence check last.';
  }

  if (mode === 'confidence_repair') {
    return 'Move carefully through the pathway. Complete the confidence check last and be honest about which part still feels insecure.';
  }

  return 'Complete the full 1905 guided study pathway. The confidence check should be completed last.';
}

function getSelectedModeTitle(mode: StudyMode) {
  return modeOptions.find((option) => option.value === mode)?.title ?? 'Guided study';
}

export default function GuidedStudyAssignmentForm({ classOptions = fallbackClasses }: GuidedStudyAssignmentFormProps) {
  const usableClassOptions = classOptions.length ? classOptions : fallbackClasses;
  const [classId, setClassId] = useState(usableClassOptions[0]?.id ?? fallbackClasses[0].id);
  const [mode, setMode] = useState<StudyMode>('full_guided_study');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultActivities);
  const [deadlineAt, setDeadlineAt] = useState('');
  const [instructions, setInstructions] = useState(getDefaultInstructions('full_guided_study'));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const selectedClass = usableClassOptions.find((option) => option.id === classId) ?? usableClassOptions[0];

  function updateMode(nextMode: StudyMode) {
    setMode(nextMode);
    setInstructions(getDefaultInstructions(nextMode));

    if (nextMode === 'exam_practice') {
      setSelectedActivities(orderSelectedActivities(['quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket']));
    } else if (nextMode === 'recap') {
      setSelectedActivities(orderSelectedActivities(['lesson_content', 'quiz', 'flashcards', 'confidence_exit_ticket']));
    } else {
      setSelectedActivities(defaultActivities);
    }

    setSaveStatus('idle');
    setSaveMessage('');
  }

  function toggleActivity(activityType: string) {
    setSelectedActivities((current) => {
      if (current.includes(activityType)) {
        return orderSelectedActivities(current.filter((item) => item !== activityType));
      }

      return orderSelectedActivities([...current, activityType]);
    });
    setSaveStatus('idle');
    setSaveMessage('');
  }

  async function createAssignment() {
    setSaveStatus('saving');
    setSaveMessage('Creating guided study assignment...');

    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          mode,
          requiredActivityTypes: orderSelectedActivities(selectedActivities),
          deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : undefined,
          instructions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.setupHint ? `${result.error} ${result.setupHint}` : result.error ?? 'Assignment could not be created.');
      }

      setSaveStatus('saved');
      setSaveMessage(`Assignment created for ${result.recipientCount ?? selectedClass.studentCount} student${(result.recipientCount ?? selectedClass.studentCount) === 1 ? '' : 's'}.`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <div className={styles.builder}>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Set guided study</p>
          <h2>1905 Revolution</h2>
          <p>Choose a class, select the route, set a deadline and send it. The student dashboard will show one clear next task.</p>
        </header>

        <div className={styles.modeStrip}>
          {modeOptions.map((option) => (
            <button
              type="button"
              className={`${styles.modeButton} ${mode === option.value ? styles.selected : ''}`}
              key={option.value}
              onClick={() => updateMode(option.value)}
            >
              <strong>{option.title}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.panel}>
            <p className={styles.eyebrow}>Required student route</p>
            <h3>Activities</h3>

            <label className={styles.field} style={{ marginTop: 0, marginBottom: 12 }}>
              <span>Class</span>
              <select value={classId} onChange={(event) => setClassId(event.target.value)}>
                {usableClassOptions.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.className} · {option.yearGroup} · {option.studentCount} student{option.studentCount === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.activityList}>
              {activityOptions.map((activity) => {
                const selectedIndex = selectedActivities.indexOf(activity.value);
                return (
                  <label className={`${styles.activityChoice} ${selectedIndex !== -1 ? styles.selected : ''}`} key={activity.value}>
                    <input
                      type="checkbox"
                      checked={selectedIndex !== -1}
                      onChange={() => toggleActivity(activity.value)}
                    />
                    <span>
                      <strong>{activity.label}</strong>
                      <small>{activity.description}</small>
                    </span>
                    <span className={styles.orderBadge}>{selectedIndex === -1 ? '–' : selectedIndex + 1}</span>
                  </label>
                );
              })}
            </div>

            <label className={styles.field}>
              <span>Deadline</span>
              <input
                type="datetime-local"
                value={deadlineAt}
                onChange={(event) => setDeadlineAt(event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Student instruction</span>
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                rows={4}
              />
            </label>
          </section>

          <aside className={`${styles.panel} ${styles.summaryBox}`}>
            <p className={styles.eyebrow}>Summary</p>
            <h3>Ready to set</h3>

            <div className={styles.summaryLine}>
              <span>Class</span>
              <strong>{selectedClass.className}</strong>
            </div>
            <div className={styles.summaryLine}>
              <span>Students</span>
              <strong>{selectedClass.studentCount}</strong>
            </div>
            <div className={styles.summaryLine}>
              <span>Mode</span>
              <strong>{getSelectedModeTitle(mode)}</strong>
            </div>
            <div className={styles.summaryLine}>
              <span>Activities</span>
              <strong>{selectedActivities.length} selected</strong>
            </div>
            <div className={styles.summaryLine}>
              <span>Final task</span>
              <strong>{selectedActivities.includes('confidence_exit_ticket') ? 'Confidence check' : 'Not selected'}</strong>
            </div>
            <div className={styles.summaryLine}>
              <span>Deadline</span>
              <strong>{deadlineAt ? 'Set' : 'No deadline yet'}</strong>
            </div>

            <button
              type="button"
              className={styles.submitButton}
              onClick={createAssignment}
              disabled={saveStatus === 'saving' || selectedActivities.length === 0}
            >
              {saveStatus === 'saving' ? 'Creating...' : 'Set guided study'}
            </button>

            {saveMessage && (
              <p className={`${styles.saveMessage} ${styles[saveStatus]}`}><strong>Status:</strong> {saveMessage}</p>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
