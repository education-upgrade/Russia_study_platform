import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type LegacySelfStudyAccess =
  | { ok: true; client: ReturnType<typeof createClient>; userId: string }
  | { ok: false; status: number; error: string };

/**
 * Transitional persistence for independent/self-study activities that still use
 * the original demo response tables. The legacy tables are never exposed
 * directly to the browser: the caller must have a real Supabase session and
 * database access is performed server-side with the service role.
 *
 * Assigned classroom work does not use this path; it is stored in
 * student_activity_progress against the authenticated student and assignment.
 */
export async function getLegacySelfStudyAccess(): Promise<LegacySelfStudyAccess> {
  const sessionClient = await createServerSupabaseClient();
  if (!sessionClient) {
    return { ok: false, status: 503, error: 'Supabase is not configured.' };
  }

  const { data: { user }, error: authError } = await sessionClient.auth.getUser();
  if (authError || !user) {
    return { ok: false, status: 401, error: 'Sign in before saving study progress.' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return { ok: false, status: 503, error: 'Secure study persistence is not configured.' };
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return { ok: true, client, userId: user.id };
}
