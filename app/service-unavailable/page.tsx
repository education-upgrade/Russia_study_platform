import Link from 'next/link';

export default function ServiceUnavailablePage() {
  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Temporary service problem</p>
        <h1>Your account is still there</h1>
        <p>
          The study platform could not confirm your account details because the authentication service is temporarily unavailable.
          Your account and saved progress have not been deleted.
        </p>

        <div className="callout" role="status">
          <span className="callout-icon">!</span>
          <div>
            <strong>Please try again shortly</strong>
            <p>Refreshing this page or returning to the app will retry the connection automatically.</p>
          </div>
        </div>

        <div className="button-row">
          <Link className="button" href="/">Try again</Link>
          <Link className="button ghost" href="/login">Go to sign in</Link>
        </div>
      </section>
    </main>
  );
}
