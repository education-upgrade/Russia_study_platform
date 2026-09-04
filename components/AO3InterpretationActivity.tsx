'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { type AdaptiveRendererSupport } from '@/lib/activityRendererContracts';
import { saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';
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
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const [support, setSupport] = useState<Record<number, string>>({});
  const [challenge, setChallenge] = useState<Record<number, string>>({});
  const [overallJudgement, setOverallJudgement] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const canSubmit = interpretations.every((_, index) => support[index]?.trim() && challenge[index]?.trim()) && overallJudgement.trim();

  async function saveInterpretations(status:'in_progress'|'complete') {
    setSaveStatus('saving');
    setSaveMessage(status === 'complete' ? 'Saving interpretation response...' : 'Saving progress...');

    const evaluation = interpretations.map((interpretation, index) => {
      const supportText = support[index]?.trim() ?? '';
      const challengeText = challenge[index]?.trim() ?? '';
      return `${interpretation.historian}\nSupport: ${supportText}\nChallenge: ${challengeText}`;
    }).join('\n\n');
    const writtenResponse = `${evaluation}\n\nOverall judgement: ${overallJudgement.trim()}`;

    try {
      if (assignmentId) {
        await saveAssignmentActivityProgress({
          assignmentId,
          activityType: 'ao3_interpretation',
          status,
          position: {
            question,
            support,
            challenge,
            overallJudgement,
            judgement: overallJudgement,
            evaluation,
            writtenResponse,
            adaptiveSupport,
          },
        });
      } else {
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
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error ?? 'Interpretation response could not be saved.');
      }

      setSaveStatus('saved');
      setSaveMessage('Interpretation response saved.');
      if(status==='complete' && nextHref) router.push(nextHref);
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Interpretation response could not be saved.');
      return false;
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
            <textarea value={support[index] ?? ''} placeholder={supportPlaceholder(adaptiveSupport?.difficultyLevel)} onChange={(event)=>{ setSupport({...support,[index]:event.target.value}); setSaveStatus('idle'); }} />
          </label>

          <label>
            <span>Evidence challenging or limiting this interpretation</span>
            <textarea value={challenge[index] ?? ''} placeholder={challengePlaceholder(adaptiveSupport?.difficultyLevel)} onChange={(event)=>{ setChallenge({...challenge,[index]:event.target.value}); setSaveStatus('idle'); }} />
          </label>
        </section>
      ))}

      <section className={styles.finalJudgement}>
        <label>
          <span>Overall judgement</span>
          <textarea value={overallJudgement} onChange={(event)=>{ setOverallJudgement(event.target.value); setSaveStatus('idle'); }} placeholder={judgementPlaceholder(adaptiveSupport?.difficultyLevel)} />
        </label>
      </section>

      <section className={styles.footer}>
        <p>{saveMessage || (adaptiveSupport?.difficultyLevel === 'stretch' ? 'Use precise contextual knowledge and comparative judgement.' : 'Evaluate each interpretation using precise contextual knowledge.')}</p>
        <button type="button" className="button" disabled={!canSubmit || saveStatus==='saving'} onClick={()=>void saveInterpretations('complete')}>
          {saveStatus==='saving' ? 'Saving...' : nextHref ? 'Next' : 'Submit AO3 response'}
        </button>
      </section>
    </div>
  );
}
