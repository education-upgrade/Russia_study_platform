import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  emancipationSerfsPathwaySlug,
  pathwayEmancipationSerfsFallbacks,
} from '@/lib/pathwayEmancipationSerfsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmancipationSerfsActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={emancipationSerfsPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={pathwayEmancipationSerfsFallbacks}
    />
  );
}
