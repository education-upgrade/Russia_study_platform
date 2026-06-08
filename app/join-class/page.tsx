import Link from 'next/link';
import JoinClassForm from '@/components/JoinClassForm';
import styles from './page.module.css';

export default function JoinClassPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Russia Study Platform</p>
          <h1>Join your class</h1>
          <p>
            Enter the class code shared by your teacher to access guided study,
            adaptive assignments and revision pathways.
          </p>
        </div>

        <JoinClassForm />

        <div className={styles.footerLinks}>
          <Link href="/student">Student dashboard</Link>
          <Link href="/teacher/progress">Teacher dashboard</Link>
        </div>
      </section>
    </main>
  );
}
