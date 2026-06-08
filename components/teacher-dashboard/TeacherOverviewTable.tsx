import AssignRecommendedRouteButton from '@/components/AssignRecommendedRouteButton';
import CopyTextButton from '@/components/CopyTextButton';
import styles from '@/app/teacher/progress/page.module.css';

type TeacherOverviewTableProps = {
  studentName: string;
  progress: string;
  mastery: number | null;
  confidence: number | null;
  status: string;
  nextAssignmentTitle: string;
  route: {
    pathwaySlug: string;
    lessonTitle: string;
    routeMode: string;
    requiredActivityTypes: string[];
    instructions: string;
  };
  instructionCopy: string;
  feedbackCopy: string;
};

export default function TeacherOverviewTable({
  studentName,
  progress,
  mastery,
  confidence,
  status,
  nextAssignmentTitle,
  route,
  instructionCopy,
  feedbackCopy,
}: TeacherOverviewTableProps) {
  return (
    <section className={styles.priority}>
      <div className={styles.sectionHeader}>
        <h2>Student overview</h2>
        <div className={styles.tableActions}>
          <span className={styles.badge}>action centre</span>
          <AssignRecommendedRouteButton
            pathwaySlug={route.pathwaySlug}
            lessonTitle={route.lessonTitle}
            routeMode={route.routeMode}
            requiredActivityTypes={route.requiredActivityTypes}
            instructions={route.instructions}
            label="Set next assignment for all"
            showMessage={false}
          />
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
            <tr>
              <td>{studentName}</td>
              <td>{progress}</td>
              <td>{mastery ?? '–'}</td>
              <td>{confidence ?? '–'}</td>
              <td><span className={`${styles.statusPill} ${styles.intervention}`}>{status}</span></td>
              <td>{nextAssignmentTitle}</td>
              <td>
                <AssignRecommendedRouteButton
                  pathwaySlug={route.pathwaySlug}
                  lessonTitle={route.lessonTitle}
                  routeMode={route.routeMode}
                  requiredActivityTypes={route.requiredActivityTypes}
                  instructions={route.instructions}
                  label="Set next"
                  showMessage={false}
                />
              </td>
              <td><CopyTextButton label="Copy instructions" text={instructionCopy} /></td>
              <td><CopyTextButton label="Copy feedback" text={feedbackCopy} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
