import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { alexanderIIWiderReformsPathwaySlug } from '@/lib/pathwayAlexanderIIWiderReformsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AlexanderIIWiderReformsPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={alexanderIIWiderReformsPathwaySlug}
      fallbackInstructions="Judge how far Alexander II modernised Russia through wider reform while preserving autocracy."
    />
  );
}
