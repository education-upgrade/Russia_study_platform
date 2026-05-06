import { russia1905Pilot } from '@/content/1905-pilot';

export default function StudentDashboardPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Student dashboard</p>
        <h1>My Guided Study</h1>
        <p>
          Your current pathway is the 1905 Revolution pilot. Complete each section in order:
          lesson, retrieval, flashcards, PEEL response and confidence exit ticket.
        </p>
      </section>

      <section className="grid">
        <article className="card teal">
          <p className="eyebrow">Current assignment</p>
          <h2>{russia1905Pilot.lesson.title}</h2>
          <p>{russia1905Pilot.lesson.enquiry}</p>
          <div className="progress-bar"><div className="progress-fill" /></div>
          <p><strong>Prototype progress:</strong> 2/6 sections complete</p>
          <span className="badge">Next step: Flashcard study</span>
        </article>

        <article className="card lavender">
          <p className="eyebrow">PEEL practice</p>
          <h2>{russia1905Pilot.peelTask.question}</h2>
          <p>Use Point, Evidence, Explain and Link judgement to build one focused paragraph.</p>
        </article>

        <article className="card warm">
          <p className="eyebrow">Confidence exit ticket</p>
          <h2>Reflect before you finish</h2>
          <p>Rate confidence from 1-5 and identify the least secure part of the topic.</p>
        </article>
      </section>
    </main>
  );
}
