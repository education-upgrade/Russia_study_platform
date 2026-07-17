import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { stolypinReformPathwaySlug, stolypinReformFallbacks } from '@/lib/pathwayStolypinReformContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function StolypinReformActivityPage({params}:{params:Promise<{activity:string}>}){const{activity}=await params;return <ModularActivityPage pathwaySlug={stolypinReformPathwaySlug} activitySlug={activity} fallbackContentByActivityType={stolypinReformFallbacks}/>;}