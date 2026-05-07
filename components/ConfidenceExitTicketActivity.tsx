'use client';

import { useMemo, useState } from 'react';
import styles from './ConfidenceExitTicketActivity.module.css';

type ConfidenceExitTicketActivityProps = {
  activityId: string;
  prompt: string;
  scale?: number[];
  leastSecureOptions?: string[];
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function ConfidenceExitTicketActivity({
  activityId,
  prompt,
  scale = [1, 2, 3, 4, 5],
  leastSecureOptions = [],
}: ConfidenceExitTicketActivityProps) {
  const [confidence, setConfidence] = useState<number | null>(null);
  const [leastSecureArea, setLeastSecureArea] = useState('');
  const [understandBetter, setUnderstandBetter] = useState('');
  const [needHelpWith, setNeedHelpWith] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const completedItems = useMemo(() => {
    return [confidence !== null, leastSecureArea.length > 0, understandBetter.trim().length > 0, needHelpWith.trim().length > 0].filter(Boolean).length;
  }, [confidence, leastSecureArea, understandBetter, needHelpWith]);

  const canSubmit = confidence !== null && leastSecureArea.length > 0 && understandBetter.trim().length > 0 && needHelpWith.trim().length > 0;
  const progress = Math.round((completedItems / 4) * 100);

  async function submitTicket() {
    if (!canSubmit || confidence === null) return;

    setSaveStatus('saving');
    setSaveMessage('Saving...');

    try {
      const response = await fetch('/api/student-responses/confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          prompt,
          confidence,
          leastSecureArea,
          understandBetter: understandBetter.trim(),
          needHelpWith: needHelpWith.trim(),
          reflection: needHelpWith.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Confidence exit ticket could not be saved.');
      }

      setSubmitted(true);
      setSaveStatus('saved');
      setSaveMessage(`Saved ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Confidence exit ticket could not be saved.');
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <h3>Confidence check</h3>
        <div className={styles.stats}>
          <span>{completedItems}/4 complete</span>
          <span>{confidence ?? '-'}/5 confidence</span>
          <span className={saveStatus === 'saved' ? styles.saved : saveStatus === 'error' ? styles.error : ''}>
            {saveStatus === 'idle' ? 'not saved' : saveStatus}
          </span>
        </div>
      </div>

      <div className={styles.progress} aria-label="Exit ticket completion progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <section className={styles.panel}>
        <div className={styles.promptBlock}>
          <p className="eyebrow">Final reflection</p>
          <h2>{prompt}</h2>
          <p>Finish the pathway by telling your teacher how secure you feel and what still needs support.</p>
        </div>

        <div className={styles.scaleRow} aria-label="Choose confidence rating from 1 to 5">
          {scale.map((value) => (
            <button
              type="button"
              key={value}
              className={`${styles.scaleButton}${confidence === value ? ` ${styles.selected}` : ''}`}
              onClick={() => {
                setConfidence(value);
                setSubmitted(false);
                setSaveStatus('idle');
                setSaveMessage('');
              }}
            >
              {value}
            </button>
          ))}
        </div>
        <p className={styles.scaleHint}>1 = not secure yet · 5 = very secure</p>
      </section>

      <section className={styles.areaPanel}>
        <p className="eyebrow">Needs most work</p>
        <div className={styles.optionGrid}>
          {leastSecureOptions.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                setLeastSecureArea(option);
                setSubmitted(false);
                setSaveStatus('idle');
                setSaveMessage('');
              }}
              className={`${styles.optionButton}${leastSecureArea === option ? ` ${styles.optionSelected}` : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.textGrid}>
        <label className={styles.textPanel}>
          <span>One thing I understand better now</span>
          <textarea
            value={understandBetter}
            onChange={(event) => {
              setUnderstandBetter(event.target.value);
              setSubmitted(false);
              setSaveStatus('idle');
              setSaveMessage('');
            }}
            placeholder="For example: why Bloody Sunday mattered..."
          />
        </label>
        <label className={styles.textPanel}>
          <span>One thing I still need help with</span>
          <textarea
            value={needHelpWith}
            onChange={(event) => {
              setNeedHelpWith(event.target.value);
              setSubmitted(false);
              setSaveStatus('idle');
              setSaveMessage('');
            }}
            placeholder="For example: linking consequences to Tsarist authority..."
          />
        </label>
      </section>

      <div className={styles.submitRow}>
        <p className={`${styles.saveMessage} ${saveStatus === 'saved' ? styles.saved : saveStatus === 'error' ? styles.error : ''}`}>
          {saveMessage || (canSubmit ? 'Ready to submit.' : 'Complete all four parts to submit.')}
        </p>
        <button
          type="button"
          className={`button ${styles.submitButton}`}
          onClick={submitTicket}
          disabled={!canSubmit || saveStatus === 'saving'}
          style={{ opacity: canSubmit ? 1 : 0.5 }}
        >
          {saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update check' : 'Submit check'}
        </button>
      </div>
    </div>
  );
}
