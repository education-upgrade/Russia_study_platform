import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Platform administration</p>
        <h1>Admin portal</h1>
        <p>This protected area is reserved for trusted platform administrators.</p>
        <div className="button-row">
          <Link className="button" href="/account">Open account</Link>
          <Link className="button secondary" href="/teacher/dashboard">Open teacher area</Link>
        </div>
      </section>
    </main>
  );
}
