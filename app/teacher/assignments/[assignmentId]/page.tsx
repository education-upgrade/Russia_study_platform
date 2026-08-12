import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssignmentManager from '@/components/AssignmentManager';
import LessonResourceManager from '@/components/LessonResourceManager';
import { requireRoles } from '@/lib/auth/access';
import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = { params: Promise<{ assignmentId: string }>; searchParams?: Promise<{ tab?: string; filter?: string; q?: string }> };
type Assignment = { id: string; class_id: string; title: string; lesson_title: string; pathway_slug: string; mode: string; required_activity_types: string[]; due_at: string | null; instructions: string | null; status: string; created_at: string; teaching_classes: { id: string; name: string; academic_year: string | null } | { id: string; name: string; academic_year: string | null }[] | null };
type Recipient = { student_id: string; status: string };
type Profile = { id: string; full_name: string | null };
type Progress = { student_id: string; status: 'not_started' | 'in_progress' | 'complete'; completed_activity_count: number; total_activity_count: number; progress_percent: number; current_activity_type: string | null; last_activity_at: string | null; completed_at: string | null };
type ActivityProgress = { student_id: string; confidence: number | null; last_saved_at: string };
type LessonResource = { id: string; title: string; description: string | null; resource_type: string; resource_url: string; visibility: 'teacher' | 'student' };

