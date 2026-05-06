import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DataCheckPage() {
  let coursesCount = 0;
  let unitsCount = 0;
  let lessonsCount = 0;
  let activitiesCount = 0;
  let status = 'Database not checked yet.';
  let details = 'Supabase may not be configured.';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : 'missing';

  if (supabase) {
    const [courses, units, lessons, activities] = await Promise.all([
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('units').select('*', { count: 'exact', head: true }),
      supabase.from('lessons').select('*', { count: 'exact', head: true }),
      supabase.from('activities').select('*', { count: 'exact', head: true }),
    ]);

    const errors = [courses.error, units.error, lessons.error, activities.error].filter(Boolean);

    if (errors.length > 0) {
      status = 'Database query failed.';
      details = errors.map((error) => error?.message).join(' | ');
    } else {
      coursesCount = courses.count ?? 0;
      unitsCount = units.count ?? 0;
      lessonsCount = lessons.count ?? 0;
      activitiesCount = activities.count ?? 0;
      status = 'Database query working.';
      details = 'The app can count seeded course, unit, lesson and activity records.';
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Data check</p>
        <h1>1905 MVP seed data</h1>
        <p>This page checks whether the Supabase database contains the first course, unit, lesson and activity records.</p>
      </section>

      <section className="grid">
        <article className="card teal">
          <p className="eyebrow">Status</p>
          <h2>{status}</h2>
          <p>{details}</p>
        </article>

        <article className="card">
          <p className="eyebrow">Supabase project</p>
          <h2>Connected host</h2>
          <p><strong>Host:</strong> {supabaseHost}</p>
          <p>This must match the project where you ran the seed SQL.</p>
        </article>

        <article className="card">
          <p className="eyebrow">Record counts</p>
          <h2>Current database</h2>
          <p><strong>Courses:</strong> {coursesCount}</p>
          <p><strong>Units:</strong> {unitsCount}</p>
          <p><strong>Lessons:</strong> {lessonsCount}</p>
          <p><strong>Activities:</strong> {activitiesCount}</p>
        </article>
      </section>
    </main>
  );
}
