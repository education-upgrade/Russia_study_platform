import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  essaySkillsAlexanderIiPathwaySlug,
  essaySkillsAlexanderIiFallbacks,
} from '@/lib/pathwayEssaySkillsAlexanderIiContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EssaySkillsAlexanderIiActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={essaySkillsAlexanderIiPathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={essaySkillsAlexanderIiFallbacks}
    />
  );
}
