import Link from 'next/link';
import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
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

export default async function ConfidencePage() {
  const { activity, error } = await getActivity('confidence_exit_ticket');
  const content = activity?.content_json ?? {};

  return (
    <main className="page-shell activity-focus-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">1905 pathway / Confidence check</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/lesson/1905">Back to pathway</Link>
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
        </div>
      </div>

      <section className="activity-focus-hero lavender">
        <div>
          <p className="eyebrow">Final reflection</p>
          <h1>{activity?.title ?? '1905 confidence check'}</h1>
          <p>Finish with a quick confidence check so your teacher can see what feels secure and what still needs support.</p>
        </div>
        <aside className="activity-focus-meta">
          <span className="badge">{activity?.estimated_minutes ?? 5} mins</span>
          <span className="badge">{activity?.skill_focus ?? 'Reflection'}</span>
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
        <section className="activity-focus-card compact-activity-card">
          <ConfidenceExitTicketActivity
            activityId={activity.id}
            prompt={content.prompt ?? 'How confident are you with this topic?'}
            scale={Array.isArray(content.scale) ? content.scale : undefined}
            leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : undefined}
          />
        </section>
      )}

      <section className="activity-bottom-nav">
        <Link className="button secondary" href="/student/lesson/1905/peel">Previous: PEEL response</Link>
        <Link className="button" href="/student/lesson/1905">Return to pathway</Link>
      </section>
    </main>
  );
}
