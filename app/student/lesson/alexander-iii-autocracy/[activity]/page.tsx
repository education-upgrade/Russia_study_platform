import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  alexanderIiiAutocracyPathwaySlug,
  alexanderIiiAutocracyFallbacks,
} from '@/lib/pathwayAlexanderIiiAutocracyContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIiiAutocracyActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={alexanderIiiAutocracyPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={alexanderIiiAutocracyFallbacks}
    />
  );
}
