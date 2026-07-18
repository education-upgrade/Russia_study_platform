import '@/lib/unit6RegistryActivation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { materialisePathwayActivities } from '@/lib/pathwayActivityPersistence';
import { resolvePathwayActivities } from '@/lib/pathwayResolver';
import styles from '@/app/student/lesson/1905/page.module.css';

type Assignment = {
  id: string;
  mode: string;
  required_activity_types: string[];
  due_at: string | null;
  instructions: string | null;
  pathway_slug: string;
  status: string;
};

type RecipientRow = {
  assignment_id: string;
  assigned_at: string;
  classroom_assignments: Assignment | Assignment[] | null;
};

type ActivityProgressRow = {
  activity_type: string;
  status: 'not_started' | 'in_progress' | 'complete';
};

type Props = {
  pathwaySlug: string;
  fallbackInstructions?: string;
  fallbackContentByActivityType?: Record<string, unknown>;
};

function dateLabel(value: string | null) {
  return value
    ? new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No deadline';
}

function unwrapAssignment(value: Assignment | Assignment[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResolvedModularPathwayPage({
  pathwaySlug,
  fallbackInstructions,
  fallbackContentByActivityType = {},
}: Props) {
  const config = getPathwayConfig(pathwaySlug);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return (
      <main className={styles.shell}>
        <section className={styles.mainCard}>Supabase is not configured.</section>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let assignment: Assignment | null = null;

  if (user) {
    const { data: recipientRows } = await supabase
      .from('assignment_recipients')
      .select(
        'assignment_id, assigned_at, classroom_assignments(id, mode, required_activity_types, due_at, instructions, pathway_slug, status)',
      )
      .eq('student_id', user.id)
      .eq('status', 'assigned')
      .order('assigned_at', { ascending: false });

    assignment = ((recipientRows ?? []) as RecipientRow[])
      .map((row) => unwrapAssignment(row.classroom_assignments))
      .find((item) => item?.status === 'published' && item.pathway_slug === pathwaySlug) ?? null;
  }

  const { data: lessonRows } = await supabase
    .from('lessons')
    .select('id')
    .eq('title', config.lessonTitle)
    .limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows[0] ? lessonRows[0] : null;

  const { data: seeded } = lesson
    ? await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id)
    : { data: [] };

  const resolved = resolvePathwayActivities({
    pathwaySlug,
    seededActivities: seeded ?? [],
    requiredActivityTypes: assignment?.required_activity_types ?? [],
    fallbackContentByActivityType,
  });
  const activities = await materialisePathwayActivities(pathwaySlug, resolved);

  let activityProgress: ActivityProgressRow[] = [];
  if (assignment && user) {
    const { data } = await supabase
      .from('student_activity_progress')
      .select('activity_type, status')
      .eq('assignment_id', assignment.id)
      .eq('student_id', user.id);
    activityProgress = (data ?? []) as ActivityProgressRow[];
  }

  const progressByType = new Map(activityProgress.map((row) => [row.activity_type, row.status]));
  const assignmentQuery = assignment ? `?assignment=${assignment.id}` : '';

  const items = activities.map((activity) => {
    const status = assignment ? progressByType.get(activity.activity_type) ?? 'not_started' : 'not_started';
    return {
      ...activity,
      status,
      complete: status === 'complete',
      href: `${config.routeBase}/${activity.routeSlug}${assignmentQuery}`,
    };
  });

  const done = items.filter((item) => item.complete).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const next = items.find((item) => !item.complete) ?? null;

  return (
    <main className={styles.shell}>
      <section className={styles.mainCard}>
        <header className={styles.summary}>
          <p className={styles.eyebrow}>{assignment ? 'Teacher-set pathway' : 'Independent pathway'}</p>
          <h1>{config.title}</h1>
          <p>{assignment?.instructions ?? fallbackInstructions ?? 'Complete the pathway one task at a time.'}</p>
          <div className={styles.metaRow}>
            <span className={styles.pill}>{assignment?.mode?.replaceAll('_', ' ') ?? 'practice mode'}</span>
            <span className={styles.pill}>{dateLabel(assignment?.due_at ?? null)}</span>
            <span className={styles.pill}>{done}/{items.length} activities complete</span>
          </div>
        </header>

        <section className={styles.nextPanel}>
          <div>
            <p className={styles.eyebrow}>{next ? 'Next task' : 'Finished'}</p>
            <h2>{next ? getActivityLabel(next.activity_type) : 'Review pathway'}</h2>
            <p>{next?.title ?? 'All required activities have been saved.'}</p>
          </div>
          <Link className={styles.primaryButton} href={next?.href ?? `${config.routeBase}${assignmentQuery}`}>
            {next ? 'Start now' : 'Review route'}
          </Link>
        </section>

        <section className={styles.route}>
          <div className={styles.progressTop}>
            <strong>Your route</strong>
            <span>{pct}% complete</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ '--progress': `${pct}%` } as React.CSSProperties} />
          </div>
          <div className={styles.routeList}>
            {items.map((item, index) => (
              <Link
                className={`${styles.routeItem} ${item.complete ? styles.complete : ''} ${next?.activity_type === item.activity_type ? styles.current : ''}`}
                href={item.href}
                key={`${item.id}-${item.activity_type}`}
              >
                <span className={styles.routeMark}>{item.complete ? '✓' : index + 1}</span>
                <span className={styles.routeText}>
                  <strong>{item.label}</strong>
                  <span>{item.title}</span>
                </span>
                <span className={styles.routeStatus}>
                  {item.complete ? 'Done' : next?.activity_type === item.activity_type ? 'Next' : 'To do'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
