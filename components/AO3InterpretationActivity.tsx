'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type AdaptiveRendererSupport } from '@/lib/activityRendererContracts';
import styles from './AO3InterpretationActivity.module.css';

type Interpretation = {
  historian: string;
  argument: string;
};

type Props = {
  activityId: string;
  question: string;
  interpretations: Interpretation[];
  nextHref?: string;
  adaptiveSupport?: AdaptiveRendererSupport;
};

function supportPlaceholder(level: AdaptiveRendererSupport['difficultyLevel']) {
  if (level === 'scaffolded') return 'This interpretation is supported by... This shows...';
  if (level === 'stretch') return 'Use precise contextual knowledge to explain why this interpretation is convincing.';
  return 'Use contextual knowledge to support the interpretation.';
}

function challengePlaceholder(level: AdaptiveRendererSupport['difficultyLevel']) {
  if (level === 'scaffolded') return 'However, this interpretation is limited because...';
  if (level === 'stretch') return 'Challenge the interpretation using precise counter-evidence or limitations.';
  return 'Explain the limitations of the interpretation.';
}

function judgementPlaceholder(level: AdaptiveRendererSupport['difficultyLevel']) {
  if (level === 'scaffolded') return 'Overall, the interpretation is convincing because...';
  if (level === 'stretch') return 'Reach an independent judgement about the most convincing interpretation and explain why.';
  return 'Overall, the most convincing interpretation is... because...';
}

export default function AO3InterpretationActivity({ activityId, question, interpretations, nextHref, adaptiveSupport }: Props) {
  const router = useRouter();
  const [support, setSupport] = useState<Record<number, string>>({});
  const [challenge, setChallenge] = useState<Record<number, string>>({});
  const [overallJudgement, setOverallJudgement] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');

  const canSubmit = interpretations.every((_, index) => support[index]?.trim() && challenge[index]?.trim()) && overallJudgement.trim();

  async function saveInterpretations(status:'in_progress'|'complete') {
    setSaveStatus('saving');

    const response = await fetch('/api/student-responses/activity', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        activityId,
        responseType:'ao3_interpretation',
        status,
        response:{
          support,
          challenge,
          overallJudgement,
          adaptiveSupport,
        },
      }),
    });

    if(response.ok){
      setSaveStatus('saved');
      if(status==='complete' && nextHref) router.push(nextHref);
    } else {
      setSaveStatus('error');
    }
  }

  return (
    <div className={styles.shell}>
      <section className={styles.header}>
        <h2>AO3 interpretations</h2>
        <p>{question}</p>
        {adaptiveSupport?.supportStrategy && <p><strong>Guidance:</strong> {adaptiveSupport.supportStrategy}</p>}
        {adaptiveSupport?.successTarget && <p><strong>Success target:</strong> {adaptiveSupport.successTarget}</p>}
      </section>

      {interpretations.map((interpretation,index)=>(
        <section key={`${interpretation.historian}-${index}`} className={styles.interpretationCard}>
          <h3>{interpretation.historian}</h3>
          <blockquote>{interpretation.argument}</blockquote>

          <label>
            <span>Evidence supporting this interpretation</span>
            <textarea value={support[index] ?? ''} placeholder={supportPlaceholder(adaptiveSupport?.difficultyLevel)} onChange={(event)=>setSupport({...support,[index]:event.target.value})} />
          </label>

          <label>
            <span>Evidence challenging or limiting this interpretation</span>
            <textarea value={challenge[index] ?? ''} placeholder={challengePlaceholder(adaptiveSupport?.difficultyLevel)} onChange={(event)=>setChallenge({...challenge,[index]:event.target.value})} />
          </label>
        </section>
      ))}

      <section className={styles.finalJudgement}>
        <label>
          <span>Overall judgement</span>
          <textarea value={overallJudgement} onChange={(event)=>setOverallJudgement(event.target.value)} placeholder={judgementPlaceholder(adaptiveSupport?.difficultyLevel)} />
        </label>
      </section>

      <section className={styles.footer}>
        <p>{saveStatus==='saved' ? 'Saved' : adaptiveSupport?.difficultyLevel === 'stretch' ? 'Use precise contextual knowledge and comparative judgement.' : 'Evaluate each interpretation using precise contextual knowledge.'}</p>
        <button type="button" className="button" disabled={!canSubmit || saveStatus==='saving'} onClick={()=>saveInterpretations('complete')}>
          {saveStatus==='saving' ? 'Saving...' : 'Next'}
        </button>
      </section>
    </div>
  );
}
