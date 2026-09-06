import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { alexanderIIReformPathwaySlug } from '@/lib/pathwayAlexanderIIReformContent';
import { alexanderIIReformFallbacks } from '@/lib/pathwayAlexanderIIReformFallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AlexanderIIReformPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={alexanderIIReformPathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on why reform became necessary after 1855 and how Alexander II hoped reform would strengthen autocracy."
      fallbackContentByActivityType={alexanderIIReformFallbacks}
    />
  );
}
