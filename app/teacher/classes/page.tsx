import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClassAction } from './actions';

export default async function TeacherClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: teacherLinks } = supabase && auth ? await supabase.from('class_teachers').select('class_id, teaching_classes(id, name, academic_year, join_code, is_active, schools(name))').eq('teacher_id', auth.userId).order('created_at', { ascending: false }) : { data: [] };
  const classes = teacherLinks ?? [];
  const error = typeof params.error === 'string' ? params.error : null;
  const created = typeof params.created === 'string' ? params.created : null;

  return <main className="page-shell teacher-shell">
    {created && <div className="callout" role="status"><div><strong>Class created</strong><p>Your class is ready. Share its join code with students.</p></div></div>}
    {error && <div className="callout" role="alert"><div><strong>Class not created</strong><p>Check the class details and try again.</p></div></div>}

    <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="status-pill submitted">{classes.length} {classes.length === 1 ? 'class' : 'classes'}</span>
      <a className="button" href="#create-class">+ Create class</a>
    </div>

    <section style={{ marginTop: 14 }}>
      {classes.length === 0 ? <article className="card"><h2>No classes yet</h2><p>Create your first teaching group below, then share its join code with students.</p></article> : <div className="grid three-fixed">{classes.map((link: any) => {
        const item = link.teaching_classes;
        const school = Array.isArray(item?.schools) ? item.schools[0] : item?.schools;
        return <article className="card" key={link.class_id}>
          <p className="eyebrow">{school?.name || 'School'}</p>
          <h2>{item?.name}</h2>
          <p>{item?.academic_year || 'Academic year not set'}</p>
          <div className="button-row compact"><span className="status-pill secure">Code: {item?.join_code}</span><span className="status-pill submitted">{item?.is_active ? 'Active' : 'Archived'}</span></div>
          <div className="button-row"><Link className="button" href={`/teacher/classes/${link.class_id}`}>Open class</Link></div>
        </article>;
      })}</div>}
    </section>

    <details id="create-class" className="card" style={{ marginTop: 16 }} open={classes.length === 0}>
      <summary style={{ cursor: 'pointer', fontWeight: 850 }}>Create another class</summary>
      <div style={{ marginTop: 14 }}>
        <form action={createClassAction} className="auth-form">
          <label>School or organisation<input name="schoolName" placeholder="e.g. Burnley Sixth Form" minLength={2} maxLength={120} required /></label>
          <label>Class name<input name="className" placeholder="e.g. Year 12 Russia" minLength={2} maxLength={80} required /></label>
          <label>Academic year<input name="academicYear" placeholder="e.g. 2026–27" maxLength={20} /></label>
          <button className="button" type="submit">Create class</button>
        </form>
        <p style={{ marginTop: 12 }}>Students join using the class code shown on the class card. <Link href="/student/join">Preview the student join page</Link>.</p>
      </div>
    </details>
  </main>;
}
