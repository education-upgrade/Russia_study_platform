'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createBrowserSupabaseClient, isSupabaseAuthConfigured } from '@/lib/supabase/browser';
import styles from '../login/login.module.css';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const exchangeStarted = useRef(false);
  const configured = isSupabaseAuthConfigured();

  useEffect(() => {
    if (exchangeStarted.current) return;
    exchangeStarted.current = true;

    if (!configured) {
      setStatus('Supabase authentication is not configured for this deployment.');
      setCheckingSession(false);
      return;
    }

    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      setStatus('This password reset link is invalid or has expired. Request a new reset email from the sign-in page.');
      setCheckingSession(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    let active = true;

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (!active) return;

      if (error) {
        setReady(false);
        setStatus('This password reset link could not be verified. It may have expired or already been used. Request a new reset email and try again.');
        setCheckingSession(false);
        return;
      }

      window.history.replaceState({}, '', '/reset-password');
      setReady(true);
      setCheckingSession(false);
    });

    return () => {
      active = false;
    };
  }, [configured]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!configured || !ready) return;

    if (password.length < 8) {
      setStatus('Use at least 8 characters for your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('Your password could not be changed. The reset link may have expired; please request a new one and try again.');
      setSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    window.location.assign('/login?reset=success');
  }

  return (
    <div className={styles.card}>
      <div className={styles.resetIntro}>
        <p className={styles.sectionLabel}>Secure your account</p>
        <p>Choose a new password for your account. It must contain at least 8 characters.</p>
      </div>

      {checkingSession ? (
        <p className={styles.message} role="status">Checking your password reset link…</p>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={!ready || submitting}
            />
            <small>Use at least 8 characters.</small>
          </label>
          <label className={styles.field}>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={!ready || submitting}
            />
          </label>
          <button className={styles.submit} type="submit" disabled={!ready || submitting || !configured}>
            {submitting ? 'Changing password…' : 'Change password'}
          </button>
          <button className={styles.secondaryButton} type="button" onClick={() => window.location.assign('/login')}>
            Back to sign in
          </button>
        </form>
      )}

      {status && <p className={styles.message} role="status">{status}</p>}
      {!configured && <p className={`${styles.message} ${styles.warning}`}>Authentication is not configured for this deployment.</p>}
    </div>
  );
}
