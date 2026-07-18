import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Access restricted</p>
        <h1>This area is not available for your account</h1>
        <p>Return to your own dashboard or review your account details.</p>
        <div className="button-row">
          <Link className="button" href="/portal">Go to my dashboard</Link>
          <Link className="button secondary" href="/account">View account</Link>
        </div>
      </section>
    </main>
  );
}
