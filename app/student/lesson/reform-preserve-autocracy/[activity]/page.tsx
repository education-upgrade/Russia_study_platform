import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  reformPreserveAutocracyPathwaySlug,
  reformPreserveAutocracyFallbacks,
} from '@/lib/pathwayReformPreserveAutocracyContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReformPreserveAutocracyActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={reformPreserveAutocracyPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={reformPreserveAutocracyFallbacks}
    />
  );
}
