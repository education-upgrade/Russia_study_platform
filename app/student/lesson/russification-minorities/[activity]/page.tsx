import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  russificationMinoritiesPathwaySlug,
  russificationMinoritiesFallbacks,
} from '@/lib/pathwayRussificationMinoritiesContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RussificationMinoritiesActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={russificationMinoritiesPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={russificationMinoritiesFallbacks}
    />
  );
}
