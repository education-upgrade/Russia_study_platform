import QuizActivity from '@/components/QuizActivity';
import { supabase } from '@/lib/supabase';

type Activity = {
  id: string;
  activity_type: string;
  title: string;
  skill_focus: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  content_json: any;
};

type Lesson = {
  id: string;
  title: string;
  enquiry_question: string | null;
  estimated_minutes: number | null;
};

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const content = activity.content_json ?? {};

  return (
    <article className="card" style={{ marginTop: 18 }}>
      <p className="eyebrow">Step {index + 1} · {activity.activity_type.replaceAll('_', ' ')}</p>
      <h2>{activity.title}</h2>
      <p>
        <strong>Skill focus:</strong> {activity.skill_focus ?? 'Not specified'} ·{' '}
        <strong>Time:</strong> {activity.estimated_minutes ?? '?'} minutes
      </p>

      {activity.activity_type === 'lesson_content' && Array.isArray(content.sections) && (
        <div className="grid">
          {content.sections.map((section: { heading: string; body: string }) => (
            <section className="card teal" key={section.heading}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      )}

      {activity.activity_type === 'quiz' && Array.isArray(content.questions) && (
        <QuizActivity activityId={activity.id} questions={content.questions} />
      )}

      {activity.activity_type === 'flashcards' && Array.isArray(content.cards) && (
        <div className="grid">
          {content.cards.map((card: any) => (
            <section className="card warm" key={card.id ?? card.front}>
              <p className="eyebrow">Flashcard</p>
              <h3>{card.front}</h3>
              <p>{card.back}</p>
            </section>
          ))}
        </div>
      )}

      {activity.activity_type === 'peel_response' && (
        <div className="card teal" style={{ marginTop: 12 }}>
          <p className="eyebrow">Written practice</p>
          <h3>{content.question}</h3>
          {content.stretchQuestion && <p><strong>Stretch:</strong> {content.stretchQuestion}</p>}
          {Array.isArray(content.scaffold) && (
            <p><strong>Scaffold:</strong> {content.scaffold.join(' → ')}</p>
          )}
        </div>
      )}

      {activity.activity_type === 'confidence_exit_ticket' && (
        <div className="card lavender" style={{ marginTop: 12 }}>
          <p className="eyebrow">Reflection</p>
          <h3>{content.prompt}</h3>
          <p><strong>Confidence scale:</strong> {(content.scale ?? []).join(' · ')}</p>
          {Array.isArray(content.leastSecureOptions) && (
            <p><strong>Least secure areas:</strong> {content.leastSecureOptions.join(', ')}</p>
          )}
        </div>
      )}
    </article>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Russia1905LessonPage() {
  if (!supabase) {
    return (
      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">Student lesson</p>
          <h1>Supabase is not configured</h1>
          <p>Add the Supabase environment variables in Vercel and redeploy.</p>
        </section>
      </main>
    );
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, enquiry_question, estimated_minutes')
    .eq('title', 'Was the 1905 Revolution a turning point for Tsarist Russia?')
    .single<Lesson>();

  if (lessonError || !lesson) {
    return (
      <main className="page-shell">
        <section className="hero">
          <p className="eyebrow">Student lesson</p>
          <h1>1905 lesson not found</h1>
          <p>{lessonError?.message ?? 'Run the 1905 seed SQL in Supabase.'}</p>
        </section>
      </main>
    );
  }

  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json')
    .eq('lesson_id', lesson.id)
    .order('estimated_minutes', { ascending: true });

  const orderedActivities = (activities ?? []) as Activity[];

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Student pathway · Live from Supabase</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.enquiry_question}</p>
        <div className="button-row">
          <span className="badge">Estimated time: {lesson.estimated_minutes ?? 45} minutes</span>
          <span className="badge">Activities: {orderedActivities.length}</span>
        </div>
      </section>

      {activitiesError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>Activity query failed</h2>
          <p>{activitiesError.message}</p>
        </section>
      )}

      {orderedActivities.length === 0 && !activitiesError && (
        <section className="card warm" style={{ marginTop: 24 }}>
          <h2>No activities found</h2>
          <p>The lesson exists, but no activities are linked to it yet.</p>
        </section>
      )}

      {orderedActivities.map((activity, index) => (
        <ActivityCard activity={activity} index={index} key={activity.id} />
      ))}
    </main>
  );
}
