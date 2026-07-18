import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {leninIdeologyChangePathwaySlug as slug,leninIdeologyChangeFallbacks as fallbacks} from '@/lib/pathwayLeninIdeologyChangeContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={slug} fallbackInstructions="Complete the pathway in order and judge ideology against pragmatism." fallbackContentByActivityType={fallbacks}/>;}