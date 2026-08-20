import Link from 'next/link';
import { redirect } from 'next/navigation';
import AssignmentLaunchButton from '@/components/AssignmentLaunchButton';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { tryGetActivePathwayConfig } from '@/lib/activeSubjectRuntime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

type Assignment = { id:string; title:string; lesson_title:string; pathway_slug:string; required_activity_types:string[]; due_at:string|null; teaching_classes:{name:string}|{name:string}[]|null };
type Recipient = { assignment_id:string; classroom_assignments:Assignment|Assignment[]|null };
type Progress = { assignment_id:string; status:'not_started'|'in_progress'|'complete'; progress_percent:number; completed_activity_count:number; total_activity_count:number; current_activity_type:string|null };
type WorkItem = { assignment:Assignment; progress?:Progress; routeBase:string };

function deadline(value:string|null){return value?new Date(value).toLocaleString('en-GB',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'No deadline'}
function status(progress?:Progress){if(progress?.status==='complete')return 'Complete';if(!progress||progress.status==='not_started'||progress.progress_percent===0)return 'Not attempted';return 'Incomplete'}

export const dynamic='force-dynamic';
export const revalidate=0;

export default async function StudentWorkPage({searchParams}:{searchParams?:Promise<{view?:string}>}){
  const auth=await getAuthenticatedProfile();
  if(!auth)redirect('/account');
  if(auth.profile.role!=='student')redirect('/student/dashboard');
  const params=searchParams?await searchParams:{};
  const view=params.view==='complete'?'complete':'todo';
  const supabase=await createServerSupabaseClient();
  if(!supabase)return null;
  const [{data:recipientData},{data:progressData}]=await Promise.all([
    supabase.from('assignment_recipients').select('assignment_id, classroom_assignments(id,title,lesson_title,pathway_slug,required_activity_types,due_at,teaching_classes(name))').eq('student_id',auth.userId).eq('status','assigned'),
    supabase.from('assignment_progress').select('assignment_id,status,progress_percent,completed_activity_count,total_activity_count,current_activity_type').eq('student_id',auth.userId),
  ]);
  const progressMap=new Map(((progressData??[]) as Progress[]).map(row=>[row.assignment_id,row]));
  const items:WorkItem[]=((recipientData??[]) as Recipient[]).flatMap(row=>{const assignment=Array.isArray(row.classroom_assignments)?row.classroom_assignments[0]:row.classroom_assignments;if(!assignment)return[];const pathway=tryGetActivePathwayConfig(assignment.pathway_slug);if(!pathway)return[];const progress=progressMap.get(assignment.id);return[{assignment,progress,routeBase:pathway.routeBase}]})
    .filter(item=>view==='complete'?item.progress?.status==='complete':item.progress?.status!=='complete')
    .sort((a,b)=>{if(!a.assignment.due_at&&!b.assignment.due_at)return 0;if(!a.assignment.due_at)return 1;if(!b.assignment.due_at)return-1;return new Date(a.assignment.due_at).getTime()-new Date(b.assignment.due_at).getTime()});

  return <main className={styles.page}>
    <header className={styles.header}><div><p className={styles.eyebrow}>My work</p><h1>Assignments</h1><p>Everything available in this study platform, without cluttering your home screen.</p></div></header>
    <nav className={styles.tabs}><Link className={view==='todo'?styles.active:''} href="/student/work?view=todo">To do</Link><Link className={view==='complete'?styles.active:''} href="/student/work?view=complete">Complete</Link></nav>
    {items.length===0?<section className={styles.empty}><h2>{view==='complete'?'No completed work yet':'You are up to date'}</h2><p>{view==='complete'?'Completed assignments available in this platform will appear here.':'There is no unfinished work available in this study platform.'}</p></section>:<section className={styles.list}>{items.map(({assignment,progress,routeBase})=>{const teachingClass=Array.isArray(assignment.teaching_classes)?assignment.teaching_classes[0]:assignment.teaching_classes;const activity=progress?.current_activity_type??assignment.required_activity_types[0];const href=`${routeBase}?assignment=${assignment.id}`;const pct=progress?.progress_percent??0;return <article className={styles.card} key={assignment.id}><div className={styles.main}><div><span className={styles.status}>{status(progress)}</span><h2>{assignment.title}</h2><p>{teachingClass?.name??'Your class'} · {assignment.lesson_title}</p></div><strong>{pct}%</strong><div className={styles.bar}><span style={{width:`${pct}%`}}/></div><p className={styles.meta}>{deadline(assignment.due_at)} · {Math.max((progress?.total_activity_count??assignment.required_activity_types.length)-(progress?.completed_activity_count??0),0)} activities left</p></div>{view==='complete'?<Link className={styles.review} href={href}>Review</Link>:<AssignmentLaunchButton assignmentId={assignment.id} activityType={activity} href={href} label={pct>0?'Continue':'Start'} />}</article>})}</section>}
  </main>;
}
