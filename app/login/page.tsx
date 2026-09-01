import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { activeSubjectIdentity } from '@/subjects/activeSubject';
import styles from './login.module.css';

export default function LoginPage() {
  const { platformName } = activeSubjectIdentity;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{platformName}</p>
          <h1>Sign in to continue</h1>
          <p>Your account keeps assignments, lesson access and progress securely connected to you.</p>
          <Link className={styles.back} href="/">← Back to home</Link>
        </div>
        <Suspense fallback={<div className={styles.card}><p>Loading sign-in…</p></div>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
