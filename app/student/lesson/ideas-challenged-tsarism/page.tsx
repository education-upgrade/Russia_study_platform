import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  ideasChallengedTsarismPathwaySlug,
  ideasChallengedTsarismFallbacks,
} from '@/lib/pathwayIdeasChallengedTsarismContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function IdeasChallengedTsarismPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={ideasChallengedTsarismPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Compare the aims, methods, support and effectiveness of liberalism, populism and Marxism before 1894."
      fallbackContentByActivityType={ideasChallengedTsarismFallbacks}
    />
  );
}
