import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  emancipationSerfsPathwaySlug,
  pathwayEmancipationSerfsFallbacks,
} from '@/lib/pathwayEmancipationSerfsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EmancipationSerfsPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={emancipationSerfsPathwaySlug}
      fallbackInstructions="Complete one task at a time. Focus on whether emancipation improved legal status more than living standards."
      fallbackContentByActivityType={pathwayEmancipationSerfsFallbacks}
    />
  );
}
