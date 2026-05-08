'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './LessonChunkActivity.module.css';

type LessonMedia = {
  type: 'video' | 'image' | 'source' | 'audio';
  title?: string;
  url?: string;
  embedUrl?: string;
  alt?: string;
  caption?: string;
  sourceText?: string;
  credit?: string;
};

type LessonSection = {
  heading: string;
  body: string;
  question?: string;
  taskType?: 'recall' | 'explain' | 'source_inference' | 'judgement';
  teacherNote?: string;
  media?: LessonMedia;
};

type LessonChunkActivityProps = {
  activityId: string;
  title: string;
  enquiry: string;
  sections: LessonSection[];
  estimatedMinutes: number;
  skillFocus: string;
  difficulty: string;
  nextHref?: string;
  nextLabel?: string;
  completionMessage?: string;
};

function buildQuestion(section: LessonSection) {
  if (section.question) return section.question;
  const heading = section.heading.toLowerCase();
  if (heading.includes('enquiry')) return 'In one sentence, explain the balanced judgement from this section.';
  if (heading.includes('weakness')) return 'Identify one weakness and explain why it mattered.';
  if (heading.includes('reform')) return 'Explain why reform was needed.';
  if (heading.includes('society')) return 'Identify one feature of Russian society and explain why it mattered.';
  if (heading.includes('autocracy')) return 'Explain how autocracy shaped Russia.';
  return 'Write one precise takeaway from this section.';
}

function countCompletedAnswers(answers: Record<number, string>) {
  return Object.values(answers).filter((answer) => answer.trim().length >= 8).length;
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
}

function taskTypeLabel(taskType?: LessonSection['taskType']) {
  if (taskType === 'source_inference') return 'Source check';
  if (taskType === 'judgement') return 'Judgement check';
  if (taskType === 'explain') return 'Explain check';
  return 'Quick check';
}

function MediaBlock({ media }: { media?: LessonMedia }) {
  if (!media) return null;
  const title = media.title ?? 'Study resource';

  if (media.type === 'video') {
    const embedUrl = media.embedUrl ?? (media.url ? getYouTubeEmbedUrl(media.url) : '');
    return (
      <aside className={styles.mediaCard}>
        <div className={styles.mediaHeader}><span>Video</span><strong>{title}</strong></div>
        {embedUrl ? (
          <div className={styles.videoFrame}>
            <iframe src={embedUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        ) : <div className={styles.mediaPlaceholder}>Video link not added yet.</div>}
        {media.caption && <p className={styles.mediaCaption}>{media.caption}</p>}
      </aside>
    );
  }

  if (media.type === 'image') {
    return (
      <aside className={styles.mediaCard}>
        <div className={styles.mediaHeader}><span>Image</span><strong>{title}</strong></div>
        {media.url ? <img className={styles.mediaImage} src={media.url} alt={media.alt ?? title} /> : <div className={styles.mediaPlaceholder}>Image link not added yet.</div>}
        {media.caption && <p className={styles.mediaCaption}>{media.caption}</p>}
      </aside>
    );
  }

  if (media.type === 'audio') {
    return (
      <aside className={styles.mediaCard}>
        <div className={styles.mediaHeader}><span>Audio</span><strong>{title}</strong></div>
        {media.url ? <audio className={styles.audioPlayer} controls src={media.url} /> : <div className={styles.mediaPlaceholder}>Audio link not added yet.</div>}
        {media.caption && <p className={styles.mediaCaption}>{media.caption}</p>}
      </aside>
    );
  }

  return (
    <aside className={styles.mediaCard}>
      <div className={styles.mediaHeader}><span>Source</span><strong>{title}</strong></div>
      <blockquote className={styles.sourceBox}>{media.sourceText ?? 'Source text not added yet.'}</blockquote>
      {(media.caption || media.credit) && <p className={styles.mediaCaption}>{media.caption}{media.credit ? ` ${media.credit}` : ''}</p>}
    </aside>
  );
}

export default function LessonChunkActivity({
  activityId,
  title,
  enquiry,
  sections,
  estimatedMinutes,
  skillFocus,
  difficulty,
  nextHref = '/student/lesson/1905/flashcards',
  nextLabel = 'Next: flashcards',
  completionMessage = 'You have worked through all sections and completed the short checks. Now study the flashcards before testing yourself in the quiz.',
}: LessonChunkActivityProps) {
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
  const currentTaskType = taskTypeLabel(currentSection?.taskType);

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
          sectionHeadings: sections.map((section) => section.heading),
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
    return <section className={styles.emptyPanel}><h2>No lesson sections found</h2><p>This lesson does not currently have any content sections.</p></section>;
  }

  if (isFinished) {
    return (
      <section className={styles.finishedPanel}>
        <div className={styles.finishedIcon}>✓</div>
        <p className={styles.eyebrow}>Lesson complete</p>
        <h2>{title}</h2>
        <p>{completionMessage}</p>
        <div className={styles.finishedStats}>
          <span>{sections.length}/{sections.length} sections</span>
          <span>{completedCount}/{sections.length} checks answered</span>
          <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : 'Saved'}</span>
        </div>
        <div className={styles.finishedActions}>
          <button type="button" className={styles.secondaryButton} onClick={() => setIsFinished(false)}>Review final section</button>
          <Link className={styles.primaryButton} href={nextHref}>{nextLabel}</Link>
        </div>
        {saveStatus === 'error' && <p className={styles.errorText}>{saveMessage}</p>}
      </section>
    );
  }

  return (
    <section className={styles.shell}>
      <header className={styles.headerPanel}>
        <div><p className={styles.eyebrow}>Core context</p><h2>{title}</h2><p>{enquiry}</p></div>
        <div className={styles.metaStack}><span>{estimatedMinutes} mins</span><span>{skillFocus}</span><span>{difficulty}</span></div>
      </header>
      <div className={styles.progressArea}>
        <div className={styles.progressTop}><strong>Section {currentIndex + 1} of {sections.length}</strong><span>{answeredPercentage}% checks complete</span></div>
        <div className={styles.progressBar} aria-label="Lesson progress"><div style={{ width: `${progressPercentage}%` }} /></div>
      </div>
      <article className={`${styles.sectionPanel} ${currentSection.media ? styles.hasMedia : ''}`}>
        <div className={styles.sectionNumber}>{currentIndex + 1}</div>
        <div className={styles.sectionText}><p className={styles.eyebrow}>Explanation</p><h3>{currentSection.heading}</h3><p>{currentSection.body}</p></div>
        <MediaBlock media={currentSection.media} />
      </article>
      <section className={styles.checkPanel}>
        <div><p className={styles.eyebrow}>{currentTaskType}</p><h4>{sectionQuestion}</h4></div>
        <textarea value={currentAnswer} onChange={(event) => updateAnswer(event.target.value)} placeholder="Write a short answer before moving on..." aria-label="Lesson comprehension answer" />
      </section>
      <nav className={styles.controls}>
        <button type="button" className={styles.secondaryButton} onClick={() => setCurrentIndex((previous) => Math.max(previous - 1, 0))} disabled={currentIndex === 0}>Previous</button>
        <span className={`${styles.savePill} ${styles[saveStatus]}`} aria-live="polite">{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : saveStatus === 'saved' ? 'Saved' : ''}</span>
        <button type="button" className={styles.primaryButton} onClick={continueLesson} disabled={!canContinue}>{currentIndex === sections.length - 1 ? 'Finish lesson' : 'Continue'}</button>
      </nav>
      {saveStatus === 'error' && <p className={styles.errorText}>{saveMessage}</p>}
    </section>
  );
}
