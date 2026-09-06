import '@/lib/unit6RegistryActivation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import GenericActivityRenderer from '@/components/GenericActivityRenderer';
import { supabase } from '@/lib/supabase';
import { getActivePathwayConfig } from '@/lib/activeSubjectRuntime';
import { materialisePathwayActivities } from '@/lib/pathwayActivityPersistence';
import { findActivityByRouteSlug, getNextActivityHref, resolvePathwayActivities } from '@/lib/pathwayResolver';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from '@/app/student/lesson/1905/flashcards/page.module.css';

type ClassroomAssignment = { required_activity_types: string[]; pathway_slug: string; status: string };
type RecipientRow = { classroom_assignments: ClassroomAssignment | ClassroomAssignment[] | null };
type Props = { pathwaySlug: string; activitySlug: string; fallbackContentByActivityType?: Record<string, any> };

function unwrapAssignment(value: RecipientRow['classroom_assignments']) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResolvedModularActivityPage({ pathwaySlug, activitySlug, fallbackContentByActivityType = {} }: Props) {
  const config = getActivePathwayConfig(pathwaySlug);
  if (!supabase) return <main className={styles.shell}><section className="card warm"><h1>Supabase is not configured</h1></section></main>;

  const requestHeaders = await headers();
  const requestedAssignmentId = requestHeaders.get('x-assignment-id');
  let requiredActivityTypes: string[] = [];

  if (requestedAssignmentId) {
    const authSupabase = await createServerSupabaseClient();
    const { data: { user } } = authSupabase ? await authSupabase.auth.getUser() : { data: { user: null } };

    if (!authSupabase || !user) {
      redirect(`/login?next=${encodeURIComponent(`${config.routeBase}/${activitySlug}?assignment=${requestedAssignmentId}`)}`);
    }

    const { data: recipientData } = await authSupabase
      .from('assignment_recipients')
      .select('classroom_assignments(required_activity_types, pathway_slug, status)')
      .eq('assignment_id', requestedAssignmentId)
      .eq('student_id', user.id)
      .eq('status', 'assigned')
      .maybeSingle<RecipientRow>();

    const exactAssignment = recipientData ? unwrapAssignment(recipientData.classroom_assignments) : null;
    if (!exactAssignment || exactAssignment.status !== 'published' || exactAssignment.pathway_slug !== pathwaySlug) {
      return <main className={styles.shell}><section className="card warm"><h1>Assignment unavailable</h1><p>This assignment is no longer available to your account.</p><Link href="/student/dashboard">Return to dashboard</Link></section></main>;
    }

    requiredActivityTypes = exactAssignment.required_activity_types;
  }

  const { data: lessonRows } = await supabase.from('lessons').select('id').eq('title', config.lessonTitle).limit(1);
  const lesson = Array.isArray(lessonRows) && lessonRows[0] ? lessonRows[0] : null;
  const { data: seeded } = lesson
    ? await supabase.from('activities').select('id, title, activity_type, content_json').eq('lesson_id', lesson.id)
    : { data: [] };

  const resolved = resolvePathwayActivities({ pathwaySlug, seededActivities: seeded ?? [], requiredActivityTypes, fallbackContentByActivityType });
  const activities = await materialisePathwayActivities(pathwaySlug, resolved);
  const activity = findActivityByRouteSlug(activities, activitySlug);
  const assignmentQuery = requestedAssignmentId ? `?assignment=${encodeURIComponent(requestedAssignmentId)}` : '';

  if (!activity) return <main className={styles.shell}><section className="card warm"><h1>Activity not found</h1><Link href={`${config.routeBase}${assignmentQuery}`}>Return to pathway</Link></section></main>;

  const nextHref = getNextActivityHref(config.routeBase, activities, activity.activity_type);

  return <main className={styles.shell}><section className={styles.panel}><GenericActivityRenderer activityId={activity.id} activityType={activity.activity_type} content={activity.content_json ?? {}} routeBase={config.routeBase} pathwayTitle={config.title} nextHref={nextHref} fallbackContent={activity.fallbackContent ?? fallbackContentByActivityType[activity.activity_type]} /></section></main>;
}
