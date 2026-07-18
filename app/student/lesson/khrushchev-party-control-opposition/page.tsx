import '@/lib/unit9RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {partyControlLesson as lesson} from '@/lib/pathwayUnit9Content';
export const dynamic='force-dynamic';export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Complete the pathway and judge how secure Khrushchev’s political control was." fallbackContentByActivityType={lesson.fallbacks}/>;}
