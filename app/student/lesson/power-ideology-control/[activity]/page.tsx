import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  powerIdeologyControlPathwaySlug,
  powerIdeologyControlFallbacks,
} from '@/lib/pathwayPowerIdeologyControlContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PowerIdeologyControlActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={powerIdeologyControlPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={powerIdeologyControlFallbacks}
    />
  );
}
