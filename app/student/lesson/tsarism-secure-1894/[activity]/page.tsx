import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  tsarismSecure1894PathwaySlug,
  tsarismSecure1894Fallbacks,
} from '@/lib/pathwayTsarismSecure1894Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TsarismSecure1894ActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={tsarismSecure1894PathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={tsarismSecure1894Fallbacks}
    />
  );
}
