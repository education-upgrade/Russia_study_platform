import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DEMO_STUDENT_ID } from '@/lib/demoIdentity';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { getActivityLabel, isTrackableActivity } from '@/lib/activityTypeRegistry';
import { materialisePathwayActivities } from '@/lib/pathwayActivityPersistence';
import { resolvePathwayActivities } from '@/lib/pathwayResolver';
import { resolveUnifiedActivityState } from '@/lib/activityState';
import styles from '@/app/student/lesson/1905/page.module.css';

type Assignment = { mode: string; required_activity_types: string[]; deadline_at: string | null; instructions: string | null };
type ResponseRow = { activity_id: string | null; status: string; score?: number | null; response_json: any; last_saved_at?: string | null };
type Props = { pathwaySlug: string; fallbackInstructions?: string; fallbackContentByActivityType?: Record<string, any> };

function dateLabel(value: string | null) { return value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No deadline'; }

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResolvedModularPathwayPage({ pathwaySlug, fallbackInstructions, fallbackContentByActivityType = {} }: Props) {
  const config = getPathwayConfig(pathwaySlug);
  if (!supabase) return <main className={styles.shell}><section className={styles.mainCard}>Supabase is not configured.</section></main>;

  const { data: lessonRows } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows[0] ? lessonRows[0] : null;

  const { data: assignment } = await supabase.from('guided_study_assignments').select('mode, required_activity_types, deadline_at, instructions').eq('assigned_student_id', DEMO_STUDENT_ID).eq('status', 'active').eq('pathway_slug', pathwaySlug).order('created_at', { ascending: false }).limit(1).maybeSingle<Assignment>();
  const { data: seeded } = lesson
    ? await supabase.from('activities').select('id, activity_type, title').eq('lesson_id', lesson.id)
    : { data: [] };

  const resolved = resolvePathwayActivities({ pathwaySlug, seededActivities: seeded ?? [], requiredActivityTypes: assignment?.required_activity_types ?? [], fallbackContentByActivityType });
  const activities = await materialisePathwayActivities(pathwaySlug, resolved);
  const activityIds = activities.map((activity) => activity.id);
  const { data: rows } = activityIds.length ? await supabase.from('student_responses').select('activity_id, status, score, response_json, last_saved_at').eq('student_id', DEMO_STUDENT_ID).in('activity_id', activityIds) : { data: [] };
  const responses = (rows ?? []) as ResponseRow[];

  const items = activities.map((activity) => {
    const response = responses.find((row) => row.activity_id === activity.id) ?? null;
    const state = resolveUnifiedActivityState(activity.activity_type, response);
    return { ...activity, state, href: `${config.routeBase}/${activity.routeSlug}`, complete: state.isComplete && isTrackableActivity(activity.activity_type), trackable: isTrackableActivity(activity.activity_type) };
  });

  const trackable = items.filter((item) => item.trackable);
  const done = trackable.filter((item) => item.complete).length;
  const pct = trackable.length ? Math.round((done / trackable.length) * 100) : 0;
  const next = items.find((item) => item.trackable && !item.complete) ?? null;

  return <main className={styles.shell}><section className={styles.mainCard}><header className={styles.summary}><p className={styles.eyebrow}>{assignment ? 'Teacher-set pathway' : 'Independent pathway'}</p><h1>{config.title}</h1><p>{assignment?.instructions ?? fallbackInstructions ?? 'Complete the pathway one task at a time.'}</p><div className={styles.metaRow}><span className={styles.pill}>{assignment?.mode?.replaceAll('_', ' ') ?? 'practice mode'}</span><span className={styles.pill}>{dateLabel(assignment?.deadline_at ?? null)}</span><span className={styles.pill}>{done}/{trackable.length} evidence tasks</span></div></header><section className={styles.nextPanel}><div><p className={styles.eyebrow}>{next ? 'Next task' : 'Finished'}</p><h2>{next ? getActivityLabel(next.activity_type) : 'Review pathway'}</h2><p>{next?.title ?? 'All required evidence tasks have been saved.'}</p></div><Link className={styles.primaryButton} href={next?.href ?? config.routeBase}>{next ? 'Start now' : 'Review route'}</Link></section><section className={styles.route}><div className={styles.progressTop}><strong>Your route</strong><span>{pct}% complete</span></div><div className={styles.progressBar}><div className={styles.progressFill} style={{ '--progress': `${pct}%` } as React.CSSProperties} /></div><div className={styles.routeList}>{items.map((item, index) => <Link className={`${styles.routeItem} ${item.complete ? styles.complete : ''} ${next?.activity_type === item.activity_type ? styles.current : ''}`} href={item.href} key={`${item.id}-${item.activity_type}`}><span className={styles.routeMark}>{item.complete ? '✓' : index + 1}</span><span className={styles.routeText}><strong>{item.label}</strong><span>{item.title}</span></span><span className={styles.routeStatus}>{item.complete ? 'Done' : next?.activity_type === item.activity_type ? 'Next' : 'To do'}</span></Link>)}</div></section></section></main>;
}
