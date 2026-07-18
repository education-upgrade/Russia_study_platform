import '@/lib/unit6RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {struggleAfterLeninPathwaySlug as slug,struggleAfterLeninFallbacks as fallbacks} from '@/lib/pathwayStruggleAfterLeninContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and explain Stalin’s victory comparatively." fallbackContentByActivityType={fallbacks}/>;}