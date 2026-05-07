import Link from 'next/link';

const teacherActions = [
  {
    title: 'Set guided study',
    body: 'Choose the 1905 pathway mode, required activities, deadline and teacher instructions.',
    href: '/teacher/set-study',
    tone: 'teal',
  },
  {
    title: 'Open live progress',
    body: 'See saved quiz scores, flashcard ratings, PEEL responses and confidence exit tickets from the 1905 pathway.',
    href: '/teacher/progress',
    tone: 'lavender',
  },
  {
    title: 'Preview student pathway',
    body: 'Check exactly what students see before setting or refining guided study.',
    href: '/student/lesson/1905',
    tone: 'warm',
  },
];

export default function TeacherDashboardPage() {
  return (
    <main className="page-shell teacher-shell">
      <section className="teacher-hero">
        <div>
          <p className="eyebrow">Teacher command centre</p>
          <h1>Year 12 Russia guided study</h1>
          <p>
            Start with the 1905 Revolution pilot pathway. The aim is simple: set meaningful study,
            capture useful student evidence, and make the next teaching decision faster.
          </p>
          <div className="button-row">
            <Link className="button" href="/teacher/set-study">Set guided study</Link>
            <Link className="button secondary" href="/teacher/progress">View live progress</Link>
          </div>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Current pilot</p>
          <h2>1905 Revolution</h2>
          <p>Lesson content, retrieval quiz, flashcards, PEEL paragraph and confidence exit ticket.</p>
        </aside>
      </section>

      <section className="grid three-fixed">
        {teacherActions.map((action) => (
          <Link className={`card ${action.tone}`} href={action.href} key={action.title}>
            <p className="eyebrow">Teacher workflow</p>
            <h2>{action.title}</h2>
            <p>{action.body}</p>
            <span className="badge">Open</span>
          </Link>
        ))}
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <p className="eyebrow">Build logic</p>
        <h2>What this dashboard is becoming</h2>
        <div className="lesson-section-grid improved">
          <article className="panel teal">
            <h3>1. Set guided study</h3>
            <p>Teachers choose a pathway, select activities, set deadlines and decide whether it is recap, exam practice or full guided study.</p>
          </article>
          <article className="panel lavender">
            <h3>2. Monitor evidence</h3>
            <p>The dashboard turns activity completion into useful evidence: quiz accuracy, written response quality and confidence.</p>
          </article>
          <article className="panel warm">
            <h3>3. Intervene quickly</h3>
            <p>The priority queue highlights who needs reteaching, feedback, reassurance or additional retrieval practice.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
