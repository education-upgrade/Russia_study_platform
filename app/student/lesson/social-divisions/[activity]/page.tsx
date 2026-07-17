import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  socialDivisionsPathwaySlug,
  socialDivisionsFallbacks,
} from '@/lib/pathwaySocialDivisionsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SocialDivisionsActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={socialDivisionsPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={socialDivisionsFallbacks}
    />
  );
}
