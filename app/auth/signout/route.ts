import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const client = await createServerSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }

  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
