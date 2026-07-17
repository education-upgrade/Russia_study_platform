import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  laterAlexanderIiPathwaySlug,
  laterAlexanderIiFallbacks,
} from '@/lib/pathwayLaterAlexanderIiContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LaterAlexanderIiActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={laterAlexanderIiPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={laterAlexanderIiFallbacks}
    />
  );
}
