import AssignRecommendedRouteButton from '@/components/AssignRecommendedRouteButton';
import CopyTextButton from '@/components/CopyTextButton';
import styles from '@/app/teacher/progress/page.module.css';

export type TeacherOverviewRoute = {
  pathwaySlug: string;
  lessonTitle: string;
  routeMode: string;
  requiredActivityTypes: string[];
  instructions: string;
};

export type TeacherOverviewRow = {
  studentId: string;
  studentName: string;
  progress: string;
  mastery: number | null;
  confidence: number | null;
  status: string;
  nextAssignmentTitle: string;
  route: TeacherOverviewRoute;
  instructionCopy: string;
  feedbackCopy: string;
};

type TeacherOverviewTableProps = {
  rows: TeacherOverviewRow[];
};

export default function TeacherOverviewTable({ rows }: TeacherOverviewTableProps) {
  const firstRoute = rows[0]?.route;

  return (
    <section className={styles.priority}>
      <div className={styles.sectionHeader}>
        <h2>Student overview</h2>
        <div className={styles.tableActions}>
          <span className={styles.badge}>{rows.length} student{rows.length === 1 ? '' : 's'}</span>
          {firstRoute && (
            <AssignRecommendedRouteButton
              pathwaySlug={firstRoute.pathwaySlug}
              lessonTitle={firstRoute.lessonTitle}
              routeMode={firstRoute.routeMode}
              requiredActivityTypes={firstRoute.requiredActivityTypes}
              instructions={firstRoute.instructions}
              label="Set next assignment for all"
              showMessage={false}
            />
          )}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Progress</th>
              <th>Mastery</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Next assignment</th>
              <th>Set assignment</th>
              <th>Copy instructions</th>
              <th>Copy feedback</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId}>
                <td>{row.studentName}</td>
                <td>{row.progress}</td>
                <td>{row.mastery ?? '–'}</td>
                <td>{row.confidence ?? '–'}</td>
                <td><span className={`${styles.statusPill} ${styles.intervention}`}>{row.status}</span></td>
                <td>{row.nextAssignmentTitle}</td>
                <td>
                  <AssignRecommendedRouteButton
                    pathwaySlug={row.route.pathwaySlug}
                    lessonTitle={row.route.lessonTitle}
                    routeMode={row.route.routeMode}
                    requiredActivityTypes={row.route.requiredActivityTypes}
                    instructions={row.route.instructions}
                    label="Set next"
                    showMessage={false}
                  />
                </td>
                <td><CopyTextButton label="Copy instructions" text={row.instructionCopy} /></td>
                <td><CopyTextButton label="Copy feedback" text={row.feedbackCopy} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
