import Link from 'next/link';
import QuizActivity from '@/components/QuizActivity';
import { supabase } from '@/lib/supabase';
import { alexanderIIReformLessonTitle, pathwayAlexanderIIReformQuizQuestions } from '@/lib/pathwayAlexanderIIReformContent';
import styles from '../../1905/quiz/page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', alexanderIIReformLessonTitle)
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? 'Alexander II reform lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '' };
}

function cleanQuizTitle(title: string | undefined | null) {
  if (!title) return 'Alexander II reform retrieval';
  return title.replace(/^Retrieval quiz:\s*/i, '').replace(/^Quiz:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AlexanderIIReformQuizPage() {
  const { activity, error } = await getActivity('quiz');
  const pageTitle = cleanQuizTitle(activity?.title);
  const savedQuestions = Array.isArray(activity?.content_json?.questions) ? activity.content_json.questions : [];
  const questions = savedQuestions.length >= 10 ? savedQuestions : pathwayAlexanderIIReformQuizQuestions;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/alexander-ii-reform">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Retrieval quiz</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && (
        <section className={styles.panel}>
          <QuizActivity activityId={activity.id} questions={questions} />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/alexander-ii-reform/flashcards">Previous: flashcards</Link>
        <span>Complete the quiz after studying the flashcards.</span>
      </section>
    </main>
  );
}
