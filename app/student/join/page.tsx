import { redirect } from 'next/navigation';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function joinClass(formData: FormData) {
  'use server';
  await requireRoles(['student']);
  const value = String(formData.get('joinCode') || '').trim().toUpperCase();
  if (value.length !== 6) redirect('/student/join?error=code');
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect('/student/join?error=configuration');
  const { error } = await supabase.rpc('join_class_by_code', { code_input: value });
  if (error) redirect('/student/join?error=not-found');
  redirect('/student/join?joined=1');
}

export default async function JoinClassPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRoles(['student']);
  const params = await searchParams;
  const joined = params.joined === '1';
  const error = typeof params.error === 'string';
  const supabase = await createServerSupabaseClient();
  const { data: memberships } = supabase
    ? await supabase.from('class_memberships').select('class_id, teaching_classes(name, academic_year, schools(name))').eq('status', 'active')
    : { data: [] };

  return (
    <main className="page-shell student-shell">
      <section className="hero">
        <p className="eyebrow">Your teaching groups</p>
        <h1>Join a class</h1>
        <p>Enter the six-character code given to you by your teacher.</p>
        {joined && <div className="callout" role="status"><div><strong>Class joined</strong><p>Your new class is now connected to your account.</p></div></div>}
        {error && <div className="callout" role="alert"><div><strong>Unable to join</strong><p>Check the code with your teacher and try again.</p></div></div>}
        <form action={joinClass} className="auth-form" style={{ maxWidth: 420 }}>
          <label>Class code<input name="joinCode" placeholder="ABC123" minLength={6} maxLength={6} autoCapitalize="characters" required /></label>
          <button className="button" type="submit">Join class</button>
        </form>
      </section>

      <section className="grid three-fixed" style={{ marginTop: 24 }}>
        {(memberships ?? []).length === 0 ? (
          <article className="card"><h2>No classes joined</h2><p>Your classes will appear here after you enter a valid code.</p></article>
        ) : (memberships ?? []).map((membership: any) => {
          const item = membership.teaching_classes;
          const school = Array.isArray(item?.schools) ? item.schools[0] : item?.schools;
          return <article className="card" key={membership.class_id}><p className="eyebrow">{school?.name || 'School'}</p><h2>{item?.name}</h2><p>{item?.academic_year || 'Academic year not set'}</p></article>;
        })}
      </section>
    </main>
  );
}
