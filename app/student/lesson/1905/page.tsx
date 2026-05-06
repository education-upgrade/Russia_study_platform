import ConfidenceExitTicketActivity from '@/components/ConfidenceExitTicketActivity';
import PeelResponseActivity from '@/components/PeelResponseActivity';
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

function getActivityTone(activityType: string) {
  if (activityType === 'lesson_content') return 'teal';
  if (activityType === 'quiz') return 'lavender';
  if (activityType === 'flashcards') return 'warm';
  if (activityType === 'peel_response') return 'teal';
  if (activityType === 'confidence_exit_ticket') return 'lavender';
  return '';
}

function getActivityPurpose(activityType: string) {
  if (activityType === 'lesson_content') return 'Build the core story before you test yourself.';
  if (activityType === 'quiz') return 'Check precise recall and identify gaps quickly.';
  if (activityType === 'flashcards') return 'Rehearse the key evidence until it is secure.';
  if (activityType === 'peel_response') return 'Turn knowledge into exam-ready explanation.';
  if (activityType === 'confidence_exit_ticket') return 'Reflect honestly so revision can be targeted.';
  return 'Complete this guided study activity.';
}

function formatActivityType(activityType: string) {
  return activityType.replaceAll('_', ' ');
}

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const content = activity.content_json ?? {};
  const tone = getActivityTone(activity.activity_type);

  return (
    <details className={`card activity-card activity-disclosure ${tone}`} id={`activity-${index + 1}`} open={index === 0}>
      <summary className="activity-summary-header">
        <div className="activity-header">
          <div className="activity-title-block">
            <p className="eyebrow">Step {index + 1} · {formatActivityType(activity.activity_type)}</p>
            <h2>{activity.title}</h2>
            <p>{getActivityPurpose(activity.activity_type)}</p>
          </div>
          <div className="activity-summary">
            <span className="badge">{activity.estimated_minutes ?? '?'} mins</span>
            <span className="badge">{activity.skill_focus ?? 'Core knowledge'}</span>
            {activity.difficulty && <span className="badge">{activity.difficulty}</span>}
            <span className="badge disclosure-badge">Open / close</span>
          </div>
        </div>
      </summary>

      <div className="activity-body">
        {activity.activity_type === 'lesson_content' && Array.isArray(content.sections) && (
          <div className="lesson-section-grid">
            {content.sections.map((section: { heading: string; body: string }, sectionIndex: number) => (
              <section className="panel" key={section.heading}>
                <p className="eyebrow">Lesson note {sectionIndex + 1}</p>
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
          <div className="flashcard-grid">
            {content.cards.map((card: any, cardIndex: number) => (
              <section className="panel flashcard" key={card.id ?? card.front}>
                <div>
                  <p className="eyebrow">Flashcard {cardIndex + 1}</p>
                  <h3>{card.front}</h3>
                </div>
                <p className="flashcard-back">{card.back}</p>
              </section>
            ))}
          </div>
        )}

        {activity.activity_type === 'peel_response' && (
          <PeelResponseActivity
            activityId={activity.id}
            question={content.question ?? 'Write a PEEL response.'}
            stretchQuestion={content.stretchQuestion}
            scaffold={Array.isArray(content.scaffold) ? content.scaffold : undefined}
          />
        )}

        {activity.activity_type === 'confidence_exit_ticket' && (
          <ConfidenceExitTicketActivity
            activityId={activity.id}
            prompt={content.prompt ?? 'How confident are you with this topic?'}
            scale={Array.isArray(content.scale) ? content.scale : undefined}
            leastSecureOptions={Array.isArray(content.leastSecureOptions) ? content.leastSecureOptions : undefined}
          />
        )}
      </div>
    </details>
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
  const totalMinutes = orderedActivities.reduce(
    (total, activity) => total + (activity.estimated_minutes ?? 0),
    0
  );

  return (
    <main className="page-shell">
      <div className="page-header-row">
        <span className="breadcrumb">Student pathway / Year 12 Russia / 1905 Revolution</span>
        <span className="badge">Live from Supabase</span>
      </div>

      <section className="hero">
        <p className="eyebrow">Guided study track</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.enquiry_question}</p>
        <div className="button-row">
          <span className="badge">Estimated time: {totalMinutes || lesson.estimated_minutes || 45} minutes</span>
          <span className="badge">Activities: {orderedActivities.length}</span>
          <span className="badge">Trackable: quiz, PEEL and confidence</span>
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

      {orderedActivities.length > 0 && (
        <div className="pathway-layout">
          <aside className="card pathway-nav">
            <p className="eyebrow">Study sequence</p>
            <h2>Your route</h2>
            <p>Work down the pathway. Open one task at a time to reduce scrolling and stay focused.</p>
            <div className="progress-bar" aria-label="Pathway prototype progress">
              <div className="progress-fill" style={{ '--progress': '80%' } as React.CSSProperties} />
            </div>
            <div className="step-list">
              {orderedActivities.map((activity, index) => (
                <a className="step-link" href={`#activity-${index + 1}`} key={activity.id}>
                  <span className="step-number">{index + 1}</span>
                  <span>
                    <strong>{activity.title}</strong><br />
                    <span className="step-meta">{formatActivityType(activity.activity_type)}</span>
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <section>
            {orderedActivities.map((activity, index) => (
              <ActivityCard activity={activity} index={index} key={activity.id} />
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
