'use client';

import { useMemo, useState } from 'react';

type PeelResponseActivityProps = {
  activityId: string;
  question: string;
  stretchQuestion?: string;
  scaffold?: string[];
};

function countWords(text: string) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export default function PeelResponseActivity({
  activityId,
  question,
  stretchQuestion,
  scaffold = ['Point', 'Evidence', 'Explain', 'Link judgement'],
}: PeelResponseActivityProps) {
  const [point, setPoint] = useState('');
  const [evidence, setEvidence] = useState('');
  const [explain, setExplain] = useState('');
  const [link, setLink] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fullResponse = useMemo(() => {
    return [point, evidence, explain, link]
      .map((part) => part.trim())
      .filter(Boolean)
      .join('\n\n');
  }, [point, evidence, explain, link]);

  const wordCount = countWords(fullResponse);
  const completedSections = [point, evidence, explain, link].filter((part) => part.trim().length > 0).length;
  const hasWriting = wordCount > 0;

  async function submitResponse() {
    setSaveStatus('saving');
    setSaveMessage('Saving PEEL response...');

    try {
      const response = await fetch('/api/student-responses/peel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          question,
          point,
          evidence,
          explain,
          link,
          fullResponse,
          wordCount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'PEEL response could not be saved.');
      }

      setSubmitted(true);
      setSaveStatus('saved');
      setSaveMessage(`Saved at ${new Date(result.savedAt).toLocaleTimeString()}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'PEEL response could not be saved.');
    }
  }

  return (
    <div className="peel-shell">
      <div className="panel teal">
        <div className="peel-toolbar">
          <div>
            <p className="eyebrow">Written exam practice</p>
            <h3>{question}</h3>
            {stretchQuestion && <p><strong>Stretch:</strong> {stretchQuestion}</p>}
          </div>
          <div className="activity-summary">
            <span className="badge">{completedSections}/4 sections</span>
            <span className="badge">{wordCount} words</span>
          </div>
        </div>
        <p><strong>Scaffold:</strong> {scaffold.join(' → ')}</p>
        {saveMessage && <p><strong>Save status:</strong> {saveMessage}</p>}
      </div>

      <div className="peel-grid">
        <label className="panel" style={{ display: 'grid', gap: 10 }}>
          <span className="eyebrow">Point</span>
          <span><strong>Make a clear argument.</strong> What is one way 1905 weakened Tsarist authority?</span>
          <textarea
            value={point}
            onChange={(event) => setPoint(event.target.value)}
            rows={5}
            placeholder="The 1905 Revolution weakened Tsarist authority because..."
            className="textarea"
          />
        </label>

        <label className="panel" style={{ display: 'grid', gap: 10 }}>
          <span className="eyebrow">Evidence</span>
          <span><strong>Add precise knowledge.</strong> Use dates, events or key terms.</span>
          <textarea
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            rows={5}
            placeholder="For example, Bloody Sunday in January 1905..."
            className="textarea"
          />
        </label>

        <label className="panel" style={{ display: 'grid', gap: 10 }}>
          <span className="eyebrow">Explain</span>
          <span><strong>Show the impact.</strong> How did this weaken the regime?</span>
          <textarea
            value={explain}
            onChange={(event) => setExplain(event.target.value)}
            rows={5}
            placeholder="This mattered because it damaged legitimacy by..."
            className="textarea"
          />
        </label>

        <label className="panel" style={{ display: 'grid', gap: 10 }}>
          <span className="eyebrow">Link judgement</span>
          <span><strong>Return to the question.</strong> Was this significant, limited or temporary?</span>
          <textarea
            value={link}
            onChange={(event) => setLink(event.target.value)}
            rows={5}
            placeholder="Therefore, this weakened Tsarist authority to a significant/limited extent because..."
            className="textarea"
          />
        </label>
      </div>

      <section className="panel lavender">
        <p className="eyebrow">Preview</p>
        <h3>Your PEEL paragraph</h3>
        {hasWriting ? (
          <p className="preview-box">{fullResponse}</p>
        ) : (
          <p>Your paragraph preview will appear here as you type.</p>
        )}
      </section>

      <div className="button-row">
        <button
          type="button"
          className="button"
          onClick={submitResponse}
          disabled={!hasWriting || saveStatus === 'saving'}
          style={{ opacity: hasWriting ? 1 : 0.5 }}
        >
          {saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update PEEL response' : 'Submit PEEL response'}
        </button>
      </div>
    </div>
  );
}
