import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  agricultureLandHungerPathwaySlug,
  agricultureLandHungerFallbacks,
} from '@/lib/pathwayAgricultureLandHungerContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AgricultureLandHungerActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={agricultureLandHungerPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={agricultureLandHungerFallbacks}
    />
  );
}
