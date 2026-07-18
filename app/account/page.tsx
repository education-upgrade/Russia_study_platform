import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile, roleLabel } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (supabase && !user) redirect('/login?next=/account');

  const profile = supabase && user ? await getProfile(supabase, user.id) : null;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Your account';

  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Authenticated account</p>
        <h1>{displayName}</h1>
        <p>{user?.email || 'Supabase authentication is not configured in this environment.'}</p>

        {profile ? (
          <div className="button-row compact" aria-label="Account profile details">
            <span className="status-pill submitted">{roleLabel(profile.role)}</span>
            <span className={profile.status === 'active' ? 'status-pill secure' : 'status-pill intervention'}>
              {profile.status === 'active' ? 'Active account' : 'Suspended account'}
            </span>
          </div>
        ) : user ? (
          <div className="callout" role="status">
            <span className="callout-icon">!</span>
            <div>
              <strong>Profile setup pending</strong>
              <p>Your login works, but the profiles database migration has not created your application profile yet.</p>
            </div>
          </div>
        ) : null}

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
