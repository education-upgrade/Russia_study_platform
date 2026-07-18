import '@/lib/unit7RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { collectivisationLesson as lesson } from '@/lib/pathwayUnit7Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Evaluate collectivisation as political success, economic policy and human catastrophe." fallbackContentByActivityType={lesson.fallbacks}/>;}