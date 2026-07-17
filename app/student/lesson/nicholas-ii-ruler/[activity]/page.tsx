import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { nicholasIIRulerPathwaySlug, nicholasIIRulerFallbacks } from '@/lib/pathwayNicholasIIRulerContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function NicholasIIRulerActivityPage({params}:{params:Promise<{activity:string}>}){const{activity}=await params;return <ModularActivityPage pathwaySlug={nicholasIIRulerPathwaySlug} activitySlug={activity} fallbackContentByActivityType={nicholasIIRulerFallbacks}/>;}