import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { pathway1905PathwaySlug } from '@/lib/pathway1905ExtendedContent';
import { pathway1905Fallbacks } from '@/lib/pathway1905Fallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Revolution1905ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={pathway1905PathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={pathway1905Fallbacks}
    />
  );
}
