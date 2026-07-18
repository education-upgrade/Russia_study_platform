import '@/lib/unit6RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {civilWarPathwaySlug as slug,civilWarFallbacks as fallbacks} from '@/lib/pathwayCivilWarContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and explain Red victory comparatively." fallbackContentByActivityType={fallbacks}/>;}