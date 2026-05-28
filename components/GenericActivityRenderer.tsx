'use client';

import Link from 'next/link';
import FlashcardActivity from './FlashcardActivity';
import QuizActivity from './QuizActivity';
import PeelResponseActivity from './PeelResponseActivity';
import ConfidenceExitTicketActivity from './ConfidenceExitTicketActivity';
import TimelineActivity from './TimelineActivity';
import CardSortActivity from './CardSortActivity';
import JudgementRankingActivity from './JudgementRankingActivity';
import AO3InterpretationActivity from './AO3InterpretationActivity';
import ComingSoonActivityRenderer from './ComingSoonActivityRenderer';

type Props = {
  activityId: string;
  activityType: string;
  content: any;
  routeBase: string;
  pathwayTitle: string;
  nextHref?: string;
  fallbackContent?: Record<string, any>;
};

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

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

function ActivityShell({ routeBase, children }: { routeBase: string; children: React.ReactNode }) {
  return (
    <>
      <ReturnToPathway routeBase={routeBase} />
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
}: Props) {
  if (activityType === 'flashcards') {
    return <ActivityShell routeBase={routeBase}><FlashcardActivity activityId={activityId} cards={hasItems(content.cards) ? content.cards : fallbackContent.cards ?? []} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'quiz') {
    return <ActivityShell routeBase={routeBase}><QuizActivity activityId={activityId} questions={hasItems(content.questions) ? content.questions : fallbackContent.questions ?? []} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'timeline') {
    return <ActivityShell routeBase={routeBase}><TimelineActivity activityId={activityId} events={hasItems(content.events) ? content.events : fallbackContent.events ?? []} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'card_sort') {
    return <ActivityShell routeBase={routeBase}><CardSortActivity activityId={activityId} cards={hasItems(content.cards) ? content.cards : fallbackContent.cards ?? []} categories={hasItems(content.categories) ? content.categories : fallbackContent.categories ?? []} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'judgement_ranking') {
    return <ActivityShell routeBase={routeBase}><JudgementRankingActivity activityId={activityId} factors={hasItems(content.factors) ? content.factors : fallbackContent.factors ?? []} question={content.question ?? fallbackContent.question ?? ''} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'ao3_interpretation') {
    return <ActivityShell routeBase={routeBase}><AO3InterpretationActivity activityId={activityId} question={content.question ?? fallbackContent.question ?? ''} interpretations={hasItems(content.interpretations) ? content.interpretations : fallbackContent.interpretations ?? []} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'peel_response') {
    return <ActivityShell routeBase={routeBase}><PeelResponseActivity activityId={activityId} question={content.question ?? fallbackContent.question ?? ''} stretchQuestion={content.stretchQuestion ?? fallbackContent.stretchQuestion} scaffold={hasItems(content.scaffold) ? content.scaffold : fallbackContent.scaffold} nextHref={nextHref} /></ActivityShell>;
  }

  if (activityType === 'confidence_exit_ticket') {
    return <ActivityShell routeBase={routeBase}><ConfidenceExitTicketActivity activityId={activityId} prompt={content.prompt ?? fallbackContent.prompt ?? ''} scale={hasItems(content.scale) ? content.scale : fallbackContent.scale} leastSecureOptions={hasItems(content.leastSecureOptions) ? content.leastSecureOptions : fallbackContent.leastSecureOptions} /></ActivityShell>;
  }

  return <ActivityShell routeBase={routeBase}><ComingSoonActivityRenderer title={pathwayTitle} activityLabel={activityType} pathwayHref={routeBase} nextHref={nextHref} /></ActivityShell>;
}
