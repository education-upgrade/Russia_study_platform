import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import { alexanderIIReformPathwaySlug } from '@/lib/pathwayAlexanderIIReformContent';
import { alexanderIIReformFallbacks } from '@/lib/pathwayAlexanderIIReformFallbacks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AlexanderIIReformLessonPage() {
  return (
    <ModularActivityPage
      pathwaySlug={alexanderIIReformPathwaySlug}
      activitySlug="lesson"
      fallbackContentByActivityType={alexanderIIReformFallbacks}
    />
  );
}
