import Link from 'next/link';
import LessonChunkActivity from '@/components/LessonChunkActivity';
import { supabase } from '@/lib/supabase';
import styles from '../../1905/lesson/page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

const LESSON_TITLE = 'Why was Russia difficult to govern in 1855?';
const FALLBACK_SECTIONS = [
  {
    title: 'Autocracy and personal rule',
    content: 'In 1855 Russia was ruled by an autocratic Tsar. Alexander II inherited a system where political authority was concentrated in the monarch, with limited representative institutions and heavy reliance on ministers, officials, the army and the Church.',
    checkQuestion: 'Why did autocracy make Russia difficult to govern effectively?',
  },
  {
    title: 'A vast and diverse empire',
    content: 'Russia was enormous, stretching across Europe and Asia. Its size, poor communications and ethnic diversity made it difficult for the central state to control local areas consistently.',
    checkQuestion: 'How did geography and diversity create problems for central control?',
  },
  {
    title: 'A mainly peasant society',
    content: 'Most Russians were peasants and many were still tied to the land through serfdom. This created economic backwardness, social tension and limits on modernisation.',
    checkQuestion: 'Why was serfdom a problem for Russia in 1855?',
  },
  {
    title: 'Economic and military weakness',
    content: 'The Crimean War exposed weaknesses in transport, industry, administration and military organisation. Russia appeared powerful but lacked the infrastructure and industrial base of more modern European states.',
    checkQuestion: 'What did the Crimean War reveal about Russia?',
  },
  {
    title: 'Pressure for reform',
    content: 'By 1855 the Tsarist state faced pressure to reform, but reform was risky because change could weaken autocratic control. This tension shaped Alexander II’s reign.',
    checkQuestion: 'Why was reform both necessary and dangerous for the Tsar?',
  },
];

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.', enquiry: null };

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, enquiry_question')
    .eq('title', LESSON_TITLE)
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? '1855 lesson not found.', enquiry: null };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '', enquiry: lesson.enquiry_question as string | null };
}

function cleanLessonTitle(title: string | undefined | null) {
  if (!title) return 'Russia in 1855';
  return title
    .replace(/^Lesson introduction:\s*/i, '')
    .replace(/^Lesson notes:\s*/i, '')
    .replace(/^Introduction:\s*/i, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LessonNotesPage() {
  const { activity, error, enquiry } = await getActivity('lesson_content');
  const savedSections = Array.isArray(activity?.content_json?.sections) ? activity?.content_json.sections : [];
  const sections = savedSections.length >= 3 ? savedSections : FALLBACK_SECTIONS;
  const pageTitle = cleanLessonTitle(activity?.title);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1855">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Chunked lesson</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      <section className={styles.panel}>
        {error && <div className={styles.error}><strong>Activity not available:</strong> {error}</div>}

        {activity ? (
          <LessonChunkActivity
            activityId={activity.id}
            title={pageTitle}
            enquiry={enquiry ?? 'Use these notes to understand why Russia was difficult to govern in 1855.'}
            sections={sections}
            estimatedMinutes={activity.estimated_minutes ?? 12}
            skillFocus={activity.skill_focus ?? 'AO1 contextual understanding'}
            difficulty={activity.difficulty ?? 'secure'}
          />
        ) : (
          <article className={styles.fallbackCard}>
            <h2>{pageTitle}</h2>
            <p>The lesson activity could not be loaded yet. Return to the pathway and try again.</p>
            <Link className={styles.primaryButton} href="/student/lesson/1855">Return to pathway</Link>
          </article>
        )}
      </section>
    </main>
  );
}
