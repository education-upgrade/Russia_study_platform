import Link from 'next/link';
import QuizActivity from '@/components/QuizActivity';
import { supabase } from '@/lib/supabase';
import styles from '../../1905/quiz/page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';

const fallbackQuestions = [
  { id: 'tsar-1855', question: 'Who became Tsar of Russia in 1855?', options: ['Alexander II', 'Nicholas II', 'Alexander III', 'Lenin'], correct: 'Alexander II' },
  { id: 'autocracy-definition', question: 'What does autocracy mean?', options: ['Rule by one ruler with ultimate authority', 'Rule by an elected parliament', 'Rule by local councils', 'Rule by trade unions'], correct: 'Rule by one ruler with ultimate authority' },
  { id: 'majority-population', question: 'Which group made up the majority of Russia’s population in 1855?', options: ['Peasants', 'Industrial workers', 'Middle-class liberals', 'Soldiers'], correct: 'Peasants' },
  { id: 'serfdom-definition', question: 'What was serfdom?', options: ['A system tying peasants to landowners', 'A system of elected local government', 'A factory inspection system', 'A military alliance'], correct: 'A system tying peasants to landowners' },
  { id: 'orthodox-role', question: 'How did the Orthodox Church support Tsarism?', options: ['By promoting obedience to the Tsar', 'By organising trade unions', 'By electing the Duma', 'By abolishing serfdom'], correct: 'By promoting obedience to the Tsar' },
  { id: 'size-problem', question: 'Why did Russia’s size make government difficult?', options: ['It made communication and control harder', 'It removed the need for bureaucracy', 'It made all people politically equal', 'It created a fully industrial economy'], correct: 'It made communication and control harder' },
  { id: 'economic-state', question: 'Which phrase best describes Russia’s economy in 1855?', options: ['Mostly rural and agricultural', 'Fully industrialised', 'Based on collectivisation', 'Dominated by service industries'], correct: 'Mostly rural and agricultural' },
  { id: 'bureaucracy-problem', question: 'What was a common problem with the Tsarist bureaucracy?', options: ['It could be slow, inefficient and corrupt', 'It was elected by all peasants', 'It controlled the Tsar', 'It abolished local officials'], correct: 'It could be slow, inefficient and corrupt' },
  { id: 'crimean-war', question: 'Which war exposed Russia’s weakness in the 1850s?', options: ['Crimean War', 'Russo-Japanese War', 'Civil War', 'First World War'], correct: 'Crimean War' },
  { id: 'best-judgement', question: 'Which judgement best explains why Russia was difficult to govern in 1855?', options: ['Several weaknesses reinforced each other', 'Only the Church caused problems', 'Russia was already democratic', 'Industrial workers controlled the state'], correct: 'Several weaknesses reinforced each other' },
];

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.' };

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', LESSON_TITLE)
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? '1855 lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '' };
}

function cleanQuizTitle(title: string | undefined | null) {
  if (!title) return 'Russia in 1855 retrieval';
  return title.replace(/^Retrieval quiz:\s*/i, '').replace(/^Quiz:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuizPage() {
  const { activity, error } = await getActivity('quiz');
  const pageTitle = cleanQuizTitle(activity?.title);
  const savedQuestions = Array.isArray(activity?.content_json?.questions) ? activity.content_json.questions : [];
  const questions = savedQuestions.length >= 10 ? savedQuestions : fallbackQuestions;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1855">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Retrieval quiz</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}

      {activity && (
        <section className={styles.panel}>
          <QuizActivity activityId={activity.id} questions={questions} nextHref="/student/lesson/1855/peel" />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/1855/flashcards">Previous: flashcards</Link>
        <span>Complete the quiz after studying the flashcards.</span>
      </section>
    </main>
  );
}
