import { redirect } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function joinClass(formData: FormData) {
  'use server';
  await requireRoles(['student']);
  const value = String(formData.get('joinCode') || '').trim().toUpperCase();
  if (value.length !== 6) redirect('/student/join?error=code&join=1');
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect('/student/join?error=configuration&join=1');
  const { error } = await supabase.rpc('join_class_by_code', { code_input: value });
  if (error) redirect('/student/join?error=not-found&join=1');
  redirect('/student/join?joined=1');
}

export default async function MyClassesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRoles(['student']);
  const params = await searchParams;
  const joined = params.joined === '1';
  const error = typeof params.error === 'string';
  const showJoin = params.join === '1' || error;
  const supabase = await createServerSupabaseClient();
  const { data: memberships } = supabase
    ? await supabase.from('class_memberships').select('class_id, teaching_classes(name, academic_year, schools(name))').eq('status', 'active')
    : { data: [] };
  const hasClasses = (memberships ?? []).length > 0;

  return <main className="page-shell student-shell">
    <section className="hero">
      <p className="eyebrow">My classes</p>
      <h1>Your teaching groups</h1>
      <p>These are the classes connected to your account.</p>
      {joined && <div className="callout" role="status"><div><strong>Class joined</strong><p>Your new class is now connected to your account.</p></div></div>}
      {error && <div className="callout" role="alert"><div><strong>Unable to join</strong><p>Check the six-character code with your teacher and try again.</p></div></div>}
    </section>

    <section className="grid three-fixed" style={{ marginTop: 18 }}>
      {!hasClasses ? <article className="card"><p className="eyebrow">First step</p><h2>Join your first class</h2><p>Use the six-character code given to you by your teacher.</p></article> : (memberships ?? []).map((membership: any) => {
        const item = membership.teaching_classes;
        const school = Array.isArray(item?.schools) ? item.schools[0] : item?.schools;
        return <article className="card" key={membership.class_id}><p className="eyebrow">{school?.name || 'School'}</p><h2>{item?.name}</h2><p>{item?.academic_year || 'Academic year not set'}</p></article>;
      })}
    </section>

    <section className="card" style={{ marginTop: 18 }}>
      <div className="button-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}><div><p className="eyebrow">Class code</p><h2 style={{ marginBottom: 4 }}>{hasClasses ? 'Join another class' : 'Join a class'}</h2><p style={{ margin: 0 }}>Only use this when your teacher gives you a new code.</p></div>{!showJoin && <a className="button secondary" href="/student/join?join=1">+ Join class</a>}</div>
      {(showJoin || !hasClasses) && <form action={joinClass} className="auth-form" style={{ maxWidth: 420, marginTop: 14 }}><label>Six-character class code<input name="joinCode" placeholder="ABC123" minLength={6} maxLength={6} autoCapitalize="characters" required /></label><button className="button" type="submit">Join class</button></form>}
    </section>
  </main>;
}
