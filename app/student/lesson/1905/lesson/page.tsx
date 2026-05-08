import Link from 'next/link';
import LessonChunkActivity from '@/components/LessonChunkActivity';
import { supabase } from '@/lib/supabase';
import { pathway1905LessonSections } from '@/lib/pathway1905Content';
import styles from './page.module.css';

type Activity = {
  id: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

async function getActivity(activityType: string) {
  if (!supabase) return { activity: null, error: 'Supabase is not configured.', enquiry: null };

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, enquiry_question')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? '1905 lesson not found.', enquiry: null };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '', enquiry: lesson.enquiry_question as string | null };
}

function cleanLessonTitle(title: string | undefined | null) {
  if (!title) return '1905 Revolution';
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
  const sections = savedSections.length >= 6 ? savedSections : pathway1905LessonSections;
  const pageTitle = cleanLessonTitle(activity?.title);

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} href="/student/lesson/1905">← Pathway</Link>
        <div className={styles.titleBlock}>
          <p>Chunked lesson</p>
          <h1>{pageTitle}</h1>
        </div>
        <Link className={styles.dashboardLink} href="/student/dashboard">Dashboard</Link>
      </div>

      <section className={styles.panel}>
        {error && (
          <div className={styles.error}>
            <strong>Activity not available:</strong> {error}
          </div>
        )}

        {activity ? (
          <LessonChunkActivity
            activityId={activity.id}
            title={pageTitle}
            enquiry={enquiry ?? 'Use these notes to build the core narrative before completing the evidence tasks.'}
            sections={sections}
            estimatedMinutes={activity.estimated_minutes ?? 12}
            skillFocus={activity.skill_focus ?? 'AO1 contextual understanding'}
            difficulty={activity.difficulty ?? 'secure'}
          />
        ) : (
          <article className={styles.fallbackCard}>
            <h2>{pageTitle}</h2>
            <p>The lesson activity could not be loaded yet. Return to the pathway and try again.</p>
            <Link className={styles.primaryButton} href="/student/lesson/1905">Return to pathway</Link>
          </article>
        )}
      </section>
    </main>
  );
}
