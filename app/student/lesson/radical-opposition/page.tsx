import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  radicalOppositionPathwaySlug,
  radicalOppositionFallbacks,
} from '@/lib/pathwayRadicalOppositionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RadicalOppositionPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={radicalOppositionPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Focus on why radical opposition remained weak before 1894 while still creating important long-term threats to Tsarism."
      fallbackContentByActivityType={radicalOppositionFallbacks}
    />
  );
}
