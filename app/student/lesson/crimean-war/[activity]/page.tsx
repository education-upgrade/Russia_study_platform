import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { crimeanWarPathwaySlug } from '@/lib/pathwayCrimeanWarContent';
import { pathwayCrimeanWarFallbacks } from '@/lib/pathwayCrimeanWarFallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CrimeanWarActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={crimeanWarPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={pathwayCrimeanWarFallbacks}
    />
  );
}
