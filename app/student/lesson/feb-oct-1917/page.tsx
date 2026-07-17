import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { februaryToOctoberPathwaySlug, februaryToOctoberFallbacks } from '@/lib/pathwayFebruaryToOctoberContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={februaryToOctoberPathwaySlug} fallbackInstructions="Complete the pathway in order and compare Provisional Government failures with Bolshevik strengths." fallbackContentByActivityType={februaryToOctoberFallbacks}/>;}