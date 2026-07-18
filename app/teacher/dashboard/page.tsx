import Link from 'next/link';

const teacherActions = [
  {
    title: 'Manage classes',
    body: 'Create teaching groups, generate secure join codes and connect students to the correct class.',
    href: '/teacher/classes',
    tone: 'teal',
  },
  {
    title: 'Set guided study',
    body: 'Choose the 1905 pathway mode, required activities, deadline and teacher instructions.',
    href: '/teacher/set-study',
    tone: 'lavender',
  },
  {
    title: 'Open live progress',
    body: 'See saved quiz scores, flashcard ratings, PEEL responses and confidence exit tickets from the 1905 pathway.',
    href: '/teacher/progress',
    tone: 'warm',
  },
  {
    title: 'Preview student pathway',
    body: 'Check exactly what students see before setting or refining guided study.',
    href: '/student/lesson/1905',
    tone: 'teal',
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
            Create a real teaching group, set meaningful study, capture useful student evidence,
            and make the next teaching decision faster.
          </p>
          <div className="button-row">
            <Link className="button" href="/teacher/classes">Manage classes</Link>
            <Link className="button secondary" href="/teacher/set-study">Set guided study</Link>
          </div>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Platform foundation</p>
          <h2>Classes and memberships</h2>
          <p>Teaching groups now provide the structure for assignments, students and future progress reporting.</p>
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
        <p className="eyebrow">Classroom workflow</p>
        <h2>From class creation to intervention</h2>
        <div className="lesson-section-grid improved">
          <article className="panel teal">
            <h3>1. Build the class</h3>
            <p>Create the teaching group and share its six-character code with students.</p>
          </article>
          <article className="panel lavender">
            <h3>2. Set guided study</h3>
            <p>Assignments will next be attached to a real class rather than a demonstration identity.</p>
          </article>
          <article className="panel warm">
            <h3>3. Monitor evidence</h3>
            <p>Completion, scores and written work will be connected to authenticated student memberships.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
