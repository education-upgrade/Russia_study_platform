import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  ideasChallengedTsarismPathwaySlug,
  ideasChallengedTsarismFallbacks,
} from '@/lib/pathwayIdeasChallengedTsarismContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function IdeasChallengedTsarismActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={ideasChallengedTsarismPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={ideasChallengedTsarismFallbacks}
    />
  );
}
