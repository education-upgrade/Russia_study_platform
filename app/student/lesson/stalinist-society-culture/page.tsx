import '@/lib/unit7RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { societyCultureLesson as lesson } from '@/lib/pathwayUnit7Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Assess opportunity, control and continuity across Stalinist society and culture." fallbackContentByActivityType={lesson.fallbacks}/>;}