import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { foundations1855PathwaySlug } from '@/lib/pathwayFoundations1855Content';
import { pathwayFoundations1855Fallbacks } from '@/lib/pathwayFoundations1855Fallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Foundations1855PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={foundations1855PathwaySlug}
      fallbackInstructions="Explore why the Russian Empire appeared powerful in 1855 while containing deep structural weaknesses in government, economy and society. Complete the tasks in order so the platform can identify whether you need chronology recap, causation practice, AO3 support or stretch essay planning."
      fallbackContentByActivityType={pathwayFoundations1855Fallbacks}
    />
  );
}
