import Link from 'next/link';
import PeelResponseActivity from '@/components/PeelResponseActivity';
import { supabase } from '@/lib/supabase';
import styles from '../../1905/peel/page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';
const fallbackPeelContent = {
  question: 'Explain one reason why Russia was difficult to govern in 1855.',
  stretchQuestion: 'How important was autocracy in explaining the difficulties of governing Russia in 1855?',
  scaffold: [
    'Point: identify one clear reason Russia was difficult to govern, such as size, autocracy, serfdom, backwardness or bureaucracy.',
    'Evidence: use precise evidence such as serfdom, weak transport, the Orthodox Church, the nobility or the Crimean War.',
    'Explain: show how this made government, reform or control more difficult.',
    'Link: judge why this reason was significant in 1855.',
  ],
};

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

function cleanPeelTitle(title: string | undefined | null) {
  if (!title) return 'Russia in 1855 writing practice';
  return title.replace(/^PEEL response:\s*/i, '').replace(/^PEEL:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PeelPage() {
  const { activity, error } = await getActivity('peel_response');
  const content = activity?.content_json ?? {};
  const pageTitle = cleanPeelTitle(activity?.title);
  const scaffold = Array.isArray(content.scaffold) ? content.scaffold : fallbackPeelContent.scaffold;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1855">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Writing task</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      {error && <section className="card warm" style={{ marginTop: 24 }}><h2>Activity not available</h2><p>{error}</p></section>}

      {activity && (
        <section className={styles.panel}>
          <PeelResponseActivity
            activityId={activity.id}
            question={content.question ?? fallbackPeelContent.question}
            stretchQuestion={content.stretchQuestion ?? fallbackPeelContent.stretchQuestion}
            scaffold={scaffold}
          />
        </section>
      )}

      <section className={styles.footer}>
        <Link href="/student/lesson/1855/quiz">Previous: quiz</Link>
        <span>Submit the PEEL response before completing the confidence check.</span>
      </section>
    </main>
  );
}
