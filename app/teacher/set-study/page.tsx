import Link from 'next/link';
import GuidedStudyAssignmentForm from '@/components/GuidedStudyAssignmentForm';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type ClassOption = {
  id: string;
  className: string;
  yearGroup: string;
  studentCount: number;
};

type AssignmentRow = {
  id: string;
  mode: string;
  required_activity_types: string[];
  due_at: string | null;
  instructions: string | null;
  status: string;
  created_at: string;
  pathway_slug: string;
  lesson_title: string;
  teaching_classes: { name: string } | { name: string }[] | null;
  assignment_recipients: { count: number }[] | null;
};

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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SetStudyPage() {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();

  let classOptions: ClassOption[] = [];
  let assignments: AssignmentRow[] = [];
  let setupWarning = '';

  if (supabase && auth) {
    const { data: teacherLinks, error: classError } = await supabase
      .from('class_teachers')
      .select('class_id, teaching_classes(id, name, academic_year, is_active)')
      .eq('teacher_id', auth.userId)
      .order('created_at', { ascending: false });

    if (classError) {
      setupWarning = classError.message;
    } else {
      const activeClasses = (teacherLinks ?? []).flatMap((link: any) => {
        const teachingClass = Array.isArray(link.teaching_classes) ? link.teaching_classes[0] : link.teaching_classes;
        return teachingClass?.is_active ? [teachingClass] : [];
      });
      const classIds = activeClasses.map((item: any) => item.id);
      const membershipCounts = new Map<string, number>();

      if (classIds.length) {
        const { data: membershipRows, error: membershipError } = await supabase
          .from('class_memberships')
          .select('class_id')
          .in('class_id', classIds)
          .eq('status', 'active');

        if (membershipError) setupWarning = setupWarning || membershipError.message;
        (membershipRows ?? []).forEach((row: any) => {
          membershipCounts.set(row.class_id, (membershipCounts.get(row.class_id) ?? 0) + 1);
        });
      }

      classOptions = activeClasses.map((teachingClass: any) => ({
        id: teachingClass.id,
        className: teachingClass.name,
        yearGroup: teachingClass.academic_year || 'Class',
        studentCount: membershipCounts.get(teachingClass.id) ?? 0,
      }));
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('classroom_assignments')
      .select('id, mode, required_activity_types, due_at, instructions, status, created_at, pathway_slug, lesson_title, teaching_classes(name), assignment_recipients(count)')
      .order('created_at', { ascending: false })
      .limit(8);

    if (assignmentError) setupWarning = setupWarning || assignmentError.message;
    assignments = (assignmentData ?? []) as AssignmentRow[];
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <span>Teacher / Set guided study</span>
        <Link className={styles.navButton} href="/teacher/classes">My classes</Link>
        <Link className={styles.navButton} href="/teacher/progress">Progress</Link>
        <Link className={styles.navButton} href="/student/dashboard">Student view</Link>
      </div>

      {setupWarning && <section className={styles.notice}>Assignment setup warning: {setupWarning}</section>}

      {classOptions.length === 0 ? (
        <section className={styles.notice}>
          No active classes are connected to your account yet. Create a class on the My Classes page before setting guided study.{' '}
          <Link href="/teacher/classes">Open My Classes</Link>
        </section>
      ) : (
        <GuidedStudyAssignmentForm classOptions={classOptions} />
      )}

      <section className={styles.history}>
        <div className={styles.historyHeader}>
          <div><p className={styles.eyebrow}>Recently set</p><h2>Assignment history</h2></div>
          <span className={styles.badge}>Newest first</span>
        </div>

        {assignments.length === 0 ? (
          <div className={styles.empty}><h3>No real assignments yet</h3><p>Create and publish the first assignment above. It will be linked to your selected class.</p></div>
        ) : (
          <div className={styles.assignmentList}>
            {assignments.map((assignment) => {
              const teachingClass = Array.isArray(assignment.teaching_classes) ? assignment.teaching_classes[0] : assignment.teaching_classes;
              const recipientCount = assignment.assignment_recipients?.[0]?.count ?? 0;
              return (
                <article className={styles.assignmentRow} key={assignment.id}>
                  <div><strong>{teachingClass?.name ?? 'Class'}</strong><small>{recipientCount} student{recipientCount === 1 ? '' : 's'} · {assignment.status}</small></div>
                  <div><strong>{assignment.lesson_title}</strong><small>{formatMode(assignment.mode)} · {assignment.required_activity_types.length} activities</small></div>
                  <div><strong>{formatDate(assignment.due_at)}</strong><small>Deadline</small></div>
                  <span className={styles.status}>{assignment.status === 'published' ? 'Published' : assignment.status}</span>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