function firstRelation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function formatDate(value: string | null) { if (!value) return 'No deadline'; return new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function statusLabel(status?: Progress['status']) { if (status === 'complete') return 'Complete'; if (status === 'in_progress') return 'In progress'; return 'Not started'; }
function attentionReason(assignment: Assignment, progress: Progress | undefined, confidence: number | undefined) {
  const dueDifference = assignment.due_at ? new Date(assignment.due_at).getTime() - Date.now() : null;
  const notStarted = !progress || progress.status === 'not_started';
  if (notStarted && dueDifference !== null && dueDifference < 0) return 'Overdue and not started';
  if (notStarted && dueDifference !== null && dueDifference <= 48 * 60 * 60 * 1000) return 'Not started · due soon';
  if (confidence !== undefined && confidence <= 2) return `Low confidence · ${confidence}/5`;
  if (progress?.status === 'in_progress' && progress.last_activity_at && Date.now() - new Date(progress.last_activity_at).getTime() >= 3 * 24 * 60 * 60 * 1000) return progress.current_activity_type ? `Stalled at ${getActivityLabel(progress.current_activity_type)}` : 'Progress has stalled';
  return null;
}

export default async function AssignmentWorkspacePage({ params, searchParams }: Props) {
  const auth = await requireRoles(['teacher', 'admin']);
  const { assignmentId } = await params;
  const query = searchParams ? await searchParams : {};
  const tab = ['overview', 'students', 'evidence', 'resources', 'settings'].includes(query.tab ?? '') ? query.tab! : 'overview';
  const filter = query.filter ?? 'all';
  const search = (query.q ?? '').trim().toLowerCase();
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) notFound();

  const { data: assignmentData } = await supabase.from('classroom_assignments').select('id, class_id, title, lesson_title, pathway_slug, mode, required_activity_types, due_at, instructions, status, created_at, teaching_classes(id, name, academic_year)').eq('id', assignmentId).maybeSingle<Assignment>();
  if (!assignmentData) notFound();
  const assignment = assignmentData;

  const { data: teacherLink } = await supabase.from('class_teachers').select('class_id').eq('class_id', assignment.class_id).eq('teacher_id', auth.userId).maybeSingle();
  if (!teacherLink && auth.profile.role !== 'admin') notFound();

  const [{ data: recipientData }, { data: progressData }, { data: activityProgressData }, { data: resourceData }, { data: attachedData }] = await Promise.all([
    supabase.from('assignment_recipients').select('student_id, status').eq('assignment_id', assignment.id),
    supabase.from('assignment_progress').select('student_id, status, completed_activity_count, total_activity_count, progress_percent, current_activity_type, last_activity_at, completed_at').eq('assignment_id', assignment.id),
    supabase.from('student_activity_progress').select('student_id, confidence, last_saved_at').eq('assignment_id', assignment.id).not('confidence', 'is', null).order('last_saved_at', { ascending: false }),
    supabase.from('lesson_resources').select('id, title, description, resource_type, resource_url, visibility').eq('pathway_slug', assignment.pathway_slug).order('created_at', { ascending: false }),
    supabase.from('assignment_resources').select('resource_id').eq('assignment_id', assignment.id),
  ]);

  const recipients = ((recipientData ?? []) as Recipient[]).filter((recipient) => recipient.status === 'assigned');
  const studentIds = recipients.map((recipient) => recipient.student_id);
  const { data: profileData } = studentIds.length ? await supabase.from('profiles').select('id, full_name').in('id', studentIds) : { data: [] };
  const profileMap = new Map(((profileData ?? []) as Profile[]).map((profile) => [profile.id, profile.full_name?.trim() || 'Student']));
  const progressMap = new Map(((progressData ?? []) as Progress[]).map((progress) => [progress.student_id, progress]));
  const confidenceMap = new Map<string, number>();
  ((activityProgressData ?? []) as ActivityProgress[]).forEach((row) => { if (!confidenceMap.has(row.student_id) && row.confidence !== null) confidenceMap.set(row.student_id, row.confidence); });

  const rows = recipients.map((recipient, index) => { const progress = progressMap.get(recipient.student_id); const confidence = confidenceMap.get(recipient.student_id); return { id: recipient.student_id, name: profileMap.get(recipient.student_id) || `Student ${index + 1}`, progress, confidence, reason: attentionReason(assignment, progress, confidence) }; }).sort((a, b) => Boolean(a.reason) !== Boolean(b.reason) ? (a.reason ? -1 : 1) : (a.progress?.progress_percent ?? 0) - (b.progress?.progress_percent ?? 0));
  const filteredRows = rows.filter((row) => { if (search && !row.name.toLowerCase().includes(search)) return false; if (filter === 'attention') return Boolean(row.reason); if (filter === 'not_started') return !row.progress || row.progress.status === 'not_started'; if (filter === 'in_progress') return row.progress?.status === 'in_progress'; if (filter === 'complete') return row.progress?.status === 'complete'; return true; });
  const completed = rows.filter((row) => row.progress?.status === 'complete').length;
  const inProgress = rows.filter((row) => row.progress?.status === 'in_progress').length;
  const notStarted = rows.length - completed - inProgress;
  const attention = rows.filter((row) => row.reason).length;
  const averageProgress = rows.length ? Math.round(rows.reduce((sum, row) => sum + (row.progress?.progress_percent ?? 0), 0) / rows.length) : 0;
  const confidenceValues = rows.map((row) => row.confidence).filter((value): value is number => value !== undefined);
  const averageConfidence = confidenceValues.length ? (confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length).toFixed(1) : '—';
  const teachingClass = firstRelation(assignment.teaching_classes);
  const attachedIds = new Set((attachedData ?? []).map((item: any) => item.resource_id));
  const resources = ((resourceData ?? []) as LessonResource[]).map((resource) => ({ id: resource.id, title: resource.title, description: resource.description, resourceType: resource.resource_type, resourceUrl: resource.resource_url, visibility: resource.visibility, attached: attachedIds.has(resource.id) }));
  const tabHref = (nextTab: string) => `/teacher/assignments/${assignment.id}?tab=${nextTab}`;

  return <main className={styles.workspace}>
    <section className={styles.assignmentHeader}><div><Link className={styles.backLink} href={`/teacher/classes/${assignment.class_id}?tab=assignments`}>← Back to {teachingClass?.name ?? 'class'}</Link><div className={styles.titleRow}><div><p className={styles.eyebrow}>{teachingClass?.name ?? 'Class'} · {teachingClass?.academic_year || 'Academic year not set'}</p><h2>{assignment.title}</h2><p>{assignment.lesson_title} · {assignment.mode.replaceAll('_', ' ')} · Due {formatDate(assignment.due_at)}</p></div><span className={`${styles.statusBadge} ${assignment.status === 'published' ? styles.published : styles.archived}`}>{assignment.status === 'published' ? 'Published' : 'Archived'}</span></div></div></section>
    <nav className={styles.tabs} aria-label="Assignment workspace">{['overview', 'students', 'evidence', 'resources', 'settings'].map((item) => <Link key={item} href={tabHref(item)} className={tab === item ? styles.activeTab : undefined} aria-current={tab === item ? 'page' : undefined}>{item.charAt(0).toUpperCase() + item.slice(1)}</Link>)}</nav>

    {tab === 'overview' && <><section className={styles.metrics}><article><span>Complete</span><strong>{completed}/{rows.length}</strong></article><article><span>Average progress</span><strong>{averageProgress}%</strong></article><article><span>Average confidence</span><strong>{averageConfidence}{averageConfidence !== '—' ? '/5' : ''}</strong></article><article><span>Needs attention</span><strong>{attention}</strong></article></section><section className={styles.twoColumn}><article className={styles.card}><header className={styles.sectionHeader}><div><h3>Assignment summary</h3><p>The essentials teachers need before reviewing individual students.</p></div></header><dl className={styles.summaryList}><div><dt>Deadline</dt><dd>{formatDate(assignment.due_at)}</dd></div><div><dt>Study mode</dt><dd>{assignment.mode.replaceAll('_', ' ')}</dd></div><div><dt>Required activities</dt><dd>{assignment.required_activity_types.length}</dd></div><div><dt>Assigned students</dt><dd>{rows.length}</dd></div></dl><div className={styles.instructions}><span>Student instructions</span><p>{assignment.instructions?.trim() || 'No additional instructions were added.'}</p></div></article><article className={styles.card}><header className={styles.sectionHeader}><div><h3>Current picture</h3><p>Completion and intervention priorities for this assignment.</p></div></header><div className={styles.progressTrack}><div style={{ width: `${averageProgress}%` }} /></div><div className={styles.statusGrid}><Link href={`${tabHref('students')}&filter=not_started`}><strong>{notStarted}</strong><span>Not started</span></Link><Link href={`${tabHref('students')}&filter=in_progress`}><strong>{inProgress}</strong><span>In progress</span></Link><Link href={`${tabHref('students')}&filter=complete`}><strong>{completed}</strong><span>Complete</span></Link><Link href={`${tabHref('students')}&filter=attention`}><strong>{attention}</strong><span>Attention</span></Link></div></article></section><section className={styles.card}><header className={styles.sectionHeader}><div><h3>Assignment route</h3><p>The activities students must complete in sequence.</p></div><span>{assignment.required_activity_types.length} required</span></header><ol className={styles.routeList}>{assignment.required_activity_types.map((activity) => <li key={activity}>{getActivityLabel(activity)}</li>)}</ol></section></>}

    {(tab === 'students' || tab === 'evidence') && <section className={styles.card}><header className={styles.sectionHeader}><div><h3>{tab === 'students' ? 'Students' : 'Evidence'}</h3><p>{tab === 'students' ? 'Search, filter and prioritise the assignment roster.' : 'Open the saved activity evidence for an individual student.'}</p></div><span>{filteredRows.length} shown</span></header><form className={styles.filters}><input type="hidden" name="tab" value={tab} /><input name="q" defaultValue={query.q ?? ''} placeholder="Search students" aria-label="Search students" /><select name="filter" defaultValue={filter} aria-label="Filter students"><option value="all">All students</option><option value="attention">Needs attention</option><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="complete">Complete</option></select><button type="submit">Apply</button></form><div className={styles.studentList}>{filteredRows.length === 0 ? <div className={styles.empty}><h4>No students match</h4><p>Try changing the search or filter.</p></div> : filteredRows.map((row) => <article className={styles.studentRow} key={row.id}><div><h4>{row.name}</h4><p>{row.reason || `${statusLabel(row.progress?.status)} · ${row.progress?.last_activity_at ? `Last active ${formatDate(row.progress.last_activity_at)}` : 'No activity yet'}`}</p><div className={styles.progressTrack}><div style={{ width: `${row.progress?.progress_percent ?? 0}%` }} /></div></div><div className={styles.studentStats}><span><strong>{row.progress?.progress_percent ?? 0}%</strong> progress</span><span><strong>{row.confidence !== undefined ? `${row.confidence}/5` : '—'}</strong> confidence</span><span><strong>{row.progress?.completed_activity_count ?? 0}/{row.progress?.total_activity_count ?? assignment.required_activity_types.length}</strong> activities</span></div><Link className={styles.openLink} href={`/teacher/progress/${assignment.id}/${row.id}`}>{tab === 'evidence' ? 'Open evidence' : 'View student'}</Link></article>)}</div></section>}

    {tab === 'resources' && <section className={styles.card}><header className={styles.sectionHeader}><div><h3>Lesson resources</h3><p>Add supporting material to this existing pathway, then choose what students receive with this assignment.</p></div><span>{resources.filter((resource) => resource.attached).length} attached</span></header><LessonResourceManager assignmentId={assignment.id} pathwaySlug={assignment.pathway_slug} resources={resources} /></section>}

    {tab === 'settings' && <section className={styles.settingsGrid}><article className={styles.card}><header className={styles.sectionHeader}><div><h3>Assignment settings</h3><p>Update the deadline or instructions, refresh recipients, or archive the assignment.</p></div></header><AssignmentManager assignmentId={assignment.id} instructions={assignment.instructions} dueAt={assignment.due_at} status={assignment.status} /></article><aside className={styles.card}><header className={styles.sectionHeader}><div><h3>About these actions</h3><p>Changes apply immediately to this assignment.</p></div></header><ul className={styles.guidanceList}><li>Saving changes updates the deadline and student instructions.</li><li>Add new students includes active class members who joined after publication.</li><li>Archiving removes the assignment from student dashboards without deleting evidence.</li></ul></aside></section>}
  </main>;
}
