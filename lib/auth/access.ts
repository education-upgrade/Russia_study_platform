import { redirect } from 'next/navigation';
import { AuthServiceUnavailableError, getProfile, type AppRole, type UserProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AuthenticatedProfile = {
  userId: string;
  email: string | null;
  profile: UserProfile;
};

export const roleHome: Record<AppRole, string> = {
  student: '/student',
  teacher: '/teacher/dashboard',
  admin: '/admin',
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isStaleSessionError(error: { code?: string; message?: string } | null) {
  const code = error?.code?.toLowerCase() ?? '';
  const message = error?.message?.toLowerCase() ?? '';
  return (
    code.includes('refresh_token') ||
    code === 'session_not_found' ||
    message.includes('refresh token') ||
    message.includes('session not found')
  );
}

export async function getAuthenticatedProfile(): Promise<AuthenticatedProfile | null> {
  const supabase = await createServerSupabaseClient();

  // Preserve the existing local/demo behaviour when Supabase is not configured.
  if (!supabase) return null;

  let user = null;
  let authError: { code?: string; message?: string } | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await supabase.auth.getUser();
    user = result.data.user;
    authError = result.error;
    if (user || !authError) break;
    if (isStaleSessionError(authError)) break;
    if (attempt === 0) await delay(100);
  }

  if (authError && !user) {
    if (isStaleSessionError(authError)) redirect('/auth/clear-session');
    console.error('Unable to validate authenticated session', authError.message);
    redirect('/service-unavailable?source=auth');
  }

  if (!user) redirect('/login');

  try {
    const profile = await getProfile(supabase, user.id);
    if (!profile) redirect('/account?profile=pending');
    if (profile.status === 'suspended') redirect('/account-suspended');

    return {
      userId: user.id,
      email: user.email ?? null,
      profile,
    };
  } catch (error) {
    if (error instanceof AuthServiceUnavailableError) {
      redirect('/service-unavailable?source=profile');
    }
    throw error;
  }
}

export async function requireRoles(allowedRoles: readonly AppRole[]) {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) return null;

  if (!allowedRoles.includes(authenticated.profile.role)) {
    const params = new URLSearchParams({
      required: allowedRoles.join(','),
      actual: authenticated.profile.role,
    });
    redirect(`/access-denied?${params.toString()}`);
  }

  return authenticated;
}

export async function redirectToRoleHome() {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) redirect('/account');
  redirect(roleHome[authenticated.profile.role]);
}
