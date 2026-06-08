import AssignRecommendedRouteButton from '@/components/AssignRecommendedRouteButton';
import styles from '@/app/teacher/progress/page.module.css';

type TeacherStudentSummaryProps = {
  studentName: string;
  headline: string;
  priorityFocus: string;
  explanation: string;
  nextMove: string;
  route: {
    pathwaySlug: string;
    lessonTitle: string;
    routeMode: string;
    requiredActivityTypes: string[];
    instructions: string;
  };
};

export default function TeacherStudentSummary({
  studentName,
  headline,
  priorityFocus,
  explanation,
  nextMove,
  route,
}: TeacherStudentSummaryProps) {
  return (
    <section className={styles.priority}>
      <div className={styles.sectionHeader}>
        <h2>{studentName}</h2>
        <span className={styles.badge}>{priorityFocus}</span>
      </div>

      <div className={styles.priorityList}>
        <article className={styles.priorityItem}>
          <div>
            <strong>{headline}</strong>
            <small>{priorityFocus}</small>
          </div>

          <div>
            <p>{explanation}</p>
            <p><strong>Next move:</strong> {nextMove}</p>
          </div>

          <AssignRecommendedRouteButton
            pathwaySlug={route.pathwaySlug}
            lessonTitle={route.lessonTitle}
            routeMode={route.routeMode}
            requiredActivityTypes={route.requiredActivityTypes}
            instructions={route.instructions}
          />
        </article>
      </div>
    </section>
  );
}
