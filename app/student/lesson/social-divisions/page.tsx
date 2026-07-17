import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  socialDivisionsPathwaySlug,
  socialDivisionsFallbacks,
} from '@/lib/pathwaySocialDivisionsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SocialDivisionsPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={socialDivisionsPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Compare social groups and judge change and continuity by 1894."
      fallbackContentByActivityType={socialDivisionsFallbacks}
    />
  );
}
