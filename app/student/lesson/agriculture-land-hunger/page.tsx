import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  agricultureLandHungerPathwaySlug,
  agricultureLandHungerFallbacks,
} from '@/lib/pathwayAgricultureLandHungerContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AgricultureLandHungerPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={agricultureLandHungerPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Explain why land, the mir, taxation and low productivity kept rural Russia weak."
      fallbackContentByActivityType={agricultureLandHungerFallbacks}
    />
  );
}
