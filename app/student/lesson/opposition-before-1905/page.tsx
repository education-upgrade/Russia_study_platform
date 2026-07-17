import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { oppositionBefore1905PathwaySlug, oppositionBefore1905Fallbacks } from '@/lib/pathwayOppositionBefore1905Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function OppositionBefore1905PathwayPage(){return <ModularPathwayPage pathwaySlug={oppositionBefore1905PathwaySlug} fallbackInstructions="Complete the pathway in order. Compare each opposition group by aims, organisation, social reach and methods." fallbackContentByActivityType={oppositionBefore1905Fallbacks}/>;}