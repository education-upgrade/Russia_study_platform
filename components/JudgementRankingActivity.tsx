'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './JudgementRankingActivity.module.css';

type RankingFactor = {
  id: string;
  title: string;
  detail: string;
};

type Props = {
  activityId: string;
  factors: RankingFactor[];
  question: string;
  nextHref?: string;
};

export default function JudgementRankingActivity({ activityId, factors, question, nextHref }: Props) {
  const router = useRouter();
  const [ranking, setRanking] = useState<string[]>([]);
  const [judgement, setJudgement] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const rankedFactors = useMemo(() => {
    return ranking.map((id) => factors.find((factor) => factor.id === id)).filter(Boolean) as RankingFactor[];
  }, [ranking, factors]);

  const canSubmit = ranking.length === factors.length && judgement.trim().length > 0;

  async function saveRanking(status: 'in_progress' | 'complete') {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/student-responses/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          responseType: 'judgement_ranking',
          status,
          response: {
            ranking,
            judgement,
            topFactor: rankedFactors[0]?.title ?? '',
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Ranking could not be saved.');

      setSaveStatus('saved');
      setSaveMessage(status === 'complete' ? 'Judgement saved' : 'Saved');
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Ranking could not be saved.');
      return false;
    }
  }

  function addToRanking(factorId: string) {
    if (ranking.includes(factorId)) return;
    setRanking([...ranking, factorId]);
    void saveRanking('in_progress');
  }

  function removeFromRanking(factorId: string) {
    setRanking(ranking.filter((id) => id !== factorId));
  }

  async function moveNext() {
    const saved = await saveRanking('complete');
    if (saved && nextHref) router.push(nextHref);
  }

  return (
    <div className={styles.shell}>
      <section className={styles.header}>
        <h2>Judgement ranking</h2>
        <p>{question}</p>
      </section>

      <section className={styles.available}>
        <h3>Available factors</h3>
        <div className={styles.factorGrid}>
          {factors.filter((factor) => !ranking.includes(factor.id)).map((factor) => (
            <button key={factor.id} type="button" className={styles.factorCard} onClick={() => addToRanking(factor.id)}>
              <strong>{factor.title}</strong>
              <span>{factor.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.ranking}>
        <h3>Your ranking</h3>
        <ol>
          {rankedFactors.map((factor) => (
            <li key={factor.id}>
              <div>
                <strong>{factor.title}</strong>
                <p>{factor.detail}</p>
              </div>
              <button type="button" className="button secondary" onClick={() => removeFromRanking(factor.id)}>Remove</button>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.judgement}>
        <label>
          <span>Overall judgement</span>
          <textarea value={judgement} onChange={(event) => setJudgement(event.target.value)} placeholder="Overall, the most important factor was... because..." />
        </label>
      </section>

      <section className={styles.footer}>
        <p>{saveMessage || 'Rank the factors from most to least significant and justify your judgement.'}</p>
        <button type="button" className="button" disabled={!canSubmit || saveStatus === 'saving'} onClick={moveNext}>{saveStatus === 'saving' ? 'Saving...' : 'Next'}</button>
      </section>
    </div>
  );
}
