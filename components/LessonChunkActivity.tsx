'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './LessonChunkActivity.module.css';

type LessonSection = {
  heading: string;
  body: string;
  question?: string;
};

type LessonChunkActivityProps = {
  activityId: string;
  title: string;
  enquiry: string;
  sections: LessonSection[];
  estimatedMinutes: number;
  skillFocus: string;
  difficulty: string;
};

function buildQuestion(section: LessonSection) {
  if (section.question) return section.question;

  const heading = section.heading.toLowerCase();
  if (heading.includes('enquiry')) return 'In one sentence, what is the balanced judgement about whether 1905 was a turning point?';
  if (heading.includes('weakness')) return 'Identify one long-term weakness that made Tsarist authority vulnerable by 1905.';
  if (heading.includes('russo') || heading.includes('japanese')) return 'How did the Russo-Japanese War weaken Nicholas II’s authority?';
  if (heading.includes('bloody')) return 'Why did Bloody Sunday damage the image of the Tsar?';
  if (heading.includes('unrest')) return 'Give one example of unrest after Bloody Sunday and explain what it showed.';
  if (heading.includes('soviet')) return 'Why was the St Petersburg Soviet important as a challenge to Tsarist authority?';
  if (heading.includes('manifesto')) return 'How did the October Manifesto help the regime survive?';
  if (heading.includes('survived')) return 'What was the most important reason the Tsarist regime survived 1905?';
  return 'Write one precise takeaway from this section.';
}

function countCompletedAnswers(answers: Record<number, string>) {
  return Object.values(answers).filter((answer) => answer.trim().length >= 8).length;
}

export default function LessonChunkActivity({ activityId, title, enquiry, sections, estimatedMinutes, skillFocus, difficulty }: LessonChunkActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const currentSection = sections[currentIndex];
  const currentAnswer = answers[currentIndex] ?? '';
  const canContinue = currentAnswer.trim().length >= 8;
  const completedCount = countCompletedAnswers(answers);
  const progressPercentage = sections.length ? Math.round(((currentIndex + 1) / sections.length) * 100) : 0;
  const answeredPercentage = sections.length ? Math.round((completedCount / sections.length) * 100) : 0;

  const sectionQuestion = useMemo(() => buildQuestion(currentSection), [currentSection]);

  async function saveLesson(nextAnswers: Record<number, string>, nextIndex: number, finished: boolean) {
    setSaveStatus('saving');
    setSaveMessage('');

    try {
      const response = await fetch('/api/student-responses/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          answers: nextAnswers,
          currentSection: nextIndex,
          totalSections: sections.length,
          finished,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Lesson progress could not be saved.');

      setSaveStatus('saved');
      setSaveMessage('Saved');
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Could not save lesson progress.');
    }
  }

  function updateAnswer(value: string) {
    setAnswers((previous) => ({ ...previous, [currentIndex]: value }));
    if (saveStatus === 'error') setSaveStatus('idle');
  }

  function goBack() {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  function continueLesson() {
    if (!canContinue) return;

    const nextAnswers = { ...answers, [currentIndex]: currentAnswer };
    const finalSection = currentIndex === sections.length - 1;

    if (finalSection) {
      setIsFinished(true);
      void saveLesson(nextAnswers, currentIndex, true);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    void saveLesson(nextAnswers, nextIndex, false);
  }

  if (!currentSection) {
    return (
      <section className={styles.emptyPanel}>
        <h2>No lesson sections found</h2>
        <p>This lesson does not currently have any content sections.</p>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section className={styles.finishedPanel}>
        <div className={styles.finishedIcon}>✓</div>
        <p className={styles.eyebrow}>Lesson complete</p>
        <h2>{title}</h2>
        <p>You have worked through all sections and completed the short checks. Now test the knowledge in the retrieval quiz.</p>
        <div className={styles.finishedStats}>
          <span>{sections.length}/{sections.length} sections</span>
          <span>{completedCount}/{sections.length} checks answered</span>
          <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : 'Saved'}</span>
        </div>
        <div className={styles.finishedActions}>
          <button type="button" className={styles.secondaryButton} onClick={() => setIsFinished(false)}>Review final section</button>
          <Link className={styles.primaryButton} href="/student/lesson/1905/quiz">Next: retrieval quiz</Link>
        </div>
        {saveStatus === 'error' && <p className={styles.errorText}>{saveMessage}</p>}
      </section>
    );
  }

  return (
    <section className={styles.shell}>
      <header className={styles.headerPanel}>
        <div>
          <p className={styles.eyebrow}>Core context</p>
          <h2>{title}</h2>
          <p>{enquiry}</p>
        </div>
        <div className={styles.metaStack}>
          <span>{estimatedMinutes} mins</span>
          <span>{skillFocus}</span>
          <span>{difficulty}</span>
        </div>
      </header>

      <div className={styles.progressArea}>
        <div className={styles.progressTop}>
          <strong>Section {currentIndex + 1} of {sections.length}</strong>
          <span>{answeredPercentage}% checks complete</span>
        </div>
        <div className={styles.progressBar} aria-label="Lesson progress">
          <div style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <article className={styles.sectionPanel}>
        <div className={styles.sectionNumber}>{currentIndex + 1}</div>
        <div className={styles.sectionText}>
          <p className={styles.eyebrow}>Explanation</p>
          <h3>{currentSection.heading}</h3>
          <p>{currentSection.body}</p>
        </div>
      </article>

      <section className={styles.checkPanel}>
        <div>
          <p className={styles.eyebrow}>Quick check</p>
          <h4>{sectionQuestion}</h4>
        </div>
        <textarea
          value={currentAnswer}
          onChange={(event) => updateAnswer(event.target.value)}
          placeholder="Write a short answer before moving on..."
          aria-label="Lesson comprehension answer"
        />
      </section>

      <nav className={styles.controls}>
        <button type="button" className={styles.secondaryButton} onClick={goBack} disabled={currentIndex === 0}>Previous</button>
        <span className={`${styles.savePill} ${styles[saveStatus]}`} aria-live="polite">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
        <button type="button" className={styles.primaryButton} onClick={continueLesson} disabled={!canContinue}>
          {currentIndex === sections.length - 1 ? 'Finish lesson' : 'Continue'}
        </button>
      </nav>
      {saveStatus === 'error' && <p className={styles.errorText}>{saveMessage}</p>}
    </section>
  );
}
