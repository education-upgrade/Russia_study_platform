import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { russiaFirstWorldWarPathwaySlug, russiaFirstWorldWarFallbacks } from '@/lib/pathwayRussiaFirstWorldWarContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={russiaFirstWorldWarPathwaySlug} fallbackInstructions="Complete the pathway in order and explain how war exposed and intensified Tsarist weakness." fallbackContentByActivityType={russiaFirstWorldWarFallbacks}/>;}