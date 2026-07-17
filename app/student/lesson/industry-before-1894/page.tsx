import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  industryBefore1894PathwaySlug,
  industryBefore1894Fallbacks,
} from '@/lib/pathwayIndustryBefore1894Content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function IndustryBefore1894PathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={industryBefore1894PathwaySlug}
      fallbackInstructions="Complete the pathway in order. Judge the scale, reach and limits of industrialisation before 1894."
      fallbackContentByActivityType={industryBefore1894Fallbacks}
    />
  );
}
