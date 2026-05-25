'use client';

import FlashcardActivity from './FlashcardActivity';
import QuizActivity from './QuizActivity';
import PeelResponseActivity from './PeelResponseActivity';
import ConfidenceExitTicketActivity from './ConfidenceExitTicketActivity';
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
        cards={Array.isArray(content.cards) ? content.cards : fallbackContent.cards ?? []}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'quiz') {
    return (
      <QuizActivity
        activityId={activityId}
        questions={Array.isArray(content.questions) ? content.questions : fallbackContent.questions ?? []}
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
        scaffold={Array.isArray(content.scaffold) ? content.scaffold : fallbackContent.scaffold}
        nextHref={nextHref}
      />
    );
  }

  if (activityType === 'confidence_exit_ticket') {
    return (
      <ConfidenceExitTicketActivity
        activityId={activityId}
        prompt={content.prompt ?? fallbackContent.prompt ?? ''}
        scale={Array.isArray(content.scale) ? content.scale : fallbackContent.scale}
        leastSecureOptions={Array.isArray(content.leastSecureOptions)
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
