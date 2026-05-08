'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PeelResponseActivity.module.css';

type PeelResponseActivityProps = {
  activityId: string;
  question: string;
  stretchQuestion?: string;
  scaffold?: string[];
  nextHref?: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type PeelStepKey = 'point' | 'evidence' | 'explain' | 'link';
type PeelStep = { key: PeelStepKey; title: string; prompt: string; placeholder: string; };

const steps: PeelStep[] = [
  { key: 'point', title: 'Point', prompt: 'Make one clear argument that answers the question directly.', placeholder: 'One important reason Russia was difficult to govern was...' },
  { key: 'evidence', title: 'Evidence', prompt: 'Add precise knowledge: dates, events, key terms or consequences.', placeholder: 'For example, Russia was a vast empire with...' },
  { key: 'explain', title: 'Explain', prompt: 'Explain why the evidence mattered. Show the impact on the question.', placeholder: 'This mattered because it made government difficult by...' },
  { key: 'link', title: 'Link', prompt: 'Return to the question with a judgement about significance or limitation.', placeholder: 'Therefore, this was significant because...' },
];

function countWords(text: string) {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export default function PeelResponseActivity({ activityId, question, stretchQuestion, nextHref = '/student/lesson/1905/confidence' }: PeelResponseActivityProps) {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [values, setValues] = useState<Record<PeelStepKey, string>>({ point: '', evidence: '', explain: '', link: '' });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);
  const activeStep = steps[activeStepIndex];

  const fullResponse = useMemo(() => steps.map((step) => values[step.key].trim()).filter(Boolean).join('\n\n'), [values]);
  const wordCount = countWords(fullResponse);
  const completedSections = steps.filter((step) => values[step.key].trim().length > 0).length;
  const progressPercentage = Math.round((completedSections / steps.length) * 100);
  const hasWriting = wordCount > 0;

  async function saveResponse(nextValues: Record<PeelStepKey, string>, status: 'draft' | 'submitted') {
    const nextFullResponse = steps.map((step) => nextValues[step.key].trim()).filter(Boolean).join('\n\n');
    const nextWordCount = countWords(nextFullResponse);
    if (!nextFullResponse.trim()) return false;
    setSaveStatus('saving');
    setSaveMessage(status === 'submitted' ? 'Submitting...' : 'Autosaving...');
    try {
      const response = await fetch('/api/student-responses/peel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, question, point: nextValues.point, evidence: nextValues.evidence, explain: nextValues.explain, link: nextValues.link, fullResponse: nextFullResponse, wordCount: nextWordCount, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'PEEL response could not be saved.');
      setSaveStatus('saved');
      setSaveMessage(status === 'submitted' ? 'Submitted' : 'Saved');
      if (status === 'submitted') setSubmitted(true);
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'PEEL response could not be saved.');
      return false;
    }
  }

  useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
    if (!hasWriting || submitted) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => { void saveResponse(values, 'draft'); }, 900);
    return () => { if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current); };
  }, [values, hasWriting, submitted]);

  function updateActiveValue(value: string) {
    setValues((previous) => ({ ...previous, [activeStep.key]: value }));
    if (submitted) setSubmitted(false);
  }

  async function submitResponse() {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    await saveResponse(values, 'submitted');
  }

  async function moveToNext() {
    if (isMovingNext) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setIsMovingNext(true);
    const saved = await saveResponse(values, 'submitted');
    if (saved) {
      router.push(nextHref);
      return;
    }
    setIsMovingNext(false);
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}><div><h3>PEEL response</h3></div><div className={styles.stats}><span>{completedSections}/4 sections</span><span>{wordCount} words</span><span>{saveStatus === 'saving' ? 'saving' : saveStatus === 'saved' ? 'saved' : submitted ? 'submitted' : 'ready'}</span></div></section>
      <section className={styles.prompt}><p><strong>Question:</strong> {question}</p>{stretchQuestion && <p><strong>Stretch:</strong> {stretchQuestion}</p>}</section>
      <div className={styles.progress}><div style={{ width: `${progressPercentage}%` }} /></div>
      <section className={styles.writer}>
        <div className={styles.stepTabs}>{steps.map((step, index) => <button type="button" key={step.key} className={`${styles.stepTab}${activeStepIndex === index ? ` ${styles.activeTab}` : ''}${activeStepIndex !== index && values[step.key].trim().length > 0 ? ` ${styles.completedTab}` : ''}`} onClick={() => setActiveStepIndex(index)}>{step.title}</button>)}</div>
        <label className={styles.textPanel}><h2>{activeStep.title}</h2><p>{activeStep.prompt}</p><textarea value={values[activeStep.key]} onChange={(event) => updateActiveValue(event.target.value)} placeholder={activeStep.placeholder} className={styles.textarea} /></label>
        <div className={styles.stepNav}><button type="button" className="button secondary" onClick={() => setActiveStepIndex((previous) => Math.max(previous - 1, 0))} disabled={activeStepIndex === 0}>Previous</button><button type="button" className="button secondary" onClick={() => setActiveStepIndex((previous) => Math.min(previous + 1, steps.length - 1))} disabled={activeStepIndex === steps.length - 1}>Next section</button></div>
      </section>
      <section className={styles.submitRow}>
        <div>{submitted ? <div className={styles.submittedBox}>Submitted. Your teacher can now view this response.</div> : fullResponse ? <div className={styles.preview}>{fullResponse}</div> : <p className={styles.saveMessage}>Build your answer one section at a time.</p>}{saveMessage && <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage}</p>}</div>
        <div style={{ display: 'grid', gap: 8 }}><button type="button" className={`button secondary ${styles.submitButton}`} onClick={submitResponse} disabled={!hasWriting || saveStatus === 'saving'} style={{ opacity: hasWriting ? 1 : 0.5 }}>{saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update response' : 'Submit response'}</button><button type="button" className={`button ${styles.submitButton}`} onClick={moveToNext} disabled={!hasWriting || isMovingNext || saveStatus === 'saving'} style={{ opacity: hasWriting ? 1 : 0.5 }}>{isMovingNext || saveStatus === 'saving' ? 'Saving...' : 'Next'}</button></div>
      </section>
    </div>
  );
}
