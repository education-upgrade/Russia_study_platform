import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { oppositionBefore1905PathwaySlug, oppositionBefore1905Fallbacks } from '@/lib/pathwayOppositionBefore1905Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function OppositionBefore1905ActivityPage({params}:{params:Promise<{activity:string}>}){const{activity}=await params;return <ModularActivityPage pathwaySlug={oppositionBefore1905PathwaySlug} activitySlug={activity} fallbackContentByActivityType={oppositionBefore1905Fallbacks}/>;}