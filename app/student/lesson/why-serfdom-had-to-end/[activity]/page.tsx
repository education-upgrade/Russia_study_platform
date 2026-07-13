import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { whySerfdomPathwaySlug, whySerfdomFallbacks } from '@/lib/pathwayWhySerfdomHadToEndContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WhySerfdomActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={whySerfdomPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={whySerfdomFallbacks}
    />
  );
}
