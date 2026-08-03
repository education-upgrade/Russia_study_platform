import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth/profile';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function authorise(assignmentId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 }) };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Sign in first.' }, { status: 401 }) };
  const profile = await getProfile(supabase, user.id);
  if (!profile || profile.status !== 'active' || !['teacher', 'admin'].includes(profile.role)) {
    return { error: NextResponse.json({ error: 'Only active teachers can manage attachments.' }, { status: 403 }) };
  }
  const { data: assignment } = await supabase.from('classroom_assignments').select('id, pathway_slug').eq('id', assignmentId).maybeSingle();
  if (!assignment) return { error: NextResponse.json({ error: 'Assignment not found.' }, { status: 404 }) };
  const { data: teacherLink } = await supabase.from('classroom_assignments').select('id').eq('id', assignmentId).maybeSingle();
  if (!teacherLink) return { error: NextResponse.json({ error: 'Assignment not found.' }, { status: 404 }) };
  return { supabase, user, assignment };
}

export async function POST(request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const auth = await authorise(assignmentId);
  if ('error' in auth) return auth.error;
  const body = await request.json();
  const resourceId = String(body.resourceId ?? '');
  const { data: resource } = await auth.supabase.from('lesson_resources').select('id, pathway_slug, visibility').eq('id', resourceId).maybeSingle();
  if (!resource || resource.pathway_slug !== auth.assignment.pathway_slug) return NextResponse.json({ error: 'Resource does not belong to this lesson.' }, { status: 400 });
  if (resource.visibility !== 'student') return NextResponse.json({ error: 'Teacher-only resources cannot be attached for students.' }, { status: 400 });
  const { error } = await auth.supabase.from('assignment_resources').upsert({ assignment_id: assignmentId, resource_id: resourceId, attached_by: auth.user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ attached: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;
  const auth = await authorise(assignmentId);
  if ('error' in auth) return auth.error;
  const body = await request.json();
  const resourceId = String(body.resourceId ?? '');
  const { error } = await auth.supabase.from('assignment_resources').delete().eq('assignment_id', assignmentId).eq('resource_id', resourceId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ attached: false });
}
