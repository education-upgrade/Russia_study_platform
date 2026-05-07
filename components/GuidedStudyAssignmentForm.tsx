'use client';

import { useState } from 'react';

type StudyMode = 'full_guided_study' | 'exam_practice' | 'recap' | 'confidence_repair';

const PATHWAY_ACTIVITY_ORDER = ['lesson_content', 'quiz', 'flashcards', 'peel_response', 'confidence_exit_ticket'];

const modeOptions: { value: StudyMode; title: string; description: string }[] = [
  {
    value: 'full_guided_study',
    title: 'Full guided study',
    description: 'Lesson, retrieval, flashcards, PEEL and confidence reflection.',
  },
  {
    value: 'exam_practice',
    title: 'Exam practice',
    description: 'Prioritise written PEEL evidence after core retrieval.',
  },
  {
    value: 'recap',
    title: 'Recap',
    description: 'Use retrieval and flashcards to repair prior knowledge.',
  },
  {
    value: 'confidence_repair',
    title: 'Confidence repair',
    description: 'Reduce anxiety by combining review, low-stakes recall and reflection.',
  },
];

const activityOptions = [
  { value: 'lesson_content', label: 'Lesson content', description: 'Students read the 1905 explanatory notes.' },
  { value: 'quiz', label: 'Retrieval quiz', description: 'Trackable knowledge check.' },
  { value: 'flashcards', label: 'Flashcards', description: 'Trackable secure / nearly / revisit ratings.' },
  { value: 'peel_response', label: 'PEEL response', description: 'Written exam-skill evidence.' },
  { value: 'confidence_exit_ticket', label: 'Confidence exit ticket', description: 'Final reflection and least-secure area.' },
];

const defaultActivities = PATHWAY_ACTIVITY_ORDER;

function orderSelectedActivities(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => PATHWAY_ACTIVITY_ORDER.indexOf(first) - PATHWAY_ACTIVITY_ORDER.indexOf(second));
}

function getDefaultInstructions(mode: StudyMode) {
  if (mode === 'exam_practice') {
    return 'Complete the retrieval quiz and flashcards first, then produce a focused PEEL paragraph. Finish with the confidence exit ticket so I can see what still needs support.';
  }

  if (mode === 'recap') {
    return 'Use the lesson notes, quiz and flashcards to repair weak knowledge. Repeat any revisit cards, then complete the confidence exit ticket as the final task.';
  }

  if (mode === 'confidence_repair') {
    return 'Move carefully through the pathway. Complete the confidence exit ticket last and be honest about which part still feels insecure.';
  }

  return 'Complete the full 1905 guided study pathway before the next review lesson. The confidence exit ticket should be completed last after the evidence tasks.';
}

export default function GuidedStudyAssignmentForm() {
  const [mode, setMode] = useState<StudyMode>('full_guided_study');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultActivities);
  const [deadlineAt, setDeadlineAt] = useState('');
  const [instructions, setInstructions] = useState(getDefaultInstructions('full_guided_study'));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

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
      setSaveMessage(`Assignment created. ID: ${result.assignmentId}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <div className="assignment-builder-grid">
      <section className="card teacher-panel-main">
        <p className="eyebrow">Step 1</p>
        <h2>Choose guided study mode</h2>
        <div className="mode-option-grid">
          {modeOptions.map((option) => (
            <button
              type="button"
              className={`mode-option-card ${mode === option.value ? 'selected' : ''}`}
              key={option.value}
              onClick={() => updateMode(option.value)}
            >
              <strong>{option.title}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card lavender teacher-panel-side">
        <p className="eyebrow">Assignment summary</p>
        <h2>1905 Revolution</h2>
        <p>Demo class: Year 12 Russia. Demo student assignment will appear on the student dashboard.</p>
        <div className="activity-summary">
          <span className="badge">{selectedActivities.length} activities selected</span>
          <span className="badge">Final activity: confidence exit ticket</span>
          <span className="badge">{deadlineAt ? 'Deadline set' : 'No deadline yet'}</span>
        </div>
        {saveMessage && (
          <p className={`save-message ${saveStatus}`}><strong>Status:</strong> {saveMessage}</p>
        )}
      </section>

      <section className="card teal">
        <p className="eyebrow">Step 2</p>
        <h2>Choose activities</h2>
        <div className="activity-choice-list">
          {activityOptions.map((activity) => (
            <label className={`activity-choice ${selectedActivities.includes(activity.value) ? 'selected' : ''}`} key={activity.value}>
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity.value)}
                onChange={() => toggleActivity(activity.value)}
              />
              <span>
                <strong>{activity.label}</strong>
                <small>{activity.description}</small>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="card warm">
        <p className="eyebrow">Step 3</p>
        <h2>Deadline and teacher instructions</h2>
        <label className="form-field">
          <span>Deadline</span>
          <input
            type="datetime-local"
            value={deadlineAt}
            onChange={(event) => setDeadlineAt(event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Instructions to student</span>
          <textarea
            className="textarea"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={6}
          />
        </label>
        <button
          type="button"
          className="button"
          onClick={createAssignment}
          disabled={saveStatus === 'saving' || selectedActivities.length === 0}
        >
          {saveStatus === 'saving' ? 'Creating...' : 'Set guided study'}
        </button>
      </section>
    </div>
  );
}
