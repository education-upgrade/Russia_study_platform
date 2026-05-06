import Link from 'next/link';
import { russia1905Pilot } from '@/content/1905-pilot';

const pathwaySteps = [
  'Lesson content',
  'Retrieval quiz',
  'Flashcards',
  'PEEL response',
  'Confidence exit ticket',
];

export default function StudentDashboardPage() {
  return (
    <main className="page-shell">
      <div className="page-header-row">
        <span className="breadcrumb">Student dashboard / Guided study</span>
        <Link className="button secondary" href="/student/lesson/1905">Open pathway</Link>
      </div>

      <section className="hero">
        <p className="eyebrow">My Guided Study</p>
        <h1>1905 Revolution pathway</h1>
        <p>
          Complete the lesson, retrieval quiz, flashcards, PEEL response and confidence exit ticket.
          Your saved quiz and PEEL work will appear on the teacher progress dashboard.
        </p>
        <div className="button-row">
          <Link className="button" href="/student/lesson/1905">Start guided study</Link>
          <span className="badge">Next step: Flashcard study</span>
        </div>
      </section>

      <section className="grid two">
        <article className="card teal">
          <p className="eyebrow">Current assignment</p>
          <h2>{russia1905Pilot.lesson.title}</h2>
          <p>{russia1905Pilot.lesson.enquiry}</p>
          <div className="progress-bar"><div className="progress-fill" style={{ '--progress': '40%' } as React.CSSProperties} /></div>
          <p><strong>Prototype progress:</strong> 2/5 activities complete</p>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Exam skill focus</p>
          <h2>{russia1905Pilot.peelTask.question}</h2>
          <p>Use Point, Evidence, Explain and Link judgement to build one focused paragraph.</p>
          <Link className="button secondary" href="/student/lesson/1905#activity-4">Go to PEEL task</Link>
        </article>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <p className="eyebrow">Pathway map</p>
        <h2>What you need to complete</h2>
        <div className="step-list">
          {pathwaySteps.map((step, index) => (
            <div className="step-chip" key={step}>
              <span className="step-number">{index + 1}</span>
              <span>
                <strong>{step}</strong><br />
                <span className="step-meta">1905 MVP activity</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
