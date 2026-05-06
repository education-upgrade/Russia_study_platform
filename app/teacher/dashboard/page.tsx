const prototypeRows = [
  { student: 'Student A', progress: '6/6', quiz: '8/10', flashcards: '4/4', peel: 'Submitted', confidence: '4', risk: 'Secure' },
  { student: 'Student B', progress: '4/6', quiz: '5/10', flashcards: '2/4', peel: 'Missing', confidence: '2', risk: 'Intervention' },
  { student: 'Student C', progress: '0/6', quiz: '-', flashcards: '-', peel: '-', confidence: '-', risk: 'Not started' },
];

export default function TeacherDashboardPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Teacher dashboard</p>
        <h1>Year 12 Russia: 1905 Revolution pathway</h1>
        <p>
          Prototype view of the first MVP loop: completion, quiz scores, flashcard progress,
          PEEL submission, confidence and intervention flags.
        </p>
      </section>

      <section className="card" style={{ marginTop: 24 }}>
        <p className="eyebrow">Class progress</p>
        <h2>Assignment overview</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Progress</th>
              <th>Quiz</th>
              <th>Flashcards</th>
              <th>PEEL</th>
              <th>Confidence</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {prototypeRows.map((row) => (
              <tr key={row.student}>
                <td>{row.student}</td>
                <td>{row.progress}</td>
                <td>{row.quiz}</td>
                <td>{row.flashcards}</td>
                <td>{row.peel}</td>
                <td>{row.confidence}</td>
                <td><span className="badge">{row.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
