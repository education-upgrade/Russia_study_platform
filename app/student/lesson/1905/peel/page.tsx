import Link from 'next/link';
import PeelResponseActivity from '@/components/PeelResponseActivity';
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
    .select('id')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single();

  if (lessonError || !lesson) return { activity: null, error: lessonError?.message ?? '1905 lesson not found.' };

  const { data: activity, error } = await supabase
    .from('activities')
    .select('id, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .eq('activity_type', activityType)
    .single<Activity>();

  return { activity, error: error?.message ?? '' };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PeelPage() {
  const { activity, error } = await getActivity('peel_response');
  const content = activity?.content_json ?? {};

  return (
    <main className="page-shell activity-focus-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">1905 pathway / PEEL response</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/lesson/1905">Back to pathway</Link>
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
        </div>
      </div>

      <section className="activity-focus-hero teal">
        <div>
          <p className="eyebrow">Focused activity screen</p>
          <h1>{activity?.title ?? '1905 PEEL response'}</h1>
          <p>Use Point, Evidence, Explain and Link judgement to turn your 1905 knowledge into exam-ready analysis.</p>
        </div>
        <aside className="activity-focus-meta">
          <span className="badge">{activity?.estimated_minutes ?? 15} mins</span>
          <span className="badge">{activity?.skill_focus ?? 'AO1 explanation'}</span>
          {activity?.difficulty && <span className="badge">{activity.difficulty}</span>}
        </aside>
      </section>

      {error && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity not available</h2>
          <p>{error}</p>
        </section>
      )}

      {activity && (
        <section className="activity-focus-card">
          <PeelResponseActivity
            activityId={activity.id}
            question={content.question ?? 'Write a PEEL response.'}
            stretchQuestion={content.stretchQuestion}
            scaffold={Array.isArray(content.scaffold) ? content.scaffold : undefined}
          />
        </section>
      )}

      <section className="activity-bottom-nav">
        <Link className="button secondary" href="/student/lesson/1905/flashcards">Previous: flashcards</Link>
        <Link className="button" href="/student/lesson/1905/confidence">Next: confidence check</Link>
      </section>
    </main>
  );
}
