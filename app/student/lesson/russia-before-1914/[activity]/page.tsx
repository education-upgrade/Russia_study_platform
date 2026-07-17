import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { russiaBefore1914PathwaySlug, russiaBefore1914Fallbacks } from '@/lib/pathwayRussiaBefore1914Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params; return <ModularActivityPage pathwaySlug={russiaBefore1914PathwaySlug} activitySlug={activity} fallbackContentByActivityType={russiaBefore1914Fallbacks}/>;}