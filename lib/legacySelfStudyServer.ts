import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type LegacySelfStudyAccess =
  | { ok: true; client: SupabaseClient<any>; userId: string; legacyUserId: string }
  | { ok: false; status: number; error: string };

/**
 * Transitional persistence for independent/self-study activities that still use
 * the original response tables. Each authenticated account is mapped to its own
 * legacy users row so independent study can never share the old demo student ID.
 * Assigned classroom work continues to use student_activity_progress.
 */
export async function getLegacySelfStudyAccess(): Promise<LegacySelfStudyAccess> {
  const sessionClient = await createServerSupabaseClient();
  if (!sessionClient) return { ok: false, status: 503, error: 'Supabase is not configured.' };

  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) return { ok: false, status: 401, error: 'Sign in before saving study progress.' };

  const profile = await getProfile(sessionClient, user.id);
  if (!profile || profile.status !== 'active') return { ok: false, status: 403, error: 'This account cannot save study progress.' };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return { ok: false, status: 503, error: 'Secure study persistence is not configured.' };

  const client: SupabaseClient<any> = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingByAuth, error: lookupError } = await client
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle();
  if (lookupError) return { ok: false, status: 503, error: 'Study persistence could not be prepared.' };

  let legacyUserId = existingByAuth?.id as string | undefined;
  if (!legacyUserId && user.email) {
    const { data: existingByEmail } = await client.from('users').select('id').eq('email', user.email).maybeSingle();
    legacyUserId = existingByEmail?.id as string | undefined;
    if (legacyUserId) {
      const { error: linkError } = await client.from('users').update({ auth_user_id: user.id }).eq('id', legacyUserId);
      if (linkError) return { ok: false, status: 503, error: 'Study persistence could not be linked to this account.' };
    }
  }

  if (!legacyUserId) {
    const { data: created, error: createError } = await client
      .from('users')
      .insert({
        id: user.id,
        auth_user_id: user.id,
        name: profile.full_name,
        display_name: profile.full_name,
        email: user.email ?? `${user.id}@local.invalid`,
        role: 'student',
      })
      .select('id')
      .single();
    if (createError || !created) return { ok: false, status: 503, error: 'Study persistence could not be created for this account.' };
    legacyUserId = created.id as string;
  }

  return { ok: true, client, userId: user.id, legacyUserId };
}
