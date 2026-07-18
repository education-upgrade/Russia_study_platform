import '@/lib/unit7RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { stalinDictatorshipLesson as lesson } from '@/lib/pathwayUnit7Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Judge the relative importance of institutions, terror, propaganda and participation." fallbackContentByActivityType={lesson.fallbacks}/>;}