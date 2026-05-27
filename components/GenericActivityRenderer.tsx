'use client';

import FlashcardActivity from './FlashcardActivity';
import QuizActivity from './QuizActivity';
import PeelResponseActivity from './PeelResponseActivity';
import ConfidenceExitTicketActivity from './ConfidenceExitTicketActivity';
import TimelineActivity from './TimelineActivity';
import CardSortActivity from './CardSortActivity';
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
    return (
      <FlashcardActivity
        activityId={activityId}
        cards={hasItems(content.cards) ? content.cards : fallbackContent.cards ?? []}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'quiz') {
    return (
      <QuizActivity
        activityId={activityId}
        questions={hasItems(content.questions) ? content.questions : fallbackContent.questions ?? []}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'timeline') {
    return (
      <TimelineActivity
        activityId={activityId}
        events={hasItems(content.events) ? content.events : fallbackContent.events ?? []}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'card_sort') {
    return (
      <CardSortActivity
        activityId={activityId}
        cards={hasItems(content.cards) ? content.cards : fallbackContent.cards ?? []}
        categories={hasItems(content.categories) ? content.categories : fallbackContent.categories ?? []}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'peel_response') {
    return (
      <PeelResponseActivity
        activityId={activityId}
        question={content.question ?? fallbackContent.question ?? ''}
        stretchQuestion={content.stretchQuestion ?? fallbackContent.stretchQuestion}
        scaffold={hasItems(content.scaffold) ? content.scaffold : fallbackContent.scaffold}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'confidence_exit_ticket') {
    return (
      <ConfidenceExitTicketActivity
        activityId={activityId}
        prompt={content.prompt ?? fallbackContent.prompt ?? ''}
        scale={hasItems(content.scale) ? content.scale : fallbackContent.scale}
        leastSecureOptions={hasItems(content.leastSecureOptions)
          ? content.leastSecureOptions
          : fallbackContent.leastSecureOptions}
      />
    );
  }

  return (
    <ComingSoonActivityRenderer
      title={pathwayTitle}
      activityLabel={activityType}
      pathwayHref={routeBase}
      nextHref={nextHref}
    />
  );
}
