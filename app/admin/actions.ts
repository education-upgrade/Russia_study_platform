'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { isPlatformOwner } from '@/lib/auth/owner';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

async function requireAdminOrOwner() {
  const auth = await getAuthenticatedProfile();
  if (!auth) redirect('/login?next=/admin');
  if (auth.profile.role !== 'admin' && !isPlatformOwner(auth.userId)) redirect('/access-denied');
  return auth;
}

function clean(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function bootstrapOwnerAdminAction() {
  const auth = await requireAdminOrOwner();
  if (!isPlatformOwner(auth.userId)) redirect('/admin?error=owner-only');
  const admin = createSupabaseAdminClient();
  if (!admin) redirect('/admin?error=admin-service-not-configured');

  const { error } = await admin.from('profiles').update({ role: 'admin', status: 'active' }).eq('id', auth.userId);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin');
  redirect('/admin?updated=owner-admin');
}

export async function setAccountStatusAction(formData: FormData) {
  const auth = await requireAdminOrOwner();
  const userId = clean(formData.get('userId'));
  const status = clean(formData.get('status'));
  if (!userId || !['active', 'suspended'].includes(status)) redirect('/admin?error=invalid-account-action');
  if (isPlatformOwner(userId)) redirect('/admin?error=owner-protected');

  const admin = createSupabaseAdminClient();
  if (!admin) redirect('/admin?error=admin-service-not-configured');
  const { data: target } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (target?.role === 'admin' && !isPlatformOwner(auth.userId)) redirect('/admin?error=owner-only');

  const { error } = await admin.from('profiles').update({ status }).eq('id', userId);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin');
  redirect('/admin?updated=status');
}

export async function setUserRoleAction(formData: FormData) {
  const auth = await requireAdminOrOwner();
  const userId = clean(formData.get('userId'));
  const role = clean(formData.get('role'));
  if (!userId || !['student', 'teacher', 'admin'].includes(role)) redirect('/admin?error=invalid-role');
  if (isPlatformOwner(userId) && role !== 'admin') redirect('/admin?error=owner-protected');

  const admin = createSupabaseAdminClient();
  if (!admin) redirect('/admin?error=admin-service-not-configured');
  const { data: target } = await admin.from('profiles').select('role').eq('id', userId).maybeSingle();
  const touchesAdminPrivilege = role === 'admin' || target?.role === 'admin';
  if (touchesAdminPrivilege && !isPlatformOwner(auth.userId)) redirect('/admin?error=owner-only');

  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/admin');
  redirect('/admin?updated=role');
}

export async function createAdminAccountAction(formData: FormData) {
  const auth = await requireAdminOrOwner();
  if (!isPlatformOwner(auth.userId)) redirect('/admin?error=owner-only');

  const email = clean(formData.get('email')).toLowerCase();
  const fullName = clean(formData.get('fullName'));
  const password = clean(formData.get('temporaryPassword'));
  if (!email || !email.includes('@') || fullName.length < 2 || password.length < 12) redirect('/admin?error=invalid-admin-account');

  const admin = createSupabaseAdminClient();
  if (!admin) redirect('/admin?error=admin-service-not-configured');

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) redirect(`/admin?error=${encodeURIComponent(error?.message || 'Admin account could not be created')}`);

  const { error: profileError } = await admin.from('profiles').update({ role: 'admin', status: 'active', full_name: fullName }).eq('id', data.user.id);
  if (profileError) {
    try { await admin.auth.admin.deleteUser(data.user.id); } catch { /* best-effort rollback */ }
    redirect(`/admin?error=${encodeURIComponent(profileError.message)}`);
  }

  revalidatePath('/admin');
  redirect('/admin?updated=admin-created');
}
