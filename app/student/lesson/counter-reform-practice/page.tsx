import ModularPathwayPage from '@/components/pathway/ModularPathwayPage';
import {
  counterReformPracticePathwaySlug,
  counterReformPracticeFallbacks,
} from '@/lib/pathwayCounterReformPracticeContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CounterReformPracticePathwayPage() {
  return (
    <ModularPathwayPage
      pathwaySlug={counterReformPracticePathwaySlug}
      fallbackInstructions="Complete the pathway in order. Link each counter-reform to the regime’s aim of strengthening autocracy, then test whether it created durable security or only tighter short-term control."
      fallbackContentByActivityType={counterReformPracticeFallbacks}
    />
  );
}
