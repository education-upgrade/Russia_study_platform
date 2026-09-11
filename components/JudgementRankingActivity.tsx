'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';
import styles from './JudgementRankingActivity.module.css';

type RankingFactor = { id: string; title: string; detail: string };
type Props = { activityId: string; factors: RankingFactor[]; question: string; nextHref?: string };

export default function JudgementRankingActivity({ activityId, factors, question, nextHref }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const [ranking, setRanking] = useState<string[]>([]);
  const [judgement, setJudgement] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const rankedFactors = useMemo(() => ranking.map((id) => factors.find((factor) => factor.id === id)).filter(Boolean) as RankingFactor[], [ranking, factors]);
  const canComplete = ranking.length === factors.length && judgement.trim().length > 0;
  const hasProgress = ranking.length > 0 || judgement.trim().length > 0;

  async function saveRanking(status: 'in_progress'|'complete', nextRanking = ranking, nextJudgement = judgement) {
    const nextRankedFactors = nextRanking.map((id) => factors.find((factor) => factor.id === id)).filter(Boolean) as RankingFactor[];
    setSaveStatus('saving'); setSaveMessage('Saving...');
    try {
      if (assignmentId) {
        await saveAssignmentActivityProgress({ assignmentId, activityType: 'judgement_ranking', status, position: { question, ranking: nextRanking, judgement: nextJudgement, justification: nextJudgement, writtenResponse: nextJudgement, topFactor: nextRankedFactors[0]?.title ?? '' } });
      } else {
        const response = await fetch('/api/student-responses/activity', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ activityId, responseType:'judgement_ranking', status, response:{ ranking:nextRanking, judgement:nextJudgement, topFactor:nextRankedFactors[0]?.title ?? '' } }), keepalive:true });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error ?? 'Ranking could not be saved.');
      }
      setSaveStatus('saved'); setSaveMessage(status === 'complete' ? 'Complete — saved automatically.' : 'Saved automatically.'); return true;
    } catch (error) {
      setSaveStatus('error'); setSaveMessage(error instanceof Error ? error.message : 'Ranking could not be saved.'); return false;
    }
  }

  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (!hasProgress) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void saveRanking(canComplete ? 'complete' : 'in_progress'); }, 700);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [ranking, judgement, canComplete, hasProgress]);

  function addToRanking(factorId: string) {
    if (ranking.includes(factorId)) return;
    const next = [...ranking, factorId]; setRanking(next); void saveRanking('in_progress', next, judgement);
  }
  function removeFromRanking(factorId: string) {
    const next = ranking.filter((id) => id !== factorId); setRanking(next); void saveRanking('in_progress', next, judgement);
  }
  async function moveNext() {
    if (!nextHref || !canComplete) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const saved = await saveRanking('complete'); if (saved) router.push(nextHref);
  }

  return <div className={styles.shell}>
    <section className={styles.header}><h2>Judgement ranking</h2><p>{question}</p></section>
    <section className={styles.available}><h3>Available factors</h3><div className={styles.factorGrid}>{factors.filter((factor)=>!ranking.includes(factor.id)).map((factor)=><button key={factor.id} type="button" className={styles.factorCard} onClick={()=>addToRanking(factor.id)}><strong>{factor.title}</strong><span>{factor.detail}</span></button>)}</div></section>
    <section className={styles.ranking}><h3>Your ranking</h3><ol>{rankedFactors.map((factor)=><li key={factor.id}><div><strong>{factor.title}</strong><p>{factor.detail}</p></div><button type="button" className="button secondary" onClick={()=>removeFromRanking(factor.id)}>Remove</button></li>)}</ol></section>
    <section className={styles.judgement}><label><span>Overall judgement</span><textarea value={judgement} onChange={(event)=>setJudgement(event.target.value)} placeholder="Overall, the most important factor was... because..." /></label></section>
    <section className={styles.footer}><p>{saveMessage || 'Every ranking choice and written judgement saves automatically.'}</p>{nextHref && <button type="button" className="button" disabled={!canComplete || saveStatus==='saving'} onClick={()=>void moveNext()}>{saveStatus==='saving' ? 'Saving...' : 'Next'}</button>}</section>
  </div>;
}
