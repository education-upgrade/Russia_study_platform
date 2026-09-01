import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function getPublicAppOrigin(requestUrl: URL) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return configured ? configured.replace(/\/$/, '') : requestUrl.origin;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const publicOrigin = getPublicAppOrigin(requestUrl);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/account';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(safeNext, publicOrigin));
    }
  }

  const loginUrl = new URL('/login', publicOrigin);
  loginUrl.searchParams.set('error', 'Authentication could not be completed. Please try again.');
  return NextResponse.redirect(loginUrl);
}
