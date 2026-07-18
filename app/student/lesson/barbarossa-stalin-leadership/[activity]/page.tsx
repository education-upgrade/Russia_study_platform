import '@/lib/unit8RegistryActivation';
import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { barbarossaLeadershipLesson as lesson } from '@/lib/pathwayUnit8Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function Page({params}:{params:Promise<{activity:string}>}){const {activity}=await params;return <ModularActivityPage pathwaySlug={lesson.slug} activitySlug={activity} fallbackContentByActivityType={lesson.fallbacks}/>;}
