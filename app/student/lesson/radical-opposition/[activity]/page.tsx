import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  radicalOppositionPathwaySlug,
  radicalOppositionFallbacks,
} from '@/lib/pathwayRadicalOppositionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RadicalOppositionActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={radicalOppositionPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={radicalOppositionFallbacks}
    />
  );
}
