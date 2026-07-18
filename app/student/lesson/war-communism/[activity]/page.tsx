import '@/lib/unit6RegistryActivation';
import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {warCommunismPathwaySlug as slug,warCommunismFallbacks as fallbacks} from '@/lib/pathwayWarCommunismContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params;return <ModularActivityPage pathwaySlug={slug} activitySlug={activity} fallbackContentByActivityType={fallbacks}/>;}