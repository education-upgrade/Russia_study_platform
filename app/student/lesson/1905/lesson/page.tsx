import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LessonNotesPage() {
  const { activity, error, enquiry } = await getActivity('lesson_content');
  const sections = Array.isArray(activity?.content_json?.sections) ? activity?.content_json.sections : [];

  return (
    <main className="page-shell activity-focus-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">1905 pathway / Lesson notes</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/lesson/1905">Back to pathway</Link>
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
        </div>
      </div>

      <section className="activity-focus-hero teal">
        <div>
          <p className="eyebrow">Optional support screen</p>
          <h1>{activity?.title ?? '1905 lesson notes'}</h1>
          <p>{enquiry ?? 'Use these notes to build the core narrative before completing the evidence tasks.'}</p>
        </div>
        <aside className="activity-focus-meta">
          <span className="badge">{activity?.estimated_minutes ?? 15} mins</span>
          <span className="badge">{activity?.skill_focus ?? 'Core knowledge'}</span>
          {activity?.difficulty && <span className="badge">{activity.difficulty}</span>}
        </aside>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {sections.length > 0 && (
        <section className="activity-focus-card">
          <div className="lesson-section-grid improved">
            {sections.map((section: { heading: string; body: string }, sectionIndex: number) => (
              <section className="panel lesson-note" key={section.heading}>
                <span className="note-number">{sectionIndex + 1}</span>
                <p className="eyebrow">Core explanation</p>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </section>
      )}

      <section className="activity-bottom-nav">
        <Link className="button secondary" href="/student/lesson/1905">Return to pathway</Link>
        <Link className="button" href="/student/lesson/1905/quiz">Next: retrieval quiz</Link>
      </section>
    </main>
  );
}
