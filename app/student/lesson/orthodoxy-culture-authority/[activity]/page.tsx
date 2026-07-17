import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  orthodoxyCultureAuthorityPathwaySlug,
  orthodoxyCultureAuthorityFallbacks,
} from '@/lib/pathwayOrthodoxyCultureAuthorityContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrthodoxyCultureAuthorityActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  return (
    <ModularActivityPage
      pathwaySlug={orthodoxyCultureAuthorityPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={orthodoxyCultureAuthorityFallbacks}
    />
  );
}
