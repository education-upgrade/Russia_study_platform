import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthServiceUnavailableError, getProfile, roleLabel } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();

  let user = null;
  let authError: { message?: string } | null = null;

  if (supabase) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await supabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
      if (user || !authError) break;
      if (attempt < 2) await delay(150 * (attempt + 1));
    }
  }

  if (supabase && authError && !user) redirect('/service-unavailable?source=auth');
  if (supabase && !user) redirect('/login?next=/account');

  let profile = null;
  try {
    profile = supabase && user ? await getProfile(supabase, user.id) : null;
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) redirect('/service-unavailable?source=profile');
    throw error;
  }

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
          <Link className="button ghost" href="/privacy">Privacy & data protection</Link>
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
