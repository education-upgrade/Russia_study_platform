import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { februaryRevolutionPathwaySlug, februaryRevolutionFallbacks } from '@/lib/pathwayFebruaryRevolutionContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params; return <ModularActivityPage pathwaySlug={februaryRevolutionPathwaySlug} activitySlug={activity} fallbackContentByActivityType={februaryRevolutionFallbacks}/>;}