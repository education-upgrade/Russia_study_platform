import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublicKey) {
  // The MVP prototype can render static pages before Supabase is configured.
  // Database-backed routes should guard against a null client.
}

export const supabase = supabaseUrl && supabasePublicKey
  ? createClient(supabaseUrl, supabasePublicKey)
  : null;
