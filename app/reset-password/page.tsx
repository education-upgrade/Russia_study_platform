import Link from 'next/link';
import ResetPasswordForm from './ResetPasswordForm';
import { activeSubjectIdentity } from '@/subjects/activeSubject';
import styles from '../login/login.module.css';

export default function ResetPasswordPage() {
  const { platformName } = activeSubjectIdentity;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{platformName}</p>
          <h1>Choose a new password</h1>
          <p>Use the secure link from your password reset email to set a new password for your account.</p>
          <Link className={styles.back} href="/login">← Back to sign in</Link>
        </div>
        <ResetPasswordForm />
      </section>
    </main>
  );
}
