import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  ao3ReformReactionOppositionPathwaySlug,
  ao3ReformReactionOppositionFallbacks,
} from '@/lib/pathwayAO3ReformReactionOppositionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AO3ReformReactionOppositionPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={ao3ReformReactionOppositionPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Evaluate each interpretation in isolation using precise contextual knowledge, balanced testing and an explicit judgement."
      fallbackContentByActivityType={ao3ReformReactionOppositionFallbacks}
    />
  );
}
