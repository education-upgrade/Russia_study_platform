import '@/lib/unit7RegistryActivation';
import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {greatTurnLesson as lesson} from '@/lib/pathwayUnit7Content';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function Page(){return <ModularPathwayPage pathwaySlug={lesson.slug} fallbackInstructions="Explain why Stalin ended NEP and judge the causes of the Great Turn." fallbackContentByActivityType={lesson.fallbacks}/>;}