import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getPublicAppOrigin, safeLocalPath } from '@/lib/navigation';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const publicOrigin = getPublicAppOrigin(requestUrl.origin);
  const code = requestUrl.searchParams.get('code');
  const safeNext = safeLocalPath(requestUrl.searchParams.get('next'), '/account');

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
