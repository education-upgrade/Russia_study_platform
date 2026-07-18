import '@/lib/unit9RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {successionLesson as lesson} from '@/lib/pathwayUnit9Content';
export const dynamic='force-dynamic';export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Complete the pathway and judge why Khrushchev emerged as leader." fallbackContentByActivityType={lesson.fallbacks}/>;}
