import { supabase } from '@/lib/supabase';

export default async function DiagnosticsPage() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let status = 'Supabase client not configured yet.';
  let details = 'Check Vercel environment variables and redeploy.';

  if (supabase) {
    const { error } = await supabase.from('courses').select('id').limit(1);

    if (error) {
      status = 'Supabase variables are present, but the database query failed.';
      details = error.message;
    } else {
      status = 'Supabase connection is working.';
      details = 'The app can query the courses table.';
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Diagnostics</p>
        <h1>Supabase connection check</h1>
        <p>This page checks whether the deployed app can see the Supabase environment variables and query the database.</p>
      </section>

      <section className="grid">
        <article className="card">
          <p className="eyebrow">Environment variables</p>
          <h2>Configuration</h2>
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {hasUrl ? 'Present' : 'Missing'}</p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {hasAnonKey ? 'Present' : 'Missing'}</p>
        </article>

        <article className="card teal">
          <p className="eyebrow">Database query</p>
          <h2>{status}</h2>
          <p>{details}</p>
        </article>
      </section>
    </main>
  );
}
