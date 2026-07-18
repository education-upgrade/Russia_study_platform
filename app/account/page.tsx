import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (supabase && !user) redirect('/login?next=/account');

  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Authenticated account</p>
        <h1>{user?.user_metadata?.full_name || 'Your account'}</h1>
        <p>{user?.email || 'Supabase authentication is not configured in this environment.'}</p>
        <div className="button-row">
          <Link className="button" href="/student">Open student area</Link>
          <Link className="button secondary" href="/teacher/dashboard">Open teacher area</Link>
          {user && (
            <form action="/auth/signout" method="post">
              <button className="button ghost" type="submit">Sign out</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
