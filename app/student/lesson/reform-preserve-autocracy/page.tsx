import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  reformPreserveAutocracyPathwaySlug,
  reformPreserveAutocracyFallbacks,
} from '@/lib/pathwayReformPreserveAutocracyContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ReformPreserveAutocracyPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={reformPreserveAutocracyPathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on whether reform modernised Russia while preserving the Tsar’s supreme authority."
      fallbackContentByActivityType={reformPreserveAutocracyFallbacks}
    />
  );
}
