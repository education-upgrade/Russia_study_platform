'use client';

import { useMemo, useState } from 'react';
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

type TopicOption = {
  pathwaySlug: string;
  lessonTitle: string;
  title: string;
  subtitle: string;
  yearGroup: string;
  status: 'ready' | 'planned';
};

const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'flashcards', 'quiz', 'peel_response', 'confidence_exit_ticket'];

const topicOptions: TopicOption[] = [
  {
    pathwaySlug: 'russia-1855',
    lessonTitle: 'Why was Russia difficult to govern in 1855?',
    title: 'Russia in 1855',
    subtitle: 'Autocracy, empire, society and problems of government',
    yearGroup: 'Y12',
    status: 'ready',
  },
  {
    pathwaySlug: '1905-revolution',
    lessonTitle: 'Was the 1905 Revolution a turning point for Tsarist Russia?',
    title: '1905 Revolution',
    subtitle: 'Causes, events, consequences and limits of change',
    yearGroup: 'Y12',
    status: 'ready',
  },
  {
    pathwaySlug: 'feb-oct-1917',
    lessonTitle: 'Why did the Provisional Government collapse in 1917?',
    title: 'February to October 1917',
    subtitle: 'Dual power, Provisional Government failure and Bolshevik success',
    yearGroup: 'Y12',
    status: 'planned',
  },
  {
    pathwaySlug: 'stalin-postwar-khrushchev',
    lessonTitle: 'How far did Stalin and Khrushchev transform the USSR after 1945?',
    title: 'Stalin and Khrushchev, 1945–64',
    subtitle: 'Recovery, reform, repression and de-Stalinisation',
    yearGroup: 'Y13',
    status: 'planned',
  },
];

const fallbackClasses: ClassOption[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    className: 'Year 12 Russia demo class',
    yearGroup: 'Y12',
    studentCount: 1,
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    className: 'Year 13 Russia demo class',
    yearGroup: 'Y13',
    studentCount: 0,
  },
];

const modeOptions: { value: StudyMode; title: string; description: string; bestFor: string }[] = [
  {
    value: 'full_guided_study',
    title: 'Full study',
    description: 'Lesson notes, flashcards, quiz, PEEL and final confidence check.',
    bestFor: 'Best for a complete independent study homework.',
  },
  {
    value: 'exam_practice',
    title: 'Exam practice',
    description: 'Flashcards, retrieval, PEEL and reflection.',
    bestFor: 'Best when students need written evidence and exam skill.',
  },
  {
    value: 'recap',
    title: 'Recap',
    description: 'Notes, flashcards, retrieval and reflection.',
    bestFor: 'Best when knowledge is insecure or recently taught.',
  },
  {
    value: 'confidence_repair',
    title: 'Confidence repair',
    description: 'Full pathway with reflection emphasis.',
    bestFor: 'Best after assessment or low-confidence exit tickets.',
  },
];

const activityOptions = [
  { value: 'lesson_content', label: 'Lesson notes', description: 'Short explanatory notes.' },
  { value: 'flashcards', label: 'Flashcards', description: 'Secure / nearly / revisit ratings.' },
  { value: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.' },
  { value: 'peel_response', label: 'PEEL response', description: 'Written exam-skill evidence.' },
  { value: 'confidence_exit_ticket', label: 'Confidence check', description: 'Final reflection.' },
];

const defaultActivities = PATHWAY_ACTIVITY_ORDER;

function orderSelectedActivities(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => PATHWAY_ACTIVITY_ORDER.indexOf(first) - PATHWAY_ACTIVITY_ORDER.indexOf(second));
}

function getDefaultInstructions(mode: StudyMode, topicTitle: string) {
  if (mode === 'exam_practice') {
    return `Complete the flashcards and retrieval quiz first, then produce a focused PEEL paragraph on ${topicTitle}. Finish with the confidence check.`;
  }

  if (mode === 'recap') {
    return `Use the lesson notes, flashcards and quiz to repair weak knowledge on ${topicTitle}. Complete the confidence check last.`;
  }

  if (mode === 'confidence_repair') {
    return `Move carefully through the ${topicTitle} pathway. Complete the confidence check last and be honest about which part still feels insecure.`;
  }

  return `Complete the full ${topicTitle} guided study pathway. The confidence check should be completed last.`;
}

function getSelectedModeTitle(mode: StudyMode) {
  return modeOptions.find((option) => option.value === mode)?.title ?? 'Guided study';
}

function getActivityLabel(activityType: string) {
  return activityOptions.find((activity) => activity.value === activityType)?.label ?? activityType;
}

