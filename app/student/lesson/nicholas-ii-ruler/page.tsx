import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { nicholasIIRulerPathwaySlug, nicholasIIRulerFallbacks } from '@/lib/pathwayNicholasIIRulerContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function NicholasIIRulerPathwayPage(){return <ModularPathwayPage pathwaySlug={nicholasIIRulerPathwaySlug} fallbackInstructions="Complete the pathway in order. Judge Nicholas II by balancing personal leadership against inherited structural pressures." fallbackContentByActivityType={nicholasIIRulerFallbacks}/>;}