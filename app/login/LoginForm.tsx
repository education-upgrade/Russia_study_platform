'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient, isSupabaseAuthConfigured } from '@/lib/supabase/browser';
import styles from './login.module.css';

type Mode = 'sign-in' | 'sign-up';
type AccountType = 'student' | 'staff';

function getPublicAppOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  return window.location.origin;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [staffCode, setStaffCode] = useState('');
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

    const callbackUrl = `${getPublicAppOrigin()}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    if (accountType === 'staff') {
      const response = await fetch('/api/auth/staff-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, staffCode, callbackUrl }),
      });
      const result = await response.json().catch(() => ({}));
      setStatus(response.ok ? 'Staff account created. Check your email to confirm your account before signing in.' : result.error || 'Staff account could not be created.');
      setSubmitting(false);
      return;
    }

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

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setStatus(null);
  }

  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Authentication options">
        <button className={`${styles.tab} ${mode === 'sign-in' ? styles.tabActive : ''}`} type="button" onClick={() => switchMode('sign-in')}>Sign in</button>
        <button className={`${styles.tab} ${mode === 'sign-up' ? styles.tabActive : ''}`} type="button" onClick={() => switchMode('sign-up')}>Create account</button>
      </div>

      <form className={styles.form} onSubmit={submit}>
        {mode === 'sign-up' && (
          <>
            <p className={styles.sectionLabel}>Who is this account for?</p>
            <div className={styles.accountType} role="group" aria-label="Account type">
              <button className={`${styles.accountButton} ${accountType === 'student' ? styles.accountButtonActive : ''}`} type="button" onClick={() => setAccountType('student')}>Student</button>
              <button className={`${styles.accountButton} ${accountType === 'staff' ? styles.accountButtonActive : ''}`} type="button" onClick={() => setAccountType('staff')}>Staff</button>
            </div>
            <label className={styles.field}>
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />
            </label>
            {accountType === 'staff' && (
              <label className={styles.field}>
                Staff invite code
                <input type="password" value={staffCode} onChange={(event) => setStaffCode(event.target.value)} autoComplete="off" required />
                <small>Use the private code supplied by the platform administrator.</small>
              </label>
            )}
          </>
        )}

        <label className={styles.field}>
          Email address
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>
        <label className={styles.field}>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required />
          {mode === 'sign-up' && <small>Use at least 8 characters.</small>}
        </label>
        <button className={styles.submit} type="submit" disabled={submitting || !configured}>
          {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : accountType === 'staff' ? 'Create staff account' : 'Create student account'}
        </button>
      </form>

      {status && <p className={styles.message} role="status">{status}</p>}
      {!configured && <p className={`${styles.message} ${styles.warning}`}>Authentication is not configured for this deployment.</p>}
    </div>
  );
}
