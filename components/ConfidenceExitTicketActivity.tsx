'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';
import styles from './ConfidenceExitTicketActivity.module.css';

type ConfidenceExitTicketActivityProps = { activityId: string; prompt: string; scale?: number[]; leastSecureOptions?: string[] };
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function ConfidenceExitTicketActivity({ activityId, prompt, scale = [1,2,3,4,5], leastSecureOptions = [] }: ConfidenceExitTicketActivityProps) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [leastSecureArea, setLeastSecureArea] = useState('');
  const [understandBetter, setUnderstandBetter] = useState('');
  const [needHelpWith, setNeedHelpWith] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const completedItems = useMemo(() => [confidence !== null, leastSecureArea.length > 0, understandBetter.trim().length > 0, needHelpWith.trim().length > 0].filter(Boolean).length, [confidence, leastSecureArea, understandBetter, needHelpWith]);
  const isComplete = completedItems === 4;
  const hasProgress = completedItems > 0;
  const progress = Math.round((completedItems / 4) * 100);

  async function saveTicket(status: 'in_progress'|'complete') {
    if (!hasProgress) return false;
    setSaveStatus('saving'); setSaveMessage('Saving...');
    try {
      const position = { least_secure_area: leastSecureArea, understand_better: understandBetter.trim(), need_help_with: needHelpWith.trim(), prompt };
      if (assignmentId) {
        await saveAssignmentActivityProgress({ assignmentId, activityType:'confidence_exit_ticket', status, confidence, position });
      } else {
        const response = await fetch('/api/student-responses/confidence', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ activityId, prompt, confidence, leastSecureArea, understandBetter:understandBetter.trim(), needHelpWith:needHelpWith.trim(), reflection:needHelpWith.trim(), status }), keepalive:true });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error ?? 'Confidence exit ticket could not be saved.');
      }
      setSaveStatus('saved'); setSaveMessage(status === 'complete' ? 'Complete — saved automatically.' : 'Saved automatically.'); return true;
    } catch (error) {
      setSaveStatus('error'); setSaveMessage(error instanceof Error ? error.message : 'Confidence exit ticket could not be saved.'); return false;
    }
  }

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (!hasProgress) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void saveTicket(isComplete ? 'complete' : 'in_progress'); }, 650);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [confidence, leastSecureArea, understandBetter, needHelpWith, isComplete, hasProgress]);

  function chooseConfidence(value: number) { setConfidence(value); void saveTicket('in_progress'); }
  function chooseArea(value: string) { setLeastSecureArea(value); void saveTicket('in_progress'); }

  return <div className={styles.shell}>
    <div className={styles.topbar}><h3>Confidence check</h3><div className={styles.stats}><span>{completedItems}/4 complete</span><span>{confidence ?? '-'}/5 confidence</span><span className={saveStatus === 'saved' ? styles.saved : saveStatus === 'error' ? styles.error : ''}>{saveStatus === 'idle' ? 'autosave on' : saveStatus}</span></div></div>
    <div className={styles.progress} aria-label="Exit ticket completion progress"><div style={{ width:`${progress}%` }} /></div>
    <section className={styles.panel}><div className={styles.promptBlock}><p className="eyebrow">Final reflection</p><h2>{prompt}</h2><p>Your choices and writing are saved automatically as you work.</p></div><div className={styles.scaleRow}>{scale.map((value)=><button type="button" key={value} className={`${styles.scaleButton}${confidence===value?` ${styles.selected}`:''}`} onClick={()=>chooseConfidence(value)}>{value}</button>)}</div><p className={styles.scaleHint}>1 = not secure yet · 5 = very secure</p></section>
    <section className={styles.areaPanel}><p className="eyebrow">Needs most work</p><div className={styles.optionGrid}>{leastSecureOptions.map((option)=><button type="button" key={option} onClick={()=>chooseArea(option)} className={`${styles.optionButton}${leastSecureArea===option?` ${styles.optionSelected}`:''}`}>{option}</button>)}</div></section>
    <section className={styles.textGrid}><label className={styles.textPanel}><span>One thing I understand better now</span><textarea value={understandBetter} onChange={(event)=>setUnderstandBetter(event.target.value)} placeholder="What is clearer now?" /></label><label className={styles.textPanel}><span>One thing I still need help with</span><textarea value={needHelpWith} onChange={(event)=>setNeedHelpWith(event.target.value)} placeholder="What would you like more help with?" /></label></section>
    <div className={styles.submitRow}><p className={`${styles.saveMessage} ${saveStatus==='saved'?styles.saved:saveStatus==='error'?styles.error:''}`}>{saveMessage || 'No save button needed — progress is recorded automatically.'}</p></div>
  </div>;
}
