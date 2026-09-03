import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefixes = ['/student', '/teacher', '/account'];

function safeLocalPath(value: string | null, fallback = '/account') {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

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

  const { data: { user } } = await supabase.auth.getUser();
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL(safeLocalPath(request.nextUrl.searchParams.get('next')), request.url));
  }

  return response;
}
