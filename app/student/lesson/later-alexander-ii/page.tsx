import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  laterAlexanderIiPathwaySlug,
  laterAlexanderIiFallbacks,
} from '@/lib/pathwayLaterAlexanderIiContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LaterAlexanderIiPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={laterAlexanderIiPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Focus on why reform became more defensive after 1866, how revolutionary opposition developed and why Alexander II was assassinated in 1881."
      fallbackContentByActivityType={laterAlexanderIiFallbacks}
    />
  );
}
