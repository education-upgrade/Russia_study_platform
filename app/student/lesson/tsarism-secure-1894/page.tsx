import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  tsarismSecure1894PathwaySlug,
  tsarismSecure1894Fallbacks,
} from '@/lib/pathwayTsarismSecure1894Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TsarismSecure1894PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={tsarismSecure1894PathwaySlug}
      fallbackInstructions="Complete the pathway in order. Build a synoptic judgement that distinguishes immediate security from structural weakness."
      fallbackContentByActivityType={tsarismSecure1894Fallbacks}
    />
  );
}
