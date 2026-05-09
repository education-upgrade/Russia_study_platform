import Link from 'next/link';
import FlashcardActivity from '@/components/FlashcardActivity';
import { supabase } from '@/lib/supabase';
import styles from '../../1905/flashcards/page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';

const fallbackCards = [
  { id: 'autocracy', front: 'Autocracy', back: 'A system where the Tsar held ultimate political authority and was not answerable to an elected parliament.' },
  { id: 'alexander-ii', front: 'Alexander II', back: 'Tsar from 1855 to 1881 who inherited a backward empire and introduced major reforms.' },
  { id: 'serfdom', front: 'Serfdom', back: 'A system tying peasants to landowners, restricting freedom and labour mobility.' },
  { id: 'orthodoxy', front: 'Orthodoxy', back: 'The Russian Orthodox Church supported Tsarist authority and encouraged obedience.' },
  { id: 'crimean-war', front: 'Crimean War', back: 'The 1853–56 war that exposed Russia’s military, transport and administrative weaknesses.' },
  { id: 'bureaucracy', front: 'Bureaucracy', back: 'The officials who governed Russia; often slow, inefficient and corrupt.' },
  { id: 'economic-backwardness', front: 'Economic backwardness', back: 'Russia had limited industry, weak transport and low agricultural productivity compared with Western powers.' },
  { id: 'multi-national-empire', front: 'Multi-national empire', back: 'Russia contained many nationalities, languages and religions, making control difficult.' },
  { id: 'nobility', front: 'Nobility', back: 'The landowning elite who held status and influence and often relied on serf labour.' },
  { id: 'peasantry', front: 'Peasantry', back: 'The majority of the population, mostly rural and poor.' },
  { id: 'weak-transport', front: 'Weak transport', back: 'Poor roads and limited railways made communication, trade and military movement difficult.' },
  { id: 'judgement', front: 'Overall judgement', back: 'Russia was difficult to govern because size, autocracy, serfdom, backwardness and weak administration reinforced each other.' },
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

function cleanFlashcardTitle(title: string | undefined | null) {
  if (!title) return 'Russia in 1855 key knowledge';
  return title.replace(/^Flashcards:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FlashcardsPage() {
  const { activity, error } = await getActivity('flashcards');
  const pageTitle = cleanFlashcardTitle(activity?.title);
  const savedCards = Array.isArray(activity?.content_json?.cards) ? activity.content_json.cards : [];
  const cards = savedCards.length >= 10 ? savedCards : fallbackCards;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1855">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Recall deck</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}

      {activity && (
        <section className={styles.panel}>
          <FlashcardActivity activityId={activity.id} cards={cards} nextHref="/student/lesson/1855/quiz" />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/1855/lesson">Previous: lesson notes</Link>
        <span>Study the deck before completing the quiz.</span>
      </section>
    </main>
  );
}
