import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { crimeanWarPathwaySlug } from '@/lib/pathwayCrimeanWarContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CrimeanWarPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={crimeanWarPathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on how defeat in the Crimean War exposed weaknesses in Russian government, society and military organisation."
    />
  );
}
