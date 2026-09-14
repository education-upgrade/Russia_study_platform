import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefixes = ['/student', '/teacher', '/account', '/admin'];

function nextResponseForRequest(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const assignmentId = request.nextUrl.searchParams.get('assignment');

  if (assignmentId) requestHeaders.set('x-assignment-id', assignmentId);
  else requestHeaders.delete('x-assignment-id');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) =>
    cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'),
  );
}

export async function updateSupabaseSession(request: NextRequest) {
  const response = nextResponseForRequest(request);
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  );

  // Middleware is deliberately network-free. The auth cookie is only a fast routing hint;
  // protected server routes still validate the session securely with Supabase before rendering.
  if (isProtected && !hasSupabaseAuthCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
