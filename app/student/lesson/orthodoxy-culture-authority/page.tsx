import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  orthodoxyCultureAuthorityPathwaySlug,
  orthodoxyCultureAuthorityFallbacks,
} from '@/lib/pathwayOrthodoxyCultureAuthorityContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function OrthodoxyCultureAuthorityPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={orthodoxyCultureAuthorityPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Judge how far Orthodoxy, education, censorship and traditional culture sustained autocracy."
      fallbackContentByActivityType={orthodoxyCultureAuthorityFallbacks}
    />
  );
}
