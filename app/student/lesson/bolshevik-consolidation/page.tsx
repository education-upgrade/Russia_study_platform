import '@/lib/unit6RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {bolshevikConsolidationPathwaySlug as slug,bolshevikConsolidationFallbacks as fallbacks} from '@/lib/pathwayBolshevikConsolidationContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and judge how Bolshevik power was consolidated." fallbackContentByActivityType={fallbacks}/>;}