export default function GuidedStudyAssignmentForm({ classOptions = fallbackClasses }: GuidedStudyAssignmentFormProps) {
  const usableClassOptions = classOptions.length ? classOptions : fallbackClasses;
  const [classId, setClassId] = useState(usableClassOptions[0]?.id ?? fallbackClasses[0].id);
  const [topicSlug, setTopicSlug] = useState(topicOptions[0].pathwaySlug);
  const selectedTopic = topicOptions.find((topic) => topic.pathwaySlug === topicSlug) ?? topicOptions[0];
  const [mode, setMode] = useState<StudyMode>('full_guided_study');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultActivities);
  const [deadlineAt, setDeadlineAt] = useState('');
  const [instructions, setInstructions] = useState(getDefaultInstructions('full_guided_study', selectedTopic.title));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const selectedClass = usableClassOptions.find((option) => option.id === classId) ?? usableClassOptions[0];
  const selectedMode = modeOptions.find((option) => option.value === mode) ?? modeOptions[0];
  const deadlineLabel = useMemo(() => {
    if (!deadlineAt) return 'No deadline set';
    return new Date(deadlineAt).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [deadlineAt]);

  function resetSaveState() {
    setSaveStatus('idle');
    setSaveMessage('');
  }

  function updateTopic(nextSlug: string) {
    const nextTopic = topicOptions.find((topic) => topic.pathwaySlug === nextSlug) ?? topicOptions[0];
    setTopicSlug(nextSlug);
    setInstructions(getDefaultInstructions(mode, nextTopic.title));
    resetSaveState();
  }

  function updateMode(nextMode: StudyMode) {
    setMode(nextMode);
    setInstructions(getDefaultInstructions(nextMode, selectedTopic.title));

    if (nextMode === 'exam_practice') {
      setSelectedActivities(orderSelectedActivities(['flashcards', 'quiz', 'peel_response', 'confidence_exit_ticket']));
    } else if (nextMode === 'recap') {
      setSelectedActivities(orderSelectedActivities(['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket']));
    } else {
      setSelectedActivities(defaultActivities);
    }

    resetSaveState();
  }

  function toggleActivity(activityType: string) {
    setSelectedActivities((current) => {
      if (current.includes(activityType)) {
        return orderSelectedActivities(current.filter((item) => item !== activityType));
      }

      return orderSelectedActivities([...current, activityType]);
    });
    resetSaveState();
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
          pathwaySlug: selectedTopic.pathwaySlug,
          lessonTitle: selectedTopic.lessonTitle,
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
          <div>
            <p className={styles.eyebrow}>Set guided study</p>
            <h2>{selectedTopic.title}</h2>
            <p>Move through five simple decisions. Students will only see the next task they need to complete.</p>
          </div>
          <aside className={styles.headerSummary}>
            <span>Ready route</span>
            <strong>{selectedTopic.yearGroup} · {selectedActivities.length} activities</strong>
          </aside>
        </header>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <p className={styles.eyebrow}>Choose topic</p>
              <h3>What should students study?</h3>
            </div>
          </div>
          <div className={styles.topicGrid}>
            {topicOptions.map((topic) => (
              <button
                type="button"
                className={`${styles.topicButton} ${topicSlug === topic.pathwaySlug ? styles.selectedTopic : ''}`}
                key={topic.pathwaySlug}
                onClick={() => updateTopic(topic.pathwaySlug)}
              >
                <span className={styles.topicMeta}>{topic.yearGroup} · {topic.status === 'ready' ? 'Ready' : 'Planned'}</span>
                <strong>{topic.title}</strong>
                <small>{topic.subtitle}</small>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <p className={styles.eyebrow}>Choose class</p>
              <h3>Who is this for?</h3>
            </div>
          </div>
          <div className={styles.classGrid}>
            {usableClassOptions.map((option) => (
              <button
                type="button"
                className={`${styles.classButton} ${classId === option.id ? styles.selectedClass : ''}`}
                key={option.id}
                onClick={() => {
                  setClassId(option.id);
                  resetSaveState();
                }}
              >
                <strong>{option.className}</strong>
                <span>{option.yearGroup} · {option.studentCount} student{option.studentCount === 1 ? '' : 's'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>3</span>
            <div>
              <p className={styles.eyebrow}>Choose route</p>
              <h3>What kind of study?</h3>
            </div>
          </div>
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
                <small>{option.bestFor}</small>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>4</span>
            <div>
              <p className={styles.eyebrow}>Review activities</p>
              <h3>What will students complete?</h3>
            </div>
          </div>
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
        </section>

        <section className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>5</span>
            <div>
              <p className={styles.eyebrow}>Set and save</p>
              <h3>Confirm the assignment</h3>
            </div>
          </div>

          <div className={styles.confirmGrid}>
            <div className={styles.finalControls}>
              <label className={styles.field}>
                <span>Deadline</span>
                <input
                  type="datetime-local"
                  value={deadlineAt}
                  onChange={(event) => {
                    setDeadlineAt(event.target.value);
                    resetSaveState();
                  }}
                />
              </label>

              <label className={styles.field}>
                <span>Student instruction</span>
                <textarea
                  value={instructions}
                  onChange={(event) => {
                    setInstructions(event.target.value);
                    resetSaveState();
                  }}
                  rows={4}
                />
              </label>
            </div>

            <aside className={styles.summaryBox}>
              <p className={styles.eyebrow}>Teacher check</p>
              <h3>Ready to set</h3>

              <div className={styles.summaryLine}>
                <span>Topic</span>
                <strong>{selectedTopic.title}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Class</span>
                <strong>{selectedClass.className}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Students</span>
                <strong>{selectedClass.studentCount}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Route</span>
                <strong>{getSelectedModeTitle(mode)}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Activities</span>
                <strong>{selectedActivities.map(getActivityLabel).join(' → ')}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Deadline</span>
                <strong>{deadlineLabel}</strong>
              </div>
              <div className={styles.summaryLine}>
                <span>Last activity</span>
                <strong>{selectedActivities.at(-1) === 'confidence_exit_ticket' ? 'Confidence check' : getActivityLabel(selectedActivities.at(-1) ?? '')}</strong>
              </div>

              <button
                type="button"
                className={styles.submitButton}
                onClick={createAssignment}
                disabled={saveStatus === 'saving' || selectedActivities.length === 0}
              >
                {saveStatus === 'saving' ? 'Creating...' : `Set for ${selectedClass.yearGroup}`}
              </button>

              {saveMessage && (
                <p className={`${styles.saveMessage} ${styles[saveStatus]}`}><strong>Status:</strong> {saveMessage}</p>
              )}
            </aside>
          </div>
        </section>
      </section>
    </div>
  );
}
