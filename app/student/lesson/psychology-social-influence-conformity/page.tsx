import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  psychologyConformityFallbacks,
  psychologyConformityPathwaySlug,
} from '@/subjects/psychology-aqa/content/conformity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PsychologyConformityPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={psychologyConformityPathwaySlug}
      fallbackInstructions="Work through the pathway in order. Secure the distinction between types and explanations of conformity before applying Asch's variables and writing an evaluation response."
      fallbackContentByActivityType={psychologyConformityFallbacks}
    />
  );
}
