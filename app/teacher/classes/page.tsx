import Link from 'next/link';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClassAction } from './actions';
import styles from '@/app/teacher/teacherPages.module.css';

function relation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function TeacherClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: teacherLinks } = supabase && auth ? await supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name, academic_year, join_code, is_active, schools(name))')
    .eq('teacher_id', auth.userId)
    .order('created_at', { ascending: false }) : { data: [] };
  const classes = teacherLinks ?? [];
  const error = typeof params.error === 'string' ? params.error : null;
  const created = typeof params.created === 'string' ? params.created : null;

  return <main className={styles.page}>
    {created && <section className={`${styles.notice} ${styles.noticeSuccess}`} role="status"><strong>Class created</strong><p>Your class is ready. Share its join code with students.</p></section>}
    {error && <section className={`${styles.notice} ${styles.noticeError}`} role="alert"><strong>Class not created</strong><p>Check the class details and try again.</p></section>}

    <div className={styles.toolbar}>
      <span className={styles.countPill}>{classes.length} {classes.length === 1 ? 'class' : 'classes'}</span>
      <a className={styles.primaryAction} href="#create-class">+ Create class</a>
    </div>

    {classes.length === 0 ? <section className={styles.empty}><h2>No classes yet</h2><p>Create your first teaching group below, then share its join code with students.</p></section> : <section className={styles.classGrid} aria-label="Teaching classes">{classes.map((link: any) => {
      const item = relation(link.teaching_classes);
      const school = relation(item?.schools);
      if (!item) return null;
      return <article className={styles.card} key={link.class_id}>
        <div className={styles.cardTop}>
          <div><p className={styles.eyebrow}>{school?.name || 'School'}</p><h2>{item.name}</h2><p className={styles.cardDescription}>{item.academic_year || 'Academic year not set'}</p></div>
          <span className={item.is_active ? styles.statusActive : styles.statusArchived}>{item.is_active ? 'Active' : 'Archived'}</span>
        </div>
        <div className={styles.badges}><span className={styles.codeBadge}>Join code {item.join_code}</span></div>
        <div className={styles.actions}><Link className={styles.primaryAction} href={`/teacher/classes/${link.class_id}`}>Open class</Link></div>
      </article>;
    })}</section>}

    <details id="create-class" className={styles.createPanel} open={classes.length === 0}>
      <summary>{classes.length === 0 ? 'Create your first class' : 'Create another class'}</summary>
      <div className={styles.createBody}>
        <p className={styles.createIntro}>Create a teaching group once, then students can join using the code shown on its class card.</p>
        <form action={createClassAction}>
          <div className={styles.formGrid}>
            <label>School or organisation<input name="schoolName" placeholder="e.g. Burnley Sixth Form" minLength={2} maxLength={120} required /></label>
            <label>Class name<input name="className" placeholder="e.g. Year 12 Russia" minLength={2} maxLength={80} required /></label>
            <label>Academic year<input name="academicYear" placeholder="e.g. 2026–27" maxLength={20} /></label>
          </div>
          <div className={styles.formActions}><p className={styles.formHint}>Want to see the student experience? <Link href="/student/join">Preview the join page</Link>.</p><button className={styles.primaryAction} type="submit">Create class</button></div>
        </form>
      </div>
    </details>
  </main>;
}
