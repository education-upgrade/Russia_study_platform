import Link from 'next/link';
import { getCourseUnit } from '@/lib/courseUnits';
import { pathwayRegistry } from '@/lib/pathwayRegistry';
import { getPathwayReadiness } from '@/lib/pathwayReadiness';
import styles from './page.module.css';

export default function UnitOnePage() {
  const unit = getCourseUnit(1);
  if (!unit) return null;

  const lessons = unit.pathwaySlugs.map((slug) => pathwayRegistry[slug]).filter(Boolean);

  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <div>
          <Link className={styles.backLink} href="/student/course">← Course units</Link>
          <p className={styles.eyebrow}>Y12 · Unit 1 · Complete</p>
          <h1>{unit.title}</h1>
          <p>{unit.subtitle}</p>
        </div>
        <div className={styles.summaryCard}>
          <strong>{lessons.length}/{lessons.length}</strong>
          <span>lessons ready</span>
        </div>
      </header>

      <section className={styles.skillsBar}>
        <span>Chronology</span>
        <span>Retrieval</span>
        <span>Judgement</span>
        <span>AO3 interpretations</span>
        <span>Analytical writing</span>
      </section>

      <section className={styles.lessonList}>
        {lessons.map((lesson, index) => {
          const readiness = getPathwayReadiness(lesson.pathwaySlug, lesson.status);
          return (
            <article className={styles.lessonCard} key={lesson.pathwaySlug}>
              <span className={styles.lessonNumber}>{index + 1}</span>
              <div className={styles.lessonText}>
                <div className={styles.lessonHeading}>
                  <h2>{lesson.title}</h2>
                  <span>{readiness.status === 'ready' ? 'Ready' : readiness.status}</span>
                </div>
                <p>{lesson.lessonTitle}</p>
                <small>{lesson.subtitle}</small>
              </div>
              <Link className={styles.openButton} href={lesson.routeBase}>Open lesson</Link>
            </article>
          );
        })}
      </section>

      <footer className={styles.footerCard}>
        <div>
          <p className={styles.eyebrow}>Unit complete</p>
          <h2>Ready to move to Unit 2</h2>
          <p>The next sequence begins with the later reign of Alexander II and the growth of opposition.</p>
        </div>
        <span className={styles.nextLabel}>Unit 2 in development</span>
      </footer>
    </main>
  );
}
