import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { russiaFirstWorldWarPathwaySlug, russiaFirstWorldWarFallbacks } from '@/lib/pathwayRussiaFirstWorldWarContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params; return <ModularActivityPage pathwaySlug={russiaFirstWorldWarPathwaySlug} activitySlug={activity} fallbackContentByActivityType={russiaFirstWorldWarFallbacks}/>;}