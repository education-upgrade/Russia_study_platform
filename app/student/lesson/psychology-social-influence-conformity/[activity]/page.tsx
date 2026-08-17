import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  psychologyConformityFallbacks,
  psychologyConformityPathwaySlug,
} from '@/subjects/psychology-aqa/content/conformity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PsychologyConformityActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={psychologyConformityPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={psychologyConformityFallbacks}
    />
  );
}
