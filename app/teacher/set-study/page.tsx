import Link from 'next/link';
import GuidedStudyAssignmentForm from '@/components/GuidedStudyAssignmentForm';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type ClassOption = { id: string; className: string; yearGroup: string; studentCount: number };
type AssignmentRow = {
  id: string;
  class_id: string;
  mode: 'full_guided_study' | 'exam_practice' | 'recap' | 'confidence_repair';
  required_activity_types: string[];
  due_at: string | null;
  instructions: string | null;
  status: string;
  pathway_slug: string;
  title: string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SetStudyPage({ searchParams }: { searchParams?: Promise<{ classId?: string; duplicate?: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const query = searchParams ? await searchParams : {};

  let classOptions: ClassOption[] = [];
  let assignments: AssignmentRow[] = [];
  let setupWarning = '';

  if (supabase && auth) {
    const { data: teacherLinks, error: classError } = await supabase
      .from('class_teachers')
      .select('class_id, teaching_classes(id, name, academic_year, is_active)')
      .eq('teacher_id', auth.userId)
      .order('created_at', { ascending: false });

    if (classError) setupWarning = classError.message;
    const activeClasses = (teacherLinks ?? []).flatMap((link: any) => {
      const item = Array.isArray(link.teaching_classes) ? link.teaching_classes[0] : link.teaching_classes;
      return item?.is_active ? [item] : [];
    });
    const classIds = activeClasses.map((item: any) => item.id);
    const membershipCounts = new Map<string, number>();

    if (classIds.length) {
      const { data: membershipRows, error: membershipError } = await supabase.from('class_memberships').select('class_id').in('class_id', classIds).eq('status', 'active');
      if (membershipError) setupWarning = setupWarning || membershipError.message;
      (membershipRows ?? []).forEach((row: any) => membershipCounts.set(row.class_id, (membershipCounts.get(row.class_id) ?? 0) + 1));
    }

    classOptions = activeClasses.map((item: any) => ({ id: item.id, className: item.name, yearGroup: item.academic_year || 'Class', studentCount: membershipCounts.get(item.id) ?? 0 }));

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('classroom_assignments')
      .select('id, class_id, title, mode, required_activity_types, due_at, instructions, status, pathway_slug')
      .order('created_at', { ascending: false })
      .limit(30);
    if (assignmentError) setupWarning = setupWarning || assignmentError.message;
    assignments = (assignmentData ?? []) as AssignmentRow[];
  }

  const duplicateSource = query.duplicate ? assignments.find((item) => item.id === query.duplicate) ?? null : null;
  const template = duplicateSource ? {
    classId: duplicateSource.class_id,
    pathwaySlug: duplicateSource.pathway_slug,
    mode: duplicateSource.mode,
    requiredActivityTypes: duplicateSource.required_activity_types,
    dueAt: duplicateSource.due_at,
    instructions: duplicateSource.instructions,
  } : null;
  const existingDeadlines = assignments.filter((item) => item.status === 'published' && item.due_at).map((item) => ({ classId: item.class_id, assignmentId: item.id, title: item.title, dueAt: item.due_at! }));

  return (
    <main className={styles.shell}>
      {setupWarning && <section className={styles.notice}>Assignment setup warning: {setupWarning}</section>}

      {classOptions.length === 0 ? (
        <section className={styles.notice}>No active classes are connected to your account yet. <Link href="/teacher/classes">Create a class first</Link>.</section>
      ) : (
        <GuidedStudyAssignmentForm classOptions={classOptions} initialClassId={query.classId} existingDeadlines={existingDeadlines} template={template} />
      )}
    </main>
  );
}
