import { NextResponse } from 'next/server';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function authorise(classId: string, studentId: string) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return { error: NextResponse.json({ error: 'Sign in as a teacher.' }, { status: 401 }) };

  if (auth.profile.role !== 'admin') {
    const { data: teacherLink } = await supabase.from('class_teachers').select('class_id').eq('class_id', classId).eq('teacher_id', auth.userId).maybeSingle();
    if (!teacherLink) return { error: NextResponse.json({ error: 'You do not teach this class.' }, { status: 403 }) };
  }

  const { data: membership } = await supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('student_id', studentId).maybeSingle();
  if (!membership) return { error: NextResponse.json({ error: 'Student is not connected to this class.' }, { status: 404 }) };

  return { auth, supabase };
}

export async function POST(request: Request, { params }: { params: Promise<{ classId: string; studentId: string }> }) {
  const { classId, studentId } = await params;
  const access = await authorise(classId, studentId);
  if ('error' in access) return access.error;

  const body = await request.json();
  const note = String(body.body ?? '').trim();
  const assignmentId = body.assignmentId ? String(body.assignmentId) : null;
  if (!note || note.length > 4000) return NextResponse.json({ error: 'Enter a note of up to 4000 characters.' }, { status: 400 });

  if (assignmentId) {
    const { data: assignment } = await access.supabase.from('classroom_assignments').select('id').eq('id', assignmentId).eq('class_id', classId).maybeSingle();
    const { data: recipient } = await access.supabase.from('assignment_recipients').select('student_id').eq('assignment_id', assignmentId).eq('student_id', studentId).maybeSingle();
    if (!assignment || !recipient) return NextResponse.json({ error: 'That assignment is not part of this student history.' }, { status: 400 });
  }

  const { data, error } = await access.supabase.from('teacher_student_notes').insert({
    class_id: classId,
    student_id: studentId,
    assignment_id: assignmentId,
    body: note,
    created_by: access.auth.userId,
  }).select('id, assignment_id, body, created_at').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ note: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ classId: string; studentId: string }> }) {
  const { classId, studentId } = await params;
  const access = await authorise(classId, studentId);
  if ('error' in access) return access.error;
  const body = await request.json();
  const noteId = String(body.noteId ?? '');
  if (!noteId) return NextResponse.json({ error: 'Note id is required.' }, { status: 400 });

  const { error } = await access.supabase.from('teacher_student_notes').delete().eq('id', noteId).eq('class_id', classId).eq('student_id', studentId).eq('created_by', access.auth.userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
