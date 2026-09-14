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

export class AuthServiceUnavailableError extends Error {
  constructor(message = 'Authentication service temporarily unavailable') {
    super(message);
    this.name = 'AuthServiceUnavailableError';
  }
}

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && appRoles.includes(value as AppRole);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  let lastError: { message?: string } | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, status, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (!error) {
      if (!data || !isAppRole(data.role)) return null;
      if (data.status !== 'active' && data.status !== 'suspended') return null;
      return data as UserProfile;
    }

    lastError = error;
    if (attempt < 2) await delay(150 * (attempt + 1));
  }

  console.error('Unable to load authenticated profile', lastError?.message ?? 'Unknown profile error');
  throw new AuthServiceUnavailableError(lastError?.message);
}

export function roleLabel(role: AppRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
