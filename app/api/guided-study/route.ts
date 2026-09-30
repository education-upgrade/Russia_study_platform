import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupportedActivityType, orderSupportedActivityTypes } from '@/lib/activityTypeRegistry';
import '@/lib/unit6RegistryActivation';
import { getSubjectActivityLabel, tryGetActivePathwayConfig } from '@/lib/activeSubjectRuntime';
import { sendAssignmentNotifications } from '@/lib/email/assignmentNotification';

type GuidedStudyItem = {
  pathwaySlug: string;
  lessonTitle?: string;
  instructions?: string;
};

type GuidedStudyRequest = {
  mode: string;
  requiredActivityTypes: string[];
  deadlineAt?: string;
  instructions?: string;
  classId?: string;
  pathwaySlug?: string;
  lessonTitle?: string;
  assignments?: GuidedStudyItem[];
  publishNow?: boolean;
  emailStudents?: boolean;
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

  const requestedTypes = body.requiredActivityTypes ?? [];
  const invalidActivities = requestedTypes.filter((activityType) => !isSupportedActivityType(activityType));
  if (invalidActivities.length) return NextResponse.json({ error: `Unknown activity type: ${invalidActivities.join(', ')}` }, { status: 400 });

  const requiredActivityTypes = orderSupportedActivityTypes(requestedTypes);
  if (!requiredActivityTypes.length) return NextResponse.json({ error: 'Choose at least one activity.' }, { status: 400 });

  const requestedAssignments: GuidedStudyItem[] = body.assignments?.length
    ? body.assignments
    : [{ pathwaySlug: body.pathwaySlug ?? '', lessonTitle: body.lessonTitle, instructions: body.instructions }];

  if (!requestedAssignments.length) {
    return NextResponse.json({ error: 'Choose at least one assignment.' }, { status: 400 });
  }

  const uniqueSlugs = new Set<string>();
  const preparedAssignments = [];
  for (const item of requestedAssignments) {
    const pathway = tryGetActivePathwayConfig(item.pathwaySlug ?? '');
    if (!pathway) return NextResponse.json({ error: `Unknown pathway: ${item.pathwaySlug ?? ''}` }, { status: 400 });
    if (uniqueSlugs.has(pathway.pathwaySlug)) {
      return NextResponse.json({ error: `Duplicate pathway selected: ${pathway.lessonTitle}` }, { status: 400 });
    }
    uniqueSlugs.add(pathway.pathwaySlug);
    preparedAssignments.push({
      pathway,
      assignmentTitle: item.lessonTitle?.trim() || pathway.lessonTitle,
      instructions: item.instructions?.trim() || body.instructions?.trim() || null,
    });
  }

  const publishNow = body.publishNow !== false;
  const createdAssignments: Array<{
    assignmentId: string;
    assignmentTitle: string;
    lessonTitle: string;
    pathwaySlug: string;
    routeBase: string;
    instructions: string | null;
  }> = [];

  for (const item of preparedAssignments) {
    const { data: assignmentId, error } = await supabase.rpc('create_class_assignment', {
      class_id_input: body.classId,
      title_input: item.assignmentTitle,
      pathway_slug_input: item.pathway.pathwaySlug,
      lesson_title_input: item.pathway.lessonTitle,
      mode_input: body.mode,
      required_activity_types_input: requiredActivityTypes,
      instructions_input: item.instructions,
      due_at_input: body.deadlineAt || null,
      publish_now_input: publishNow,
    });

    if (error || !assignmentId) {
      console.error('Unable to create authenticated class assignment', error?.message);
      for (const created of createdAssignments.reverse()) {
        const { error: rollbackError } = await supabase.rpc('delete_class_assignment', { assignment_id_input: created.assignmentId });
        if (rollbackError) console.error('Unable to roll back bulk assignment', created.assignmentId, rollbackError.message);
      }
      return NextResponse.json({ error: error?.message ?? 'Assignments could not be created.' }, { status: 500 });
    }

    createdAssignments.push({
      assignmentId,
      assignmentTitle: item.assignmentTitle,
      lessonTitle: item.pathway.lessonTitle,
      pathwaySlug: item.pathway.pathwaySlug,
      routeBase: item.pathway.routeBase,
      instructions: item.instructions,
    });
  }

  const assignmentResults = [];
  for (const item of createdAssignments) {
    const { count: recipientCount } = publishNow
      ? await supabase.from('assignment_recipients').select('*', { count: 'exact', head: true }).eq('assignment_id', item.assignmentId).eq('status', 'assigned')
      : { count: 0 };

    let emailNotification = null;
    if (publishNow && body.emailStudents !== false) {
      try {
        emailNotification = await sendAssignmentNotifications({
          assignmentId: item.assignmentId,
          assignmentTitle: item.assignmentTitle,
          lessonTitle: item.lessonTitle,
          instructions: item.instructions,
          dueAt: body.deadlineAt || null,
          appOrigin: new URL(request.url).origin,
          routeBase: item.routeBase,
        });
      } catch (notificationError) {
        console.error('Assignment was published but notification email failed', notificationError);
        emailNotification = { attempted: recipientCount ?? 0, sent: 0, failed: recipientCount ?? 0, skipped: false };
      }
    }

    assignmentResults.push({
      assignmentId: item.assignmentId,
      recipientCount: recipientCount ?? 0,
      emailNotification,
      pathwaySlug: item.pathwaySlug,
      lessonTitle: item.lessonTitle,
    });
  }

  const first = assignmentResults[0];
  return NextResponse.json({
    status: publishNow ? 'published' : 'draft',
    assignmentId: first?.assignmentId ?? null,
    assignmentIds: assignmentResults.map((item) => item.assignmentId),
    assignmentCount: assignmentResults.length,
    recipientCount: first?.recipientCount ?? 0,
    assignments: assignmentResults.map((item) => ({
      ...item,
      route: requiredActivityTypes.map((activityType) => getSubjectActivityLabel(item.pathwaySlug, activityType)).join(' → '),
    })),
    requiredActivityTypes,
  });
}
