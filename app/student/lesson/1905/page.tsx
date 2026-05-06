import Link from 'next/link';
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

const activityDesign: Record<string, { tone: string; label: string; purpose: string; action: string }> = {
  lesson_content: {
    tone: 'teal',
    label: 'Learn',
    purpose: 'Build the core narrative before testing yourself.',
    action: 'Read the three notes and identify the main reason 1905 mattered.',
  },
  quiz: {
    tone: 'lavender',
    label: 'Retrieve',
    purpose: 'Check precise recall and expose gaps quickly.',
    action: 'Answer without notes first, then review what needs revisiting.',
  },
  flashcards: {
    tone: 'warm',
    label: 'Rehearse',
    purpose: 'Secure the key evidence before writing.',
    action: 'Say the answer aloud before revealing or reading the back.',
  },
  peel_response: {
    tone: 'teal',
    label: 'Apply',
    purpose: 'Turn knowledge into exam-ready explanation.',
    action: 'Build one focused PEEL paragraph with a clear judgement link.',
  },
  confidence_exit_ticket: {
    tone: 'lavender',
    label: 'Reflect',
    purpose: 'Tell the teacher what feels secure and what still needs support.',
    action: 'Be honest: this helps guide recap and intervention.',
  },
};

function getActivityDesign(activityType: string) {
  return activityDesign[activityType] ?? {
    tone: '',
    label: 'Study',
    purpose: 'Complete this guided study activity.',
    action: 'Complete the task carefully and save where prompted.',
  };
}

function formatActivityType(activityType: string) {
  return activityType.replaceAll('_', ' ');
}

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const content = activity.content_json ?? {};
  const design = getActivityDesign(activity.activity_type);

  return (
    <article className={`study-task-card ${design.tone}`} id={`activity-${index + 1}`}>
      <div className="study-task-header">
        <div className="task-index-block">
          <span className="task-index">{index + 1}</span>
          <span className="task-line" />
        </div>
        <div className="task-title-area">
          <p className="eyebrow">{design.label} · {formatActivityType(activity.activity_type)}</p>
          <h2>{activity.title}</h2>
          <p>{design.purpose}</p>
          <div className="activity-summary">
            <span className="badge">{activity.estimated_minutes ?? '?'} mins</span>
            <span className="badge">{activity.skill_focus ?? 'Core knowledge'}</span>
            {activity.difficulty && <span className="badge">{activity.difficulty}</span>}
          </div>
        </div>
        <aside className="task-instruction-card">
          <p className="eyebrow">What to do</p>
          <p>{design.action}</p>
        </aside>
      </div>

      <div className="study-task-body">
        {activity.activity_type === 'lesson_content' && Array.isArray(content.sections) && (
          <div className="lesson-section-grid improved">
            {content.sections.map((section: { heading: string; body: string }, sectionIndex: number) => (
              <section className="panel lesson-note" key={section.heading}>
                <span className="note-number">{sectionIndex + 1}</span>
                <p className="eyebrow">Core explanation</p>
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
          <div className="flashcard-grid improved">
            {content.cards.map((card: any, cardIndex: number) => (
              <section className="panel flashcard improved-card" key={card.id ?? card.front}>
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
  const totalMinutes = orderedActivities.reduce(
    (total, activity) => total + (activity.estimated_minutes ?? 0),
    0
  );

  return (
    <main className="page-shell study-shell">
      <div className="page-header-row app-topbar">
        <span className="breadcrumb">Student pathway / Year 12 Russia / 1905 Revolution</span>
        <div className="button-row compact">
          <Link className="button secondary" href="/student/dashboard">Dashboard</Link>
          <span className="badge">Live from Supabase</span>
        </div>
      </div>

      <section className="study-hero">
        <div className="study-hero-main">
          <p className="eyebrow">Guided study track</p>
          <h1>{lesson.title}</h1>
          <p>{lesson.enquiry_question}</p>
          <div className="hero-stat-row">
            <span className="hero-stat"><strong>{totalMinutes || lesson.estimated_minutes || 45}</strong> mins</span>
            <span className="hero-stat"><strong>{orderedActivities.length}</strong> activities</span>
            <span className="hero-stat"><strong>3</strong> saved evidence points</span>
          </div>
        </div>
        <aside className="study-hero-panel">
          <p className="eyebrow">Success criteria</p>
          <h2>Finish with evidence your teacher can use</h2>
          <p>Quiz score, PEEL paragraph and confidence reflection are saved into the teacher progress page.</p>
          <a className="button" href="#activity-1">Start pathway</a>
        </aside>
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
        <div className="study-layout">
          <aside className="study-route-card">
            <p className="eyebrow">Pathway map</p>
            <h2>Your route</h2>
            <p>Move down the sequence. The design now feels more like a learning journey than a stack of worksheets.</p>
            <div className="mini-progress-list">
              {orderedActivities.map((activity, index) => {
                const design = getActivityDesign(activity.activity_type);
                return (
                  <a className="mini-progress-item" href={`#activity-${index + 1}`} key={activity.id}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{design.label}</strong>
                      <small>{activity.title}</small>
                    </div>
                  </a>
                );
              })}
            </div>
          </aside>

          <section className="study-task-stack">
            {orderedActivities.map((activity, index) => (
              <ActivityCard activity={activity} index={index} key={activity.id} />
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
