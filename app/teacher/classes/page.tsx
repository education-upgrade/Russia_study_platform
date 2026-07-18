import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClassAction } from './actions';

export default async function TeacherClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  const { data: teacherLinks } = supabase && auth
    ? await supabase
        .from('class_teachers')
        .select('class_id, classes(id, name, academic_year, join_code, is_active, schools(name)), class_memberships(count)')
        .eq('teacher_id', auth.userId)
        .order('created_at', { ascending: false })
    : { data: [] };

  const classes = teacherLinks ?? [];
  const error = typeof params.error === 'string' ? params.error : null;
  const created = typeof params.created === 'string' ? params.created : null;

  return (
    <main className="page-shell teacher-shell">
      <section className="teacher-hero">
        <div>
          <p className="eyebrow">Class management</p>
          <h1>My classes</h1>
          <p>Create a teaching group, share its six-character code, and build the student list that assignments and progress will use.</p>
        </div>
        <aside className="teacher-hero-actions">
          <p className="eyebrow">Current total</p>
          <h2>{classes.length} {classes.length === 1 ? 'class' : 'classes'}</h2>
          <p>Only classes connected to your authenticated teacher account appear here.</p>
        </aside>
      </section>

      {created && <div className="callout" role="status"><div><strong>Class created</strong><p>Your class is ready. Share the join code shown below with students.</p></div></div>}
      {error && <div className="callout" role="alert"><div><strong>Class not created</strong><p>Check that both names are entered and that the Supabase migration has been applied.</p></div></div>}

      <section className="grid two" style={{ marginTop: 24 }}>
        <article className="card teal">
          <p className="eyebrow">New class</p>
          <h2>Create a class</h2>
          <form action={createClassAction} className="auth-form">
            <label>School or organisation<input name="schoolName" placeholder="e.g. Burnley Sixth Form" minLength={2} maxLength={120} required /></label>
            <label>Class name<input name="className" placeholder="e.g. Year 12 Russia" minLength={2} maxLength={80} required /></label>
            <label>Academic year<input name="academicYear" placeholder="e.g. 2026–27" maxLength={20} /></label>
            <button className="button" type="submit">Create class</button>
          </form>
        </article>

        <article className="card lavender">
          <p className="eyebrow">Student joining</p>
          <h2>How students enter</h2>
          <p>Students sign in with a student account, open the join page, and enter the code for the correct class.</p>
          <p>The database validates the account role and code before creating membership.</p>
          <Link className="button secondary" href="/student/join">Preview join page</Link>
        </article>
      </section>

      <section style={{ marginTop: 24 }}>
        <p className="eyebrow">Teaching groups</p>
        <div className="grid three-fixed">
          {classes.length === 0 ? (
            <article className="card"><h2>No classes yet</h2><p>Create your first class using the form above.</p></article>
          ) : classes.map((link: any) => {
            const item = link.classes;
            const school = Array.isArray(item?.schools) ? item.schools[0] : item?.schools;
            const membership = Array.isArray(link.class_memberships) ? link.class_memberships[0] : null;
            return (
              <article className="card" key={link.class_id}>
                <p className="eyebrow">{school?.name || 'School'}</p>
                <h2>{item?.name}</h2>
                <p>{item?.academic_year || 'Academic year not set'}</p>
                <div className="button-row compact">
                  <span className="status-pill secure">Code: {item?.join_code}</span>
                  <span className="status-pill submitted">{membership?.count ?? 0} students</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
