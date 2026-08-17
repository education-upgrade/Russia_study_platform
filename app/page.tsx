import Link from 'next/link';
import { activeSubjectIdentity } from '@/subjects/activeSubject';

export default function HomePage() {
  const { platformName, subject, courseName, examBoard, qualification } = activeSubjectIdentity;

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Education Upgrade</p>
        <h1>{platformName} Platform</h1>
        <p>
          A modular teacher/student platform for {examBoard} {qualification} {subject}: {courseName}. The
          student experience opens directly into the teacher-set guided-study pathway.
        </p>
        <div className="button-row">
          <Link className="button" href="/student">
            Start student pathway
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
            The first reliable loop is a teacher assigning a pathway, a student completing it, and the
            teacher seeing accurate progress and intervention flags.
          </p>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Student experience</p>
          <h2>Pathway-led guided study</h2>
          <p>
            Students move through subject-specific knowledge, retrieval, application, evaluation and confidence
            checks inside one clear pathway.
          </p>
        </article>

        <article className="card warm">
          <p className="eyebrow">Teacher experience</p>
          <h2>Progress and intervention</h2>
          <p>
            Teachers assign study, monitor completion, review student evidence and identify students needing
            recap, reassurance or intervention.
          </p>
        </article>
      </section>
    </main>
  );
}
