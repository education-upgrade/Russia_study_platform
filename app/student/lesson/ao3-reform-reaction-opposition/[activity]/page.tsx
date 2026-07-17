import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  ao3ReformReactionOppositionPathwaySlug,
  ao3ReformReactionOppositionFallbacks,
} from '@/lib/pathwayAO3ReformReactionOppositionContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AO3ReformReactionOppositionActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={ao3ReformReactionOppositionPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={ao3ReformReactionOppositionFallbacks}
    />
  );
}
