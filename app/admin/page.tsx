import Link from 'next/link';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { getPlatformOwnerUserId, isPlatformOwner } from '@/lib/auth/owner';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { bootstrapOwnerAdminAction, createAdminAccountAction, setAccountStatusAction, setUserRoleAction } from './actions';
import styles from './page.module.css';

type Profile = { id: string; full_name: string; role: 'student' | 'teacher' | 'admin'; status: 'active' | 'suspended'; created_at: string };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatDate(value: string | undefined) {
  return value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = await getAuthenticatedProfile();
  const params = await searchParams;
  if (!auth) return null;

  const owner = isPlatformOwner(auth.userId);
  const ownerConfigured = Boolean(getPlatformOwnerUserId());
  const admin = createSupabaseAdminClient();
  const error = typeof params.error === 'string' ? params.error : null;
  const updated = typeof params.updated === 'string' ? params.updated : null;

  let profiles: Profile[] = [];
  let emailById = new Map<string, string>();
  let loadError = '';

  if (admin) {
    const [{ data: profileData, error: profileError }, { data: userData, error: userError }] = await Promise.all([
      admin.from('profiles').select('id, full_name, role, status, created_at').order('created_at', { ascending: false }),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);
    if (profileError || userError) loadError = profileError?.message || userError?.message || 'Accounts could not be loaded.';
    profiles = (profileData ?? []) as Profile[];
    (userData?.users ?? []).forEach((user) => emailById.set(user.id, user.email ?? ''));
  }

  const students = profiles.filter((profile) => profile.role === 'student');
  const staff = profiles.filter((profile) => profile.role === 'teacher');
  const admins = profiles.filter((profile) => profile.role === 'admin');
  const suspended = profiles.filter((profile) => profile.status === 'suspended').length;

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>Platform administration</p><h1>Admin workspace</h1><p>Manage platform accounts. Admin creation is restricted to the configured platform owner.</p></div>
      <div className={styles.headerActions}><Link href="/teacher/dashboard">Teacher area</Link><form action="/auth/signout" method="post"><button type="submit">Sign out</button></form></div>
    </header>

    {!ownerConfigured && <section className={styles.alert}><strong>Owner protection is not configured.</strong><p>Add <code>PLATFORM_OWNER_USER_ID</code> to the server environment before using admin creation.</p></section>}
    {!admin && <section className={styles.alert}><strong>Admin account management is not configured.</strong><p>Add the server-only <code>SUPABASE_SERVICE_ROLE_KEY</code>. Never expose it as a NEXT_PUBLIC variable.</p></section>}
    {error && <section className={styles.alert}><strong>Action not completed</strong><p>{error}</p></section>}
    {updated && <section className={styles.success}><strong>Account management updated.</strong></section>}
    {loadError && <section className={styles.alert}><strong>Accounts could not be loaded.</strong><p>{loadError}</p></section>}

    <section className={styles.metrics}>
      <article><span>Students</span><strong>{students.length}</strong></article><article><span>Teachers</span><strong>{staff.length}</strong></article><article><span>Admins</span><strong>{admins.length}</strong></article><article><span>Suspended</span><strong>{suspended}</strong></article>
    </section>

    {owner && auth.profile.role !== 'admin' && <section className={styles.panel}><div><p className={styles.eyebrow}>Owner bootstrap</p><h2>Make this owner account an admin</h2><p>Your user ID matches the protected platform owner ID. Promote this account once to activate the full admin role.</p></div><form action={bootstrapOwnerAdminAction}><button className={styles.primary} type="submit">Activate admin role</button></form></section>}

    {owner && <section className={styles.panel}>
      <div><p className={styles.eyebrow}>Owner only</p><h2>Create an administrator</h2><p>This form is visible and executable only for the platform owner. Other admins cannot create or promote administrators.</p></div>
      <form className={styles.createForm} action={createAdminAccountAction}>
        <label>Name<input name="fullName" required minLength={2} /></label><label>Email<input name="email" type="email" required /></label><label>Temporary password<input name="temporaryPassword" type="password" required minLength={12} autoComplete="new-password" /><small>At least 12 characters. Share separately and require the user to change it.</small></label><button className={styles.primary} type="submit">Create admin account</button>
      </form>
    </section>}

    <section className={styles.panel}>
      <div><p className={styles.eyebrow}>Accounts</p><h2>Students and staff</h2><p>Change student/teacher roles or suspend access. The platform owner account is protected.</p></div>
      <div className={styles.tableWrap}><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{profiles.map((profile) => {
        const protectedOwner = isPlatformOwner(profile.id);
        return <tr key={profile.id}><td><strong>{profile.full_name || 'Unnamed user'}</strong><small>{emailById.get(profile.id) || 'Email unavailable'}{protectedOwner ? ' · Platform owner' : ''}</small></td><td>{profile.role}</td><td>{profile.status}</td><td>{formatDate(profile.created_at)}</td><td><div className={styles.actions}>
          {!protectedOwner && <form action={setAccountStatusAction}><input type="hidden" name="userId" value={profile.id}/><input type="hidden" name="status" value={profile.status === 'active' ? 'suspended' : 'active'}/><button type="submit">{profile.status === 'active' ? 'Suspend' : 'Reactivate'}</button></form>}
          {!protectedOwner && profile.role !== 'admin' && <form action={setUserRoleAction}><input type="hidden" name="userId" value={profile.id}/><input type="hidden" name="role" value={profile.role === 'student' ? 'teacher' : 'student'}/><button type="submit">Make {profile.role === 'student' ? 'teacher' : 'student'}</button></form>}
          {owner && !protectedOwner && profile.role !== 'admin' && <form action={setUserRoleAction}><input type="hidden" name="userId" value={profile.id}/><input type="hidden" name="role" value="admin"/><button type="submit">Make admin</button></form>}
        </div></td></tr>;
      })}</tbody></table></div>
    </section>
  </main>;
}
