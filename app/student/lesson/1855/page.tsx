import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { foundations1855PathwaySlug } from '@/lib/pathwayFoundations1855Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Foundations1855PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={foundations1855PathwaySlug}
      fallbackInstructions="Explore why the Russian Empire appeared powerful in 1855 while containing deep structural weaknesses in government, economy and society."
    />
  );
}
