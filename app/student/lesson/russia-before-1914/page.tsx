import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { russiaBefore1914PathwaySlug, russiaBefore1914Fallbacks } from '@/lib/pathwayRussiaBefore1914Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={russiaBefore1914PathwaySlug} fallbackInstructions="Complete the pathway in order and judge how stable Tsarism was before war." fallbackContentByActivityType={russiaBefore1914Fallbacks}/>;}