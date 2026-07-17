import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  industryBefore1894PathwaySlug,
  industryBefore1894Fallbacks,
} from '@/lib/pathwayIndustryBefore1894Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function IndustryBefore1894ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={industryBefore1894PathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={industryBefore1894Fallbacks}
    />
  );
}
