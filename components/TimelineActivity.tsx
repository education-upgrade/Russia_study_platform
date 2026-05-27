'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './TimelineActivity.module.css';

type TimelineEvent = {
  id?: string;
  date: string;
  title: string;
  detail: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type TimelineActivityProps = {
  activityId: string;
  events: TimelineEvent[];
  nextHref?: string;
};

function getEventId(event: TimelineEvent, index: number) {
  return event.id ?? `${event.date}-${event.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `event-${index + 1}`;
}

function countWords(text: string) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export default function TimelineActivity({ activityId, events, nextHref }: TimelineActivityProps) {
  const router = useRouter();
  const [reviewedEventIds, setReviewedEventIds] = useState<string[]>([]);
  const [turningPointId, setTurningPointId] = useState('');
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const eventKeys = useMemo(() => events.map((event, index) => getEventId(event, index)), [events]);
  const reviewedCount = reviewedEventIds.length;
  const progressPercentage = events.length ? Math.round((reviewedCount / events.length) * 100) : 0;
  const selectedTurningPoint = events.find((event, index) => eventKeys[index] === turningPointId);
  const reflectionWordCount = countWords(reflection);
  const canSubmit = events.length > 0 && reviewedCount === events.length && Boolean(turningPointId) && reflection.trim().length > 0;

  async function saveTimeline(status: 'in_progress' | 'complete') {
    setSaveStatus('saving');
    setSaveMessage(status === 'complete' ? 'Saving completed timeline...' : 'Saving progress...');

    try {
      const response = await fetch('/api/student-responses/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          responseType: 'timeline',
          status,
          score: reviewedCount,
          response: {
            reviewedEventIds,
            turningPointId,
            turningPointTitle: selectedTurningPoint?.title ?? '',
            reflection,
            reflectionWordCount,
            totalEvents: events.length,
            completionPercentage: progressPercentage,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Timeline progress could not be saved.');

      setSaveStatus('saved');
      setSaveMessage(status === 'complete' ? 'Timeline submitted' : 'Saved');
      if (status === 'complete') setSubmitted(true);
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Timeline progress could not be saved.');
      return false;
    }
  }

  function toggleReviewed(eventId: string) {
    const nextReviewedEventIds = reviewedEventIds.includes(eventId)
      ? reviewedEventIds.filter((id) => id !== eventId)
      : [...reviewedEventIds, eventId];

    setReviewedEventIds(nextReviewedEventIds);
    setSubmitted(false);
    void saveTimeline('in_progress');
  }

  async function submitTimeline() {
    if (!canSubmit || saveStatus === 'saving') return;
    await saveTimeline('complete');
  }

  async function moveToNext() {
    if (!canSubmit || isMovingNext) return;
    setIsMovingNext(true);
    const saved = await saveTimeline('complete');
    if (saved && nextHref) {
      router.push(nextHref);
      return;
    }
    setIsMovingNext(false);
  }

  if (events.length === 0) {
    return <section className="panel warm"><h3>No timeline events found</h3><p>This activity does not currently have any timeline events.</p></section>;
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}>
        <div>
          <h3>Timeline judgement</h3>
          <p>Review each event, then choose the most significant turning point.</p>
        </div>
        <div className={styles.stats}>
          <span>{reviewedCount}/{events.length} reviewed</span>
          <span>{reflectionWordCount} words</span>
          <span>{saveStatus === 'saving' ? 'saving' : saveStatus === 'saved' ? 'saved' : submitted ? 'submitted' : 'ready'}</span>
        </div>
      </section>

      <div className={styles.progress}><div style={{ width: `${progressPercentage}%` }} /></div>

      <section className={styles.timeline}>
        {events.map((event, index) => {
          const eventId = eventKeys[index];
          const isReviewed = reviewedEventIds.includes(eventId);
          const isSelected = turningPointId === eventId;
          return (
            <article key={eventId} className={`${styles.eventCard}${isReviewed ? ` ${styles.reviewed}` : ''}${isSelected ? ` ${styles.selected}` : ''}`}>
              <div className={styles.eventDate}>{event.date}</div>
              <div className={styles.eventBody}>
                <h4>{event.title}</h4>
                <p>{event.detail}</p>
                <div className={styles.eventActions}>
                  <button type="button" className="button secondary" onClick={() => toggleReviewed(eventId)}>{isReviewed ? 'Reviewed' : 'Mark reviewed'}</button>
                  <button type="button" className="button secondary" onClick={() => { setTurningPointId(eventId); setSubmitted(false); }}>{isSelected ? 'Selected turning point' : 'Choose as turning point'}</button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.reflectionPanel}>
        <label>
          <span>Why is your chosen event significant?</span>
          <textarea
            value={reflection}
            onChange={(event) => { setReflection(event.target.value); setSubmitted(false); }}
            placeholder="This event was significant because it changed... However, its importance was limited by..."
          />
        </label>
        {selectedTurningPoint && <p className={styles.selectedSummary}>Chosen turning point: <strong>{selectedTurningPoint.date} — {selectedTurningPoint.title}</strong></p>}
      </section>

      <section className={styles.submitRow}>
        <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage || (canSubmit ? 'Ready to submit.' : 'Review every event, choose a turning point and write a short judgement.')}</p>
        <div className={styles.buttonRow}>
          <button type="button" className="button secondary" onClick={submitTimeline} disabled={!canSubmit || saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update timeline' : 'Submit timeline'}</button>
          {nextHref && <button type="button" className="button" onClick={moveToNext} disabled={!canSubmit || isMovingNext || saveStatus === 'saving'}>{isMovingNext || saveStatus === 'saving' ? 'Saving...' : 'Next'}</button>}
        </div>
      </section>
    </div>
  );
}
