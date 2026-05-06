'use client';

import { useState } from 'react';

type ConfidenceExitTicketActivityProps = {
  activityId: string;
  prompt: string;
  scale?: number[];
  leastSecureOptions?: string[];
};

export default function ConfidenceExitTicketActivity({
  activityId,
  prompt,
  scale = [1, 2, 3, 4, 5],
  leastSecureOptions = [],
}: ConfidenceExitTicketActivityProps) {
  const [confidence, setConfidence] = useState<number | null>(null);
  const [leastSecureArea, setLeastSecureArea] = useState('');
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const canSubmit = confidence !== null && leastSecureArea.length > 0;

  async function submitTicket() {
    if (!canSubmit || confidence === null) return;

    setSaveStatus('saving');
    setSaveMessage('Saving confidence exit ticket...');

    try {
      const response = await fetch('/api/student-responses/confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          prompt,
          confidence,
          leastSecureArea,
          reflection,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Confidence exit ticket could not be saved.');
      }

      setSubmitted(true);
      setSaveStatus('saved');
      setSaveMessage(`Saved at ${new Date(result.savedAt).toLocaleTimeString()}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Confidence exit ticket could not be saved.');
    }
  }

  return (
    <div className="peel-shell">
      <div className="panel lavender">
        <div className="peel-toolbar">
          <div>
            <p className="eyebrow">Exit ticket</p>
            <h3>{prompt}</h3>
            <p>Finish by rating confidence and identifying the area that needs the most revision.</p>
          </div>
          <div className="activity-summary">
            <span className="badge">Confidence: {confidence ?? '-'}/5</span>
            <span className="badge">{leastSecureArea || 'Choose least secure area'}</span>
          </div>
        </div>
        {saveMessage && <p><strong>Save status:</strong> {saveMessage}</p>}
      </div>

      <section className="panel">
        <p className="eyebrow">Confidence rating</p>
        <h3>How secure do you feel now?</h3>
        <div className="button-row">
          {scale.map((value) => (
            <button
              type="button"
              key={value}
              className={`option-button${confidence === value ? ' selected' : ''}`}
              style={{ width: 'auto', minWidth: 64, textAlign: 'center' }}
              onClick={() => setConfidence(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p>
          <strong>1</strong> = not secure yet · <strong>5</strong> = very secure
        </p>
      </section>

      <section className="panel warm">
        <p className="eyebrow">Least secure area</p>
        <h3>What should you revisit first?</h3>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {leastSecureOptions.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setLeastSecureArea(option)}
              className={`option-button${leastSecureArea === option ? ' selected' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <label className="panel" style={{ display: 'grid', gap: 10 }}>
        <span className="eyebrow">Optional reflection</span>
        <span><strong>Tell your teacher what would help next.</strong></span>
        <textarea
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          rows={4}
          placeholder="I am least confident with... / I need more practice on..."
          className="textarea"
        />
      </label>

      <div className="button-row">
        <button
          type="button"
          className="button"
          onClick={submitTicket}
          disabled={!canSubmit || saveStatus === 'saving'}
          style={{ opacity: canSubmit ? 1 : 0.5 }}
        >
          {saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update exit ticket' : 'Submit exit ticket'}
        </button>
      </div>
    </div>
  );
}
