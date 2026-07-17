import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { manifestoFundamentalLawsPathwaySlug, manifestoFundamentalLawsFallbacks } from '@/lib/pathwayManifestoFundamentalLawsContent';
export const dynamic='force-dynamic'; export const revalidate=0;
export default async function ManifestoFundamentalLawsActivityPage({params}:{params:Promise<{activity:string}>}){const{activity}=await params;return <ModularActivityPage pathwaySlug={manifestoFundamentalLawsPathwaySlug} activitySlug={activity} fallbackContentByActivityType={manifestoFundamentalLawsFallbacks}/>;}