import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { foundations1855PathwaySlug } from '@/lib/pathwayFoundations1855Content';
import { pathwayFoundations1855Fallbacks } from '@/lib/pathwayFoundations1855Fallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Foundations1855ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={foundations1855PathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={pathwayFoundations1855Fallbacks}
    />
  );
}
