import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { whySerfdomPathwaySlug, whySerfdomFallbacks } from '@/lib/pathwayWhySerfdomHadToEndContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function WhySerfdomHadToEndPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={whySerfdomPathwaySlug}
      fallbackInstructions="Complete the pathway one task at a time. Focus on why military, economic, social and political pressures made serfdom difficult to preserve."
      fallbackContentByActivityType={whySerfdomFallbacks}
    />
  );
}
