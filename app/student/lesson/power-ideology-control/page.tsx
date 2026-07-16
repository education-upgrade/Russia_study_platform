import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  powerIdeologyControlPathwaySlug,
  powerIdeologyControlFallbacks,
} from '@/lib/pathwayPowerIdeologyControlContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PowerIdeologyControlPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={powerIdeologyControlPathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on how ideology, administration and repression worked together to sustain Tsarist authority."
      fallbackContentByActivityType={powerIdeologyControlFallbacks}
    />
  );
}
