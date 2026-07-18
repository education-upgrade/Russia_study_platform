import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {warCommunismPathwaySlug as slug,warCommunismFallbacks as fallbacks} from '@/lib/pathwayWarCommunismContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and evaluate military, economic and political outcomes." fallbackContentByActivityType={fallbacks}/>;}