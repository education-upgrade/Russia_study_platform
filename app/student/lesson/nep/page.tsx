import '@/lib/unit6RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {nepPathwaySlug as slug,nepFallbacks as fallbacks} from '@/lib/pathwayNepContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and evaluate recovery against compromise." fallbackContentByActivityType={fallbacks}/>;}