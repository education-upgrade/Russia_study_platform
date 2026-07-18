import { redirect } from 'next/navigation';
import { getProfile, type AppRole, type UserProfile } from '@/lib/auth/profile';
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

export async function getAuthenticatedProfile(): Promise<AuthenticatedProfile | null> {
  const supabase = await createServerSupabaseClient();

  // Preserve the existing local/demo behaviour when Supabase is not configured.
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect('/account?profile=pending');
  if (profile.status === 'suspended') redirect('/account-suspended');

  return {
    userId: user.id,
    email: user.email ?? null,
    profile,
  };
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
