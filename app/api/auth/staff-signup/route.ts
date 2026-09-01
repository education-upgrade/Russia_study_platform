import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const staffCode = typeof body?.staffCode === 'string' ? body.staffCode.trim() : '';
  const callbackUrl = typeof body?.callbackUrl === 'string' ? body.callbackUrl : '';
  const expectedCode = process.env.STAFF_SIGNUP_CODE?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
  if (!expectedCode) return NextResponse.json({ error: 'Staff account creation is not enabled.' }, { status: 503 });
  if (!staffCode || staffCode !== expectedCode) return NextResponse.json({ error: 'The staff invite code is not valid.' }, { status: 403 });
  if (!email || password.length < 8 || !fullName) return NextResponse.json({ error: 'Enter your name, email address and a password of at least 8 characters.' }, { status: 400 });

  const supabase = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl || undefined,
      data: { full_name: fullName, requested_role: 'teacher', staff_invite_verified: true },
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, userId: data.user?.id ?? null });
}
