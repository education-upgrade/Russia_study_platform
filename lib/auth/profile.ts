import type { SupabaseClient } from '@supabase/supabase-js';

export const appRoles = ['student', 'teacher', 'admin'] as const;
export type AppRole = (typeof appRoles)[number];

export const accountStatuses = ['active', 'suspended'] as const;
export type AccountStatus = (typeof accountStatuses)[number];

export type UserProfile = {
  id: string;
  full_name: string;
  role: AppRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && appRoles.includes(value as AppRole);
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, status, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Unable to load authenticated profile', error.message);
    return null;
  }

  if (!data || !isAppRole(data.role)) return null;
  if (data.status !== 'active' && data.status !== 'suspended') return null;

  return data as UserProfile;
}

export function roleLabel(role: AppRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
