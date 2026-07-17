import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { februaryToOctoberPathwaySlug, februaryToOctoberFallbacks } from '@/lib/pathwayFebruaryToOctoberContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params; return <ModularActivityPage pathwaySlug={februaryToOctoberPathwaySlug} activitySlug={activity} fallbackContentByActivityType={februaryToOctoberFallbacks}/>;}