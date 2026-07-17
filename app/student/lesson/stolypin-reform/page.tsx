import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import { stolypinReformPathwaySlug, stolypinReformFallbacks } from '@/lib/pathwayStolypinReformContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default function StolypinReformPathwayPage(){return <ModularPathwayPage pathwaySlug={stolypinReformPathwaySlug} fallbackInstructions="Complete the pathway in order. Judge Stolypin by comparing immediate order, rural reform and political change." fallbackContentByActivityType={stolypinReformFallbacks}/>;}