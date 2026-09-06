import Link from 'next/link';
import ProgressSectionNav from '@/components/ProgressSectionNav';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/teacher/teacherPages.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherTrackingHubPage() {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { data: teacherLinks } = supabase && auth ? await supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name, academic_year, is_active)')
    .eq('teacher_id', auth.userId)
    .order('created_at', { ascending: false }) : { data: [] };

  const classes = (teacherLinks ?? []).flatMap((link: any) => {
    const item = Array.isArray(link.teaching_classes) ? link.teaching_classes[0] : link.teaching_classes;
    return item?.is_active ? [{ id: link.class_id, name: item.name, academicYear: item.academic_year }] : [];
  });

  return <main className={styles.page}>
    <ProgressSectionNav active="tracking" />
    <section className={styles.introCard}>
      <div><p className={styles.eyebrow}>Class tracking</p><h2>Choose a class</h2><p>Open the complete, incomplete and not-attempted assignment history for a teaching group.</p></div>
    </section>

    {classes.length === 0 ? <section className={styles.empty}><h2>No active classes</h2><p>Create or reactivate a class before using progress tracking.</p><div className={styles.actions}><Link className={styles.primaryAction} href="/teacher/classes">Go to classes</Link></div></section> : <section className={styles.trackingGrid} aria-label="Class tracking options">{classes.map((item) => <article className={styles.card} key={item.id}>
      <div><p className={styles.eyebrow}>{item.academicYear || 'Academic year not set'}</p><h2>{item.name}</h2><p className={styles.cardDescription}>View the assignment matrix or return to this class's progress overview.</p></div>
      <div className={styles.actions}><Link className={styles.primaryAction} href={`/teacher/classes/${item.id}/tracking`}>Open tracker</Link><Link className={styles.secondaryAction} href={`/teacher/classes/${item.id}?tab=progress`}>Class progress</Link></div>
    </article>)}</section>}
  </main>;
}
