import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Education Upgrade</p>
        <h1>Russia Study Platform</h1>
        <p>
          A modular teacher/student platform for AQA A-Level History: Tsarist and Communist Russia,
          1855-1964. The student experience now opens directly into the teacher-set pathway.
        </p>
        <div className="button-row">
          <Link className="button" href="/student">
            Start student pathway
          </Link>
          <Link className="button secondary" href="/student/course">
            Course units
          </Link>
          <Link className="button secondary" href="/teacher/dashboard">
            Teacher dashboard
          </Link>
        </div>
      </section>

      <section className="grid">
        <article className="card teal">
          <p className="eyebrow">MVP loop</p>
          <h2>Assign → Complete → Save → Monitor</h2>
          <p>
            The first reliable loop is a teacher assigning a pathway, a student completing it,
            and the teacher seeing accurate progress and intervention flags.
          </p>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Student experience</p>
          <h2>Pathway-led guided study</h2>
          <p>
            Students move through lesson content, retrieval, application, AO3 interpretation and confidence
            checks inside one clear pathway.
          </p>
        </article>

        <article className="card warm">
          <p className="eyebrow">Course organisation</p>
          <h2>Lessons grouped into units</h2>
          <p>
            Completed pathways are organised into clear course units, while the current assignment remains one click away.
          </p>
        </article>
      </section>
    </main>
  );
}
