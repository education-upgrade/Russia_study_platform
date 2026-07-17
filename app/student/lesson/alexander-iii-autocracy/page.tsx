import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  alexanderIiiAutocracyPathwaySlug,
  alexanderIiiAutocracyFallbacks,
} from '@/lib/pathwayAlexanderIiiAutocracyContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AlexanderIiiAutocracyPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={alexanderIiiAutocracyPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Focus on how ideology, repression and selective continuity strengthened autocracy under Alexander III, while testing the long-term limits of his approach."
      fallbackContentByActivityType={alexanderIiiAutocracyFallbacks}
    />
  );
}
