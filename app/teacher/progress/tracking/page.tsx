import Link from 'next/link';
import ProgressSectionNav from '@/components/ProgressSectionNav';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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

  return <>
    <ProgressSectionNav active="tracking" />
    <main className="page-shell teacher-shell">
      <section className="card">
        <p className="eyebrow">Class tracking</p>
        <h2>Choose a class</h2>
        <p>Open the complete, incomplete and not-attempted assignment history for a teaching group.</p>
      </section>
      <section style={{ marginTop: 14 }}>
        {classes.length === 0 ? <article className="card"><h2>No active classes</h2><p>Create or reactivate a class before using progress tracking.</p><div className="button-row"><Link className="button" href="/teacher/classes">Go to classes</Link></div></article> : <div className="grid two">{classes.map((item) => <article className="card" key={item.id}><p className="eyebrow">{item.academicYear || 'Academic year not set'}</p><h2>{item.name}</h2><div className="button-row"><Link className="button" href={`/teacher/classes/${item.id}/tracking`}>Open tracker</Link><Link className="button secondary" href={`/teacher/classes/${item.id}?tab=progress`}>Class progress</Link></div></article>)}</div>}
      </section>
    </main>
  </>;
}
