import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  crimeanWarPathwaySlug,
  pathwayCrimeanWarFlashcards,
  pathwayCrimeanWarQuizQuestions,
  pathwayCrimeanWarPeelContent,
  pathwayCrimeanWarConfidenceContent,
} from '@/lib/pathwayCrimeanWarContent';

const fallbackContentByActivityType: Record<string, any> = {
  flashcards: { cards: pathwayCrimeanWarFlashcards },
  quiz: { questions: pathwayCrimeanWarQuizQuestions },
  peel_response: pathwayCrimeanWarPeelContent,
  confidence_exit_ticket: pathwayCrimeanWarConfidenceContent,
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CrimeanWarActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={crimeanWarPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={fallbackContentByActivityType}
    />
  );
}
