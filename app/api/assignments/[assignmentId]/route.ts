import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ assignmentId: string }> };

type AssignmentManagementRequest =
  | { action: 'update'; instructions?: string; dueAt?: string | null }
  | { action: 'sync_recipients' }
  | { action: 'archive' };

function parseDueAt(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in before managing assignments.' }, { status: 401 });

  const profile = await getProfile(supabase, user.id);
  if (!profile || profile.status !== 'active' || !['teacher', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only active teacher accounts can manage assignments.' }, { status: 403 });
  }

  const { assignmentId } = await params;
  const body = (await request.json()) as AssignmentManagementRequest;

  if (body.action === 'update') {
    const dueAt = parseDueAt(body.dueAt);
    if (dueAt === undefined) return NextResponse.json({ error: 'The deadline is not a valid date.' }, { status: 400 });

    const { error } = await supabase.rpc('update_class_assignment_details', {
      assignment_id_input: assignmentId,
      instructions_input: body.instructions?.trim() || null,
      due_at_input: dueAt,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: 'updated' });
  }

  if (body.action === 'sync_recipients') {
    const { data: recipientTotal, error } = await supabase.rpc('sync_class_assignment_recipients', {
      assignment_id_input: assignmentId,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: 'synced', recipientTotal: recipientTotal ?? 0 });
  }

  if (body.action === 'archive') {
    const { error } = await supabase.rpc('set_class_assignment_status', {
      assignment_id_input: assignmentId,
      status_input: 'archived',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: 'archived' });
  }

  return NextResponse.json({ error: 'Assignment action not recognised.' }, { status: 400 });
}
