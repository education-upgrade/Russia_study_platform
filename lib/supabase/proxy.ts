import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { safeLocalPath } from '@/lib/navigation';

const protectedPrefixes = ['/student', '/teacher', '/account'];

function getSupabasePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function nextResponseForRequest(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const assignmentId = request.nextUrl.searchParams.get('assignment');

  if (assignmentId) requestHeaders.set('x-assignment-id', assignmentId);
  else requestHeaders.delete('x-assignment-id');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function isStaleSessionError(error: unknown) {
  const candidate = error as { code?: string; message?: string } | null;
  const code = candidate?.code?.toLowerCase() ?? '';
  const message = candidate?.message?.toLowerCase() ?? '';
  return (
    code.includes('refresh_token') ||
    code === 'session_not_found' ||
    message.includes('refresh token') ||
    message.includes('session not found')
  );
}

function clearSupabaseAuthCookies(request: NextRequest, targetResponse: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (!cookie.name.startsWith('sb-') || !cookie.name.includes('auth-token')) continue;
    request.cookies.delete(cookie.name);
    targetResponse.cookies.set(cookie.name, '', { path: '/', maxAge: 0 });
  }
}

export async function updateSupabaseSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = getSupabasePublicKey();

  if (!url || !publicKey) return nextResponseForRequest(request);

  let response = nextResponseForRequest(request);
  const supabase = createServerClient(url, publicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = nextResponseForRequest(request);
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const staleSession = !user && Boolean(authError) && isStaleSessionError(authError);
  if (staleSession) clearSupabaseAuthCookies(request, response);

  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const redirectResponse = NextResponse.redirect(loginUrl);
    if (staleSession) clearSupabaseAuthCookies(request, redirectResponse);
    return redirectResponse;
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL(safeLocalPath(request.nextUrl.searchParams.get('next')), request.url));
  }

  return response;
}
