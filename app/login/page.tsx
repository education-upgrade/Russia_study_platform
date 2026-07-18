import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">Russia Study Platform</p>
          <h1>Sign in to continue</h1>
          <p>Your account keeps assignments, lesson access and future progress data connected to you securely.</p>
          <Link className="breadcrumb" href="/">← Back to home</Link>
        </div>
        <Suspense fallback={<div className="auth-card"><p>Loading sign-in…</p></div>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
