import Link from 'next/link';

const teacherActions = [
  {
    title: 'Classes',
    body: 'Create teaching groups, share join codes and see the classes connected to your account.',
    href: '/teacher/classes',
    tone: 'teal',
  },
  {
    title: 'Set work',
    body: 'Choose a topic, class, study route, deadline and instructions for students.',
    href: '/teacher/set-study',
    tone: 'lavender',
  },
  {
    title: 'Progress',
    body: 'Review completion, confidence and evidence from published assignments.',
    href: '/teacher/progress',
    tone: 'warm',
  },
  {
    title: 'Preview student view',
    body: 'Check the student pathway before setting or refining guided study.',
    href: '/student/lesson/1905',
    tone: 'teal',
  },
];

export default function TeacherDashboardPage() {
  return (
    <main className="page-shell teacher-shell">
      <section className="grid three-fixed" style={{ marginTop: 0 }}>
        {teacherActions.map((action) => (
          <Link className={`card ${action.tone}`} href={action.href} key={action.title}>
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
            <p>Create a teaching group and share its six-character code with students.</p>
          </article>
          <article className="panel lavender">
            <h3>2. Set work</h3>
            <p>Choose the required lesson activities, deadline and student instructions.</p>
          </article>
          <article className="panel warm">
            <h3>3. Review progress</h3>
            <p>Use completion, confidence and saved evidence to decide who needs support.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
