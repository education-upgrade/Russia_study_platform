import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getActivityLabel, isSupportedActivityType, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import '@/lib/unit6RegistryActivation';
import { pathwayRegistry } from '@/lib/pathwayRegistry';

type GuidedStudyRequest = {
  mode: string;
  requiredActivityTypes: string[];
  deadlineAt?: string;
  instructions?: string;
  classId?: string;
  pathwaySlug?: string;
  lessonTitle?: string;
};

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in before creating an assignment.' }, { status: 401 });

  const profile = await getProfile(supabase, user.id);
  if (!profile || profile.status !== 'active' || !['teacher', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only active teacher accounts can create assignments.' }, { status: 403 });
  }

  const body = (await request.json()) as GuidedStudyRequest;
  if (!body.classId) return NextResponse.json({ error: 'Choose one of your classes.' }, { status: 400 });
  if (!body.mode) return NextResponse.json({ error: 'Choose a guided study mode.' }, { status: 400 });

  const pathwaySlug = body.pathwaySlug ?? '';
  const pathway = pathwayRegistry[pathwaySlug];
  if (!pathway) return NextResponse.json({ error: `Unknown pathway: ${pathwaySlug}` }, { status: 400 });

  const requestedTypes = body.requiredActivityTypes ?? [];
  const invalidActivities = requestedTypes.filter((activityType) => !isSupportedActivityType(activityType));
  if (invalidActivities.length) {
    return NextResponse.json({ error: `Unknown activity type: ${invalidActivities.join(', ')}` }, { status: 400 });
  }

  const requiredActivityTypes = orderSupportedActivityTypes(requestedTypes);
  if (!requiredActivityTypes.length) return NextResponse.json({ error: 'Choose at least one activity.' }, { status: 400 });

  const assignmentTitle = body.lessonTitle?.trim() || pathway.lessonTitle;
  const { data: assignmentId, error } = await supabase.rpc('create_class_assignment', {
    class_id_input: body.classId,
    title_input: assignmentTitle,
    pathway_slug_input: pathway.pathwaySlug,
    lesson_title_input: pathway.lessonTitle,
    mode_input: body.mode,
    required_activity_types_input: requiredActivityTypes,
    instructions_input: body.instructions?.trim() || null,
    due_at_input: body.deadlineAt || null,
    publish_now_input: true,
  });

  if (error || !assignmentId) {
    console.error('Unable to create authenticated class assignment', error?.message);
    return NextResponse.json({ error: error?.message ?? 'Assignment could not be created.' }, { status: 500 });
  }

  const { count: recipientCount } = await supabase
    .from('assignment_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('assignment_id', assignmentId)
    .eq('status', 'assigned');

  return NextResponse.json({
    status: 'published',
    assignmentId,
    recipientCount: recipientCount ?? 0,
    pathwaySlug: pathway.pathwaySlug,
    lessonTitle: pathway.lessonTitle,
    requiredActivityTypes,
    route: requiredActivityTypes.map(getActivityLabel).join(' → '),
  });
}
