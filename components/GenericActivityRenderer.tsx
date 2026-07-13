'use client';

import Link from 'next/link';
import LessonContentActivity from './LessonContentActivity';
import FlashcardActivity from './FlashcardActivity';
import QuizActivity from './QuizActivity';
import PeelResponseActivity from './PeelResponseActivity';
import ConfidenceExitTicketActivity from './ConfidenceExitTicketActivity';
import TimelineActivity from './TimelineActivity';
import CardSortActivity from './CardSortActivity';
import JudgementRankingActivity from './JudgementRankingActivity';
import AO3InterpretationActivity from './AO3InterpretationActivity';
import ComingSoonActivityRenderer from './ComingSoonActivityRenderer';
import {
  normaliseRendererContent,
  type AdaptiveRendererSupport,
  type AO3InterpretationContent,
  type CardSortContent,
  type ConfidenceExitTicketContent,
  type FlashcardContent,
  type JudgementRankingContent,
  type PeelResponseContent,
  type QuizContent,
  type TimelineContent,
} from '@/lib/activityRendererContracts';

type Props = {
  activityId: string;
  activityType: string;
  content: any;
  routeBase: string;
  pathwayTitle: string;
  nextHref?: string;
  fallbackContent?: Record<string, any>;
  adaptiveSupport?: AdaptiveRendererSupport;
};

function ReturnToPathway({ routeBase }: { routeBase: string }) {
  return (
    <Link
      href={routeBase}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        marginBottom: 12,
        borderRadius: 999,
        padding: '8px 14px',
        border: '1px solid rgba(213, 226, 235, 0.95)',
        background: 'rgba(255, 255, 255, 0.78)',
        color: 'var(--navy)',
        fontWeight: 950,
        boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
      }}
    >
      ← Return to pathway
    </Link>
  );
}

function AdaptiveSupportNote({ adaptiveSupport }: { adaptiveSupport?: AdaptiveRendererSupport }) {
  if (!adaptiveSupport?.difficultyLevel && !adaptiveSupport?.supportStrategy && !adaptiveSupport?.successTarget) return null;

  return (
    <aside
      style={{
        border: '1px solid rgba(213, 226, 235, 0.95)',
        borderRadius: 22,
        background: 'rgba(255, 255, 255, 0.78)',
        padding: '12px 14px',
        marginBottom: 14,
        color: 'var(--navy)',
        boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4 }}>Adaptive support</strong>
      {adaptiveSupport.difficultyLevel && <p style={{ margin: 0, fontWeight: 800 }}>Level: {adaptiveSupport.difficultyLevel}</p>}
      {adaptiveSupport.supportStrategy && <p style={{ margin: '4px 0 0' }}>{adaptiveSupport.supportStrategy}</p>}
      {adaptiveSupport.successTarget && <p style={{ margin: '4px 0 0', fontWeight: 800 }}>Target: {adaptiveSupport.successTarget}</p>}
    </aside>
  );
}

function ActivityShell({ routeBase, adaptiveSupport, children }: { routeBase: string; adaptiveSupport?: AdaptiveRendererSupport; children: React.ReactNode }) {
  return (
    <>
      <ReturnToPathway routeBase={routeBase} />
      <AdaptiveSupportNote adaptiveSupport={adaptiveSupport} />
      {children}
    </>
  );
}

export default function GenericActivityRenderer({
  activityId,
  activityType,
  content,
  routeBase,
  pathwayTitle,
  nextHref,
  fallbackContent = {},
  adaptiveSupport,
}: Props) {
  const normalisedContent = normaliseRendererContent(activityType, content, fallbackContent);

  if (activityType === 'lesson_content') {
    const sections = Array.isArray(normalisedContent?.sections) ? normalisedContent.sections : [];
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><LessonContentActivity sections={sections} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'flashcards') {
    const typedContent = normalisedContent as FlashcardContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><FlashcardActivity activityId={activityId} cards={typedContent.cards} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'quiz') {
    const typedContent = normalisedContent as QuizContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><QuizActivity activityId={activityId} questions={typedContent.questions} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'timeline') {
    const typedContent = normalisedContent as TimelineContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><TimelineActivity activityId={activityId} events={typedContent.events} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'card_sort') {
    const typedContent = normalisedContent as CardSortContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><CardSortActivity activityId={activityId} cards={typedContent.cards} categories={typedContent.categories} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'judgement_ranking') {
    const typedContent = normalisedContent as JudgementRankingContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><JudgementRankingActivity activityId={activityId} factors={typedContent.factors} question={typedContent.question} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'ao3_interpretation') {
    const typedContent = normalisedContent as AO3InterpretationContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><AO3InterpretationActivity activityId={activityId} question={typedContent.question} interpretations={typedContent.interpretations} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'peel_response') {
    const typedContent = normalisedContent as PeelResponseContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><PeelResponseActivity activityId={activityId} question={typedContent.question} stretchQuestion={typedContent.stretchQuestion} scaffold={typedContent.scaffold} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'confidence_exit_ticket') {
    const typedContent = normalisedContent as ConfidenceExitTicketContent;
    return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><ConfidenceExitTicketActivity activityId={activityId} prompt={typedContent.prompt} scale={typedContent.scale} leastSecureOptions={typedContent.leastSecureOptions} /></ActivityShell>;
  }

  return <ActivityShell routeBase={routeBase} adaptiveSupport={adaptiveSupport}><ComingSoonActivityRenderer title={pathwayTitle} activityLabel={activityType} pathwayHref={routeBase} nextHref={nextHref} /></ActivityShell>;
}
