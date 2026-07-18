import '@/lib/unit7RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { fiveYearPlansLesson as lesson } from '@/lib/pathwayUnit7Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Judge industrial achievement against coercion, inefficiency and living standards." fallbackContentByActivityType={lesson.fallbacks}/>;}