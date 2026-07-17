import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  essaySkillsAlexanderIiPathwaySlug,
  essaySkillsAlexanderIiFallbacks,
} from '@/lib/pathwayEssaySkillsAlexanderIiContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EssaySkillsAlexanderIiPathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={essaySkillsAlexanderIiPathwaySlug}
      fallbackInstructions="Complete the pathway in order. Focus on turning precise Alexander II knowledge into comparison, sustained judgement and a focused 25-mark argument."
      fallbackContentByActivityType={essaySkillsAlexanderIiFallbacks}
    />
  );
}
