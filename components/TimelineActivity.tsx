'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';
import styles from './TimelineActivity.module.css';

type TimelineEvent = { id?: string; date: string; title: string; detail: string };
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type TimelineActivityProps = { activityId: string; events: TimelineEvent[]; nextHref?: string };

function getEventId(event: TimelineEvent, index: number) {
  const fallbackId = `${event.date}-${event.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return event.id ?? (fallbackId || `event-${index + 1}`);
}
function countWords(text: string) { return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length; }

export default function TimelineActivity({ activityId, events, nextHref }: TimelineActivityProps) {
  const router = useRouter(); const searchParams = useSearchParams(); const assignmentId = searchParams.get('assignment');
  const [reviewedEventIds,setReviewedEventIds]=useState<string[]>([]); const [turningPointId,setTurningPointId]=useState(''); const [reflection,setReflection]=useState('');
  const [isMovingNext,setIsMovingNext]=useState(false); const [saveStatus,setSaveStatus]=useState<SaveStatus>('idle'); const [saveMessage,setSaveMessage]=useState('');
  const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null); const mountedRef=useRef(false);
  const eventKeys=useMemo(()=>events.map((event,index)=>getEventId(event,index)),[events]);
  const reviewedCount=reviewedEventIds.length; const progressPercentage=events.length?Math.round((reviewedCount/events.length)*100):0;
  const selectedTurningPoint=events.find((event,index)=>eventKeys[index]===turningPointId); const reflectionWordCount=countWords(reflection);
  const canComplete=events.length>0&&reviewedCount===events.length&&Boolean(turningPointId)&&reflection.trim().length>0;
  const hasProgress=reviewedCount>0||Boolean(turningPointId)||reflection.trim().length>0;

  async function saveTimeline(status:'in_progress'|'complete',nextReviewedEventIds=reviewedEventIds,nextTurningPointId=turningPointId,nextReflection=reflection){
    const nextReviewedCount=nextReviewedEventIds.length; const nextProgressPercentage=events.length?Math.round((nextReviewedCount/events.length)*100):0;
    const nextTurningPoint=events.find((event,index)=>eventKeys[index]===nextTurningPointId); const nextReflectionWordCount=countWords(nextReflection);
    setSaveStatus('saving'); setSaveMessage('Saving...');
    try{
      if(assignmentId){
        await saveAssignmentActivityProgress({assignmentId,activityType:'timeline',status,score:nextReviewedCount,maxScore:events.length,position:{reviewedEventIds:nextReviewedEventIds,turningPointId:nextTurningPointId,turningPointTitle:nextTurningPoint?.title??'',chosenEventTitle:nextTurningPoint?.title??'',reflection:nextReflection,significanceExplanation:nextReflection,writtenResponse:nextReflection,reflectionWordCount:nextReflectionWordCount,totalEvents:events.length,completionPercentage:nextProgressPercentage}});
      }else{
        const response=await fetch('/api/student-responses/activity',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({activityId,responseType:'timeline',status,score:nextReviewedCount,response:{reviewedEventIds:nextReviewedEventIds,turningPointId:nextTurningPointId,turningPointTitle:nextTurningPoint?.title??'',reflection:nextReflection,reflectionWordCount:nextReflectionWordCount,totalEvents:events.length,completionPercentage:nextProgressPercentage}}),keepalive:true});
        const result=await response.json().catch(()=>null); if(!response.ok) throw new Error(result?.error??'Timeline progress could not be saved.');
      }
      setSaveStatus('saved'); setSaveMessage(status==='complete'?'Complete — saved automatically.':'Saved automatically.'); return true;
    }catch(error){setSaveStatus('error');setSaveMessage(error instanceof Error?error.message:'Timeline progress could not be saved.');return false;}
  }

  useEffect(()=>{
    if(!mountedRef.current){mountedRef.current=true;return;} if(!hasProgress)return; if(timerRef.current)clearTimeout(timerRef.current);
    timerRef.current=setTimeout(()=>{void saveTimeline(canComplete?'complete':'in_progress');},650);
    return()=>{if(timerRef.current)clearTimeout(timerRef.current);};
  },[reviewedEventIds,turningPointId,reflection,canComplete,hasProgress]);

  function toggleReviewed(eventId:string){const next=reviewedEventIds.includes(eventId)?reviewedEventIds.filter((id)=>id!==eventId):[...reviewedEventIds,eventId];setReviewedEventIds(next);void saveTimeline('in_progress',next,turningPointId,reflection);}
  function chooseTurningPoint(eventId:string){setTurningPointId(eventId);void saveTimeline('in_progress',reviewedEventIds,eventId,reflection);}
  async function moveToNext(){if(!canComplete||isMovingNext||!nextHref)return;if(timerRef.current)clearTimeout(timerRef.current);setIsMovingNext(true);const saved=await saveTimeline('complete');if(saved){router.push(nextHref);return;}setIsMovingNext(false);}

  if(events.length===0)return <section className="panel warm"><h3>No timeline events found</h3><p>This activity does not currently have any timeline events.</p></section>;
  return <div className={styles.shell}>
    <section className={styles.topbar}><div><h3>Timeline judgement</h3><p>Review each event, then choose the most significant turning point.</p></div><div className={styles.stats}><span>{reviewedCount}/{events.length} reviewed</span><span>{reflectionWordCount} words</span><span>{saveStatus==='saving'?'saving':saveStatus==='saved'?'saved':'autosave on'}</span></div></section>
    <div className={styles.progress}><div style={{width:`${progressPercentage}%`}} /></div>
    <section className={styles.timeline}>{events.map((event,index)=>{const eventId=eventKeys[index];const isReviewed=reviewedEventIds.includes(eventId);const isSelected=turningPointId===eventId;return <article key={eventId} className={`${styles.eventCard}${isReviewed?` ${styles.reviewed}`:''}${isSelected?` ${styles.selected}`:''}`}><div className={styles.eventDate}>{event.date}</div><div className={styles.eventBody}><h4>{event.title}</h4><p>{event.detail}</p><div className={styles.eventActions}><button type="button" className="button secondary" onClick={()=>toggleReviewed(eventId)}>{isReviewed?'Reviewed':'Mark reviewed'}</button><button type="button" className="button secondary" onClick={()=>chooseTurningPoint(eventId)}>{isSelected?'Selected turning point':'Choose as turning point'}</button></div></div></article>;})}</section>
    <section className={styles.reflectionPanel}><label><span>Why is your chosen event significant?</span><textarea value={reflection} onChange={(event)=>setReflection(event.target.value)} placeholder="This event was significant because it changed... However, its importance was limited by..." /></label>{selectedTurningPoint&&<p className={styles.selectedSummary}>Chosen turning point: <strong>{selectedTurningPoint.date} — {selectedTurningPoint.title}</strong></p>}</section>
    <section className={styles.submitRow}><p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage||'Every choice and written judgement saves automatically.'}</p><div className={styles.buttonRow}>{nextHref&&<button type="button" className="button" onClick={()=>void moveToNext()} disabled={!canComplete||isMovingNext||saveStatus==='saving'}>{isMovingNext||saveStatus==='saving'?'Saving...':'Next'}</button>}</div></section>
  </div>;
}
