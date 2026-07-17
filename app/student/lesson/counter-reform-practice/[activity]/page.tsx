import ModularActivityPage from '@/components/pathway/ModularActivityPage';
import {
  counterReformPracticePathwaySlug,
  counterReformPracticeFallbacks,
} from '@/lib/pathwayCounterReformPracticeContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CounterReformPracticeActivityPage({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;

  return (
    <ModularActivityPage
      pathwaySlug={counterReformPracticePathwaySlug}
      activitySlug={activity}
      fallbackContentByActivityType={counterReformPracticeFallbacks}
    />
  );
}
