import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  russificationMinoritiesPathwaySlug,
  russificationMinoritiesFallbacks,
} from '@/lib/pathwayRussificationMinoritiesContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RussificationMinoritiesPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={russificationMinoritiesPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Focus on how Russification increased central control while creating resentment among national and religious minorities."
      fallbackContentByActivityType={russificationMinoritiesFallbacks}
    />
  );
}
