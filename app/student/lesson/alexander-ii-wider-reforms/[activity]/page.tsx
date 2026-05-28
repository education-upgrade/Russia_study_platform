import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { alexanderIIWiderReformsPathwaySlug } from '@/lib/pathwayAlexanderIIWiderReformsContent';
import { pathwayAlexanderIIWiderReformsFallbacks } from '@/lib/pathwayAlexanderIIWiderReformsFallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIWiderReformsActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={alexanderIIWiderReformsPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={pathwayAlexanderIIWiderReformsFallbacks}
    />
  );
}
