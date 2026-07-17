import Link from 'next/link';
import { courseUnits } from '@/lib/courseUnits';
import { pathwayRegistry } from '@/lib/pathwayRegistry';
import { getPathwayReadiness } from '@/lib/pathwayReadiness';
import styles from './page.module.css';

export default function CourseUnitsPage() {
  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>AQA Tsarist and Communist Russia, 1855–1964</p>
          <h1>Course units</h1>
          <p>Open a unit to see its lessons in teaching order. Ready units contain completed, audited pathways.</p>
        </div>
        <Link className={styles.assignmentButton} href="/student">Go to current assignment</Link>
      </header>

      <section className={styles.unitGrid}>
        {courseUnits.map((unit) => {
          const pathways = unit.pathwaySlugs.map((slug) => pathwayRegistry[slug]).filter(Boolean);
          const readyCount = pathways.filter((pathway) => getPathwayReadiness(pathway.pathwaySlug, pathway.status).status === 'ready').length;
          const statusLabel = unit.status === 'ready' ? 'Complete' : unit.status === 'building' ? 'In development' : 'Planned';

          return (
            <article className={`${styles.unitCard} ${unit.status === 'ready' ? styles.ready : ''}`} key={unit.unitNumber}>
              <div className={styles.unitTopline}>
                <span>{unit.yearGroup}</span>
                <span>{statusLabel}</span>
              </div>
              <p className={styles.unitNumber}>Unit {unit.unitNumber}</p>
              <h2>{unit.title}</h2>
              <p>{unit.subtitle}</p>
              <div className={styles.progressRow}>
                <strong>{readyCount}/{pathways.length || unit.pathwaySlugs.length} lessons ready</strong>
                <span>{unit.status === 'ready' ? '100%' : 'Course build'}</span>
              </div>
              <div className={styles.progressTrack}>
                <div style={{ width: `${pathways.length ? Math.round((readyCount / pathways.length) * 100) : 0}%` }} />
              </div>
              {unit.status === 'ready' ? (
                <Link className={styles.openButton} href={`/student/course/unit-${unit.unitNumber}`}>Open unit</Link>
              ) : (
                <span className={styles.plannedButton}>Available as lessons are completed</span>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
