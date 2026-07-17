import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { februaryRevolutionPathwaySlug, februaryRevolutionFallbacks } from '@/lib/pathwayFebruaryRevolutionContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={februaryRevolutionPathwaySlug} fallbackInstructions="Complete the pathway in order and explain why protest became revolution and the army abandoned the regime." fallbackContentByActivityType={februaryRevolutionFallbacks}/>;}