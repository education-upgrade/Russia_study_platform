import '@/lib/unit6RegistryActivation';
import Link from 'next/link';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { DEMO_STUDENT_ID } from '@/lib/demoIdentity';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { materialisePathwayActivities } from '@/lib/pathwayActivityPersistence';
import { findActivityByRouteSlug, getNextActivityHref, resolvePathwayActivities } from '@/lib/pathwayResolver';
import styles from '@/app/student/lesson/1905/flashcards/page.module.css';

type Assignment = { required_activity_types: string[] };
type Props = { pathwaySlug: string; activitySlug: string; fallbackContentByActivityType?: Record<string, any> };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResolvedModularActivityPage({ pathwaySlug, activitySlug, fallbackContentByActivityType = {} }: Props) {
  const config = getPathwayConfig(pathwaySlug);
  if (!supabase) return <main className={styles.shell}><section className="card warm"><h1>Supabase is not configured</h1></section></main>;

  const { data: lessonRows } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows[0] ? lessonRows[0] : null;

  const { data: assignment } = await supabase.from('guided_study_assignments').select('required_activity_types').eq('assigned_student_id', DEMO_STUDENT_ID).eq('status', 'active').eq('pathway_slug', pathwaySlug).order('created_at', { ascending: false }).limit(1).maybeSingle<Assignment>();
  const { data: seeded } = lesson
    ? await supabase.from('activities').select('id, title, activity_type, content_json').eq('lesson_id', lesson.id)
    : { data: [] };

  const resolved = resolvePathwayActivities({ pathwaySlug, seededActivities: seeded ?? [], requiredActivityTypes: assignment?.required_activity_types ?? [], fallbackContentByActivityType });
  const activities = await materialisePathwayActivities(pathwaySlug, resolved);
  const activity = findActivityByRouteSlug(activities, activitySlug);

  if (!activity) return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={config.routeBase}>Return to pathway</Link></section></main>;

  const nextHref = getNextActivityHref(config.routeBase, activities, activity.activity_type);

  return <main className={styles.shell}><section className={styles.panel}><GenericActivityRenderer activityId={activity.id} activityType={activity.activity_type} content={activity.content_json ?? {}} routeBase={config.routeBase} pathwayTitle={config.title} nextHref={nextHref} fallbackContent={activity.fallbackContent ?? fallbackContentByActivityType[activity.activity_type]} /></section></main>;
}
