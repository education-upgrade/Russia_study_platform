import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { alexanderIIReformPathwaySlug } from '@/lib/pathwayAlexanderIIReformContent';
import { alexanderIIReformFallbacks } from '@/lib/pathwayAlexanderIIReformFallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIReformActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={alexanderIIReformPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={alexanderIIReformFallbacks}
    />
  );
}
