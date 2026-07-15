import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { pathway1905PathwaySlug } from '@/lib/pathway1905ExtendedContent';
import { pathway1905Fallbacks } from '@/lib/pathway1905Fallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Revolution1905PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={pathway1905PathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on why the revolution weakened Tsarism but failed to overthrow it."
      fallbackContentByActivityType={pathway1905Fallbacks}
    />
  );
}
