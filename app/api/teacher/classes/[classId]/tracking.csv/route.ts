import { NextResponse } from 'next/server';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type Assignment = { id: string; title: string; lesson_title: string; pathway_slug: string; due_at: string | null; created_at: string; status: string; assignment_recipients: { student_id: string; status: string }[] | null };
type Progress = { assignment_id: string; student_id: string; status: 'not_started' | 'in_progress' | 'complete'; progress_percent: number; completed_activity_count: number; total_activity_count: number; last_activity_at: string | null; completed_at: string | null };
type Confidence = { assignment_id: string; student_id: string; confidence: number | null; last_saved_at: string };

function csvCell(value: unknown) { const text = value === null || value === undefined ? '' : String(value); return `"${text.replaceAll('"', '""')}"`; }
function trackingState(assigned: boolean, progress?: Progress) { if (!assigned) return 'Not assigned'; if (progress?.status === 'complete') return 'Complete'; if (!progress || progress.status === 'not_started' || progress.progress_percent === 0) return 'Not attempted'; return 'Incomplete'; }
function safeFilename(value: string) { return value.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'class'; }

export async function GET(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  const { classId } = await params;
  if (!auth || !supabase) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });

  const { data: teacherLink } = await supabase.from('class_teachers').select('class_id, teaching_classes(name)').eq('teacher_id', auth.userId).eq('class_id', classId).maybeSingle();
  const teachingClass = Array.isArray((teacherLink as any)?.teaching_classes) ? (teacherLink as any).teaching_classes[0] : (teacherLink as any)?.teaching_classes;
  if (!teacherLink && auth.profile.role !== 'admin') return NextResponse.json({ error: 'Class not found.' }, { status: 404 });

  const [{ data: memberships }, { data: assignmentRows }] = await Promise.all([
    supabase.from('class_memberships').select('student_id').eq('class_id', classId).eq('status', 'active'),
    supabase.from('classroom_assignments').select('id, title, lesson_title, pathway_slug, due_at, created_at, status, assignment_recipients(student_id, status)').eq('class_id', classId).order('created_at', { ascending: true }),
  ]);
  const studentIds = (memberships ?? []).map((row: any) => row.student_id);
  const assignments = ((assignmentRows ?? []) as Assignment[]).filter((assignment) => assignment.status === 'published' || assignment.status === 'archived');
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const [profilesResult, progressResult, confidenceResult] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('assignment_progress').select('assignment_id, student_id, status, progress_percent, completed_activity_count, total_activity_count, last_activity_at, completed_at').in('assignment_id', assignmentIds) : Promise.resolve({ data: [], error: null }),
    assignmentIds.length ? supabase.from('student_activity_progress').select('assignment_id, student_id, confidence, last_saved_at').in('assignment_id', assignmentIds).not('confidence', 'is', null).order('last_saved_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
  ]);

  const profiles = new Map((profilesResult.data ?? []).map((profile: any) => [profile.id, profile.full_name?.trim() || 'Student']));
  const progressRows = (progressResult.data ?? []) as Progress[];
  const progressByKey = new Map(progressRows.map((row) => [`${row.assignment_id}:${row.student_id}`, row]));
  const confidenceByKey = new Map<string, number>();
  ((confidenceResult.data ?? []) as Confidence[]).forEach((row) => { const key = `${row.assignment_id}:${row.student_id}`; if (!confidenceByKey.has(key) && row.confidence !== null) confidenceByKey.set(key, row.confidence); });

  const url = new URL(request.url);
  const format = url.searchParams.get('format') === 'matrix' ? 'matrix' : 'detail';
  let lines: string[] = [];

  if (format === 'matrix') {
    lines.push(['Student', ...assignments.map((assignment) => assignment.lesson_title), 'Complete', 'Incomplete', 'Not attempted', 'Assigned total'].map(csvCell).join(','));
    for (const studentId of studentIds) {
      let complete = 0; let incomplete = 0; let notAttempted = 0; let assignedTotal = 0;
      const states = assignments.map((assignment) => {
        const assigned = (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned');
        const state = trackingState(assigned, progressByKey.get(`${assignment.id}:${studentId}`));
        if (assigned) { assignedTotal += 1; if (state === 'Complete') complete += 1; else if (state === 'Incomplete') incomplete += 1; else if (state === 'Not attempted') notAttempted += 1; }
        return state;
      });
      lines.push([profiles.get(studentId) ?? 'Student', ...states, complete, incomplete, notAttempted, assignedTotal].map(csvCell).join(','));
    }
  } else {
    lines.push(['Student','Assignment','Lesson','Pathway','Set date','Due date','Status','Progress %','Activities completed','Total activities','Confidence','Last active','Completed date'].map(csvCell).join(','));
    for (const studentId of studentIds) {
      for (const assignment of assignments) {
        const assigned = (assignment.assignment_recipients ?? []).some((recipient) => recipient.student_id === studentId && recipient.status === 'assigned');
        if (!assigned) continue;
        const progress = progressByKey.get(`${assignment.id}:${studentId}`);
        lines.push([
          profiles.get(studentId) ?? 'Student', assignment.title, assignment.lesson_title, assignment.pathway_slug,
          assignment.created_at, assignment.due_at, trackingState(true, progress), progress?.progress_percent ?? 0,
          progress?.completed_activity_count ?? 0, progress?.total_activity_count ?? 0,
          confidenceByKey.get(`${assignment.id}:${studentId}`) ?? '', progress?.last_activity_at ?? '', progress?.completed_at ?? '',
        ].map(csvCell).join(','));
      }
    }
  }

  const filename = `${safeFilename(teachingClass?.name ?? 'class')}-assignment-${format}-tracking.csv`;
  return new NextResponse(`\ufeff${lines.join('\r\n')}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"`, 'Cache-Control': 'no-store' } });
}
