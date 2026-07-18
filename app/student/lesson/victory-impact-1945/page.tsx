import '@/lib/unit8RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { impactVictoryLesson as lesson } from '@/lib/pathwayUnit8Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Complete the pathway in order and assess political, social, economic and international consequences separately." fallbackContentByActivityType={lesson.fallbacks}/>;}
