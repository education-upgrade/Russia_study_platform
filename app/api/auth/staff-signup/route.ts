import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getPublicAppOrigin, safeLocalPath } from '@/lib/navigation';

function hashRateLimitKey(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function getRequestIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function inviteCodesMatch(supplied: string, expected: string) {
  const suppliedBuffer = Buffer.from(supplied, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

async function consumeRateLimit(admin: SupabaseClient<any>, key: string, maxAttempts: number) {
  const { data, error } = await admin.rpc('consume_staff_signup_rate_limit', {
    key_hash_input: hashRateLimitKey(key),
    max_attempts_input: maxAttempts,
    window_seconds_input: 15 * 60,
  });

  if (error) return { ok: false as const, retryAfter: 60 };
  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: Boolean(row?.allowed),
    retryAfter: Number(row?.retry_after_seconds || 0),
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const staffCode = typeof body?.staffCode === 'string' ? body.staffCode.trim() : '';
  const nextPath = safeLocalPath(typeof body?.nextPath === 'string' ? body.nextPath : null, '/portal');
  const expectedCode = process.env.STAFF_SIGNUP_CODE?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publicKey) return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
  if (!expectedCode) return NextResponse.json({ error: 'Staff account creation is not enabled.' }, { status: 503 });
  if (!serviceRoleKey) return NextResponse.json({ error: 'Secure staff account creation is not configured.' }, { status: 503 });
  if (!email || !email.includes('@') || password.length < 8 || !fullName) {
    return NextResponse.json({ error: 'Enter your name, email address and a password of at least 8 characters.' }, { status: 400 });
  }

  const admin: SupabaseClient<any> = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const requestIp = getRequestIp(request);
  const rateChecks = [
    await consumeRateLimit(admin, `staff-signup:email-ip:${email}:${requestIp}`, 6),
    ...(requestIp !== 'unknown' ? [await consumeRateLimit(admin, `staff-signup:ip:${requestIp}`, 30)] : []),
  ];
  const blocked = rateChecks.find((check) => !check.ok);
  if (blocked) {
    return NextResponse.json(
      { error: 'Too many staff account attempts. Please wait before trying again.' },
      { status: 429, headers: { 'Retry-After': String(Math.max(blocked.retryAfter, 1)) } },
    );
  }

  if (!staffCode || !inviteCodesMatch(staffCode, expectedCode)) {
    return NextResponse.json({ error: 'The staff invite code is not valid.' }, { status: 403 });
  }

  const publicOrigin = getPublicAppOrigin(new URL(request.url).origin);
  const callbackUrl = `${publicOrigin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  const supabase = createClient(url, publicKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl, data: { full_name: fullName } },
  });

  if (error || !data.user) return NextResponse.json({ error: error?.message || 'Staff account could not be created.' }, { status: 400 });

  const { error: profileError } = await admin.from('profiles').update({ role: 'teacher', full_name: fullName }).eq('id', data.user.id);
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id).catch(() => undefined);
    return NextResponse.json({ error: 'The staff account could not be authorised. No account was kept.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, requiresEmailConfirmation: !data.session });
}
