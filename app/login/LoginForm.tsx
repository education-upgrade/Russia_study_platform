'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient, isSupabaseAuthConfigured } from '@/lib/supabase/browser';

type Mode = 'sign-in' | 'sign-up';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const configured = isSupabaseAuthConfigured();
  const nextPath = useMemo(() => searchParams.get('next') || '/portal', [searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!configured) {
      setStatus('Supabase authentication is not configured for this deployment.');
      return;
    }

    setSubmitting(true);
    const supabase = createBrowserSupabaseClient();

    if (mode === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus(error.message);
        setSubmitting(false);
        return;
      }
      window.location.assign(nextPath);
      return;
    }

    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackUrl,
        data: { full_name: fullName.trim() || null },
      },
    });

    setStatus(error ? error.message : 'Check your email to confirm your account before signing in.');
    setSubmitting(false);
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="Authentication options">
        <button className={mode === 'sign-in' ? 'auth-tab active' : 'auth-tab'} type="button" onClick={() => setMode('sign-in')}>Sign in</button>
        <button className={mode === 'sign-up' ? 'auth-tab active' : 'auth-tab'} type="button" onClick={() => setMode('sign-up')}>Create account</button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {mode === 'sign-up' && (
          <label>
            Full name
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />
          </label>
        )}
        <label>
          Email address
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required />
        </label>
        <button className="button" type="submit" disabled={submitting || !configured}>
          {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {status && <p className="auth-message" role="status">{status}</p>}
      {!configured && <p className="auth-message warning">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.</p>}
    </div>
  );
}
