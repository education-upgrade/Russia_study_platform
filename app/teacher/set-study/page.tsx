import Link from 'next/link';
import GuidedStudyAssignmentForm from '@/components/GuidedStudyAssignmentForm';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type GuidedStudyAssignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  deadline_at: string | null;
  instructions: string | null;
  assigned_class: string;
  status: string;
  created_at: string;
  recipient_count?: number | null;
};

type ClassOption = {
  id: string;
  className: string;
  yearGroup: string;
  studentCount: number;
};

type TeacherClassRow = {
  id: string;
  class_name: string;
  year_group: string;
};

type ClassMembershipRow = {
  class_id: string;
  student_id: string;
};

const fallbackClasses: ClassOption[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    className: 'Year 12 Russia demo class',
    yearGroup: 'Y12',
    studentCount: 1,
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    className: 'Year 13 Russia demo class',
    yearGroup: 'Y13',
    studentCount: 0,
  },
];

function formatMode(mode: string) {
  return mode.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  if (!value) return 'No deadline';
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildClassOptions(classes: TeacherClassRow[], memberships: ClassMembershipRow[]) {
  const classMap = new Map<string, ClassOption>();

  fallbackClasses.forEach((classOption) => classMap.set(classOption.id, classOption));

  classes.forEach((classRow) => {
    classMap.set(classRow.id, {
      id: classRow.id,
      className: classRow.class_name,
      yearGroup: classRow.year_group,
      studentCount: memberships.filter((membership) => membership.class_id === classRow.id).length,
    });
  });

  return Array.from(classMap.values()).sort((first, second) => {
    if (first.yearGroup !== second.yearGroup) return first.yearGroup.localeCompare(second.yearGroup);
    return first.className.localeCompare(second.className);
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SetStudyPage() {
  let assignments: GuidedStudyAssignment[] = [];
  let assignmentError = '';
  let classOptions: ClassOption[] = fallbackClasses;
  let classSetupWarning = '';

  if (supabase) {
    const { data, error } = await supabase
      .from('guided_study_assignments')
      .select('id, mode, required_activity_types, deadline_at, instructions, assigned_class, status, created_at, recipient_count')
      .eq('pathway_slug', '1905-revolution')
      .order('created_at', { ascending: false })
      .limit(3);

    assignments = (data ?? []) as GuidedStudyAssignment[];
    assignmentError = error?.message ?? '';

    const { data: classData, error: classError } = await supabase
      .from('teacher_classes')
      .select('id, class_name, year_group')
      .eq('status', 'active')
      .order('year_group', { ascending: true })
      .order('class_name', { ascending: true });

    const { data: membershipData, error: membershipError } = await supabase
      .from('class_memberships')
      .select('class_id, student_id')
      .eq('status', 'active');

    if (classError || membershipError) {
      classSetupWarning = classError?.message ?? membershipError?.message ?? '';
    } else {
      classOptions = buildClassOptions((classData ?? []) as TeacherClassRow[], (membershipData ?? []) as ClassMembershipRow[]);
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Set guided study / 1905 Revolution</span>
        <Link className={styles.navButton} href="/teacher/progress">Progress</Link>
        <Link className={styles.navButton} href="/student/dashboard">Student view</Link>
      </div>

      {!supabase && (
        <section className={styles.notice}>
          Supabase is not configured. Add the environment variables in Vercel and redeploy before creating assignments.
        </section>
      )}

      {assignmentError && (
        <section className={styles.notice}>
          Assignment setup warning: {assignmentError}. Run supabase/guided-study-assignments.sql in Supabase SQL Editor if needed.
        </section>
      )}

      {classSetupWarning && (
        <section className={styles.notice}>
          Class setup warning: {classSetupWarning}. Run supabase/multi-class-platform.sql in Supabase SQL Editor to enable class targeting.
        </section>
      )}

      <GuidedStudyAssignmentForm classOptions={classOptions} />

      <section className={styles.history}>
        <div className={styles.historyHeader}>
          <div>
            <p className={styles.eyebrow}>Recently set</p>
            <h2>Assignment history</h2>
          </div>
          <span className={styles.badge}>Newest first</span>
        </div>

        {assignments.length === 0 ? (
          <div className={styles.empty}>
            <h3>No assignments yet</h3>
            <p>Create the first assignment above. It will appear on the student dashboard.</p>
          </div>
        ) : (
          <div className={styles.assignmentList}>
            {assignments.map((assignment) => (
              <article className={styles.assignmentRow} key={assignment.id}>
                <div>
                  <strong>{assignment.assigned_class}</strong>
                  <small>{assignment.recipient_count ?? 1} student{(assignment.recipient_count ?? 1) === 1 ? '' : 's'} · {assignment.status}</small>
                </div>
                <div>
                  <strong>{formatMode(assignment.mode)}</strong>
                  <small>{assignment.required_activity_types.length} activities</small>
                </div>
                <div>
                  <strong>{formatDate(assignment.deadline_at)}</strong>
                  <small>Deadline</small>
                </div>
                <span className={styles.status}>Set</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
