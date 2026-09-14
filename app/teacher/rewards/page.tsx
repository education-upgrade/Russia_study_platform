import AcknowledgeRecallRewardButton from '@/components/AcknowledgeRecallRewardButton';
import { requireRoles } from '@/lib/auth/access';
import { formatSchoolDateTime } from '@/lib/dateTime';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REWARD_INTERVAL = 50;

type ClassLink = {
  class_id: string;
  teaching_classes: { id: string; name: string; is_active: boolean } | { id: string; name: string; is_active: boolean }[] | null;
};
type Membership = { class_id: string; student_id: string };
type Profile = { id: string; full_name: string | null };
type RecallStat = { student_id: string; total_attempts: number; total_correct: number; current_level: number; updated_at: string };
type Reward = { id: string; student_id: string; level_reached: number; threshold_correct: number; status: 'pending' | 'given'; reached_at: string; acknowledged_at: string | null };

function firstRelation<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] ?? null : value; }
function displayName(value: string | null | undefined) { return value?.trim() || 'Student'; }

export default async function RecallRewardsPage() {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return null;

  let classLinksQuery = supabase
    .from('class_teachers')
    .select('class_id, teaching_classes(id, name, is_active)')
    .order('created_at', { ascending: false });
  if (auth.profile.role !== 'admin') classLinksQuery = classLinksQuery.eq('teacher_id', auth.userId);

  const { data: classLinks, error: classError } = await classLinksQuery;
  const activeClasses = ((classLinks ?? []) as ClassLink[])
    .map((link) => firstRelation(link.teaching_classes))
    .filter((item): item is { id: string; name: string; is_active: boolean } => Boolean(item?.is_active));
  const classIds = activeClasses.map((item) => item.id);

  const { data: membershipData, error: membershipError } = classIds.length
    ? await supabase.from('class_memberships').select('class_id, student_id').in('class_id', classIds).eq('status', 'active')
    : { data: [], error: null };
  const memberships = (membershipData ?? []) as Membership[];
  const studentIds = Array.from(new Set(memberships.map((row) => row.student_id)));

  const [profilesResult, statsResult, rewardsResult] = await Promise.all([
    studentIds.length ? supabase.from('profiles').select('id, full_name').in('id', studentIds) : Promise.resolve({ data: [], error: null }),
    studentIds.length ? supabase.from('student_recall_stats').select('student_id, total_attempts, total_correct, current_level, updated_at').in('student_id', studentIds) : Promise.resolve({ data: [], error: null }),
    studentIds.length ? supabase.from('recall_reward_events').select('id, student_id, level_reached, threshold_correct, status, reached_at, acknowledged_at').in('student_id', studentIds).order('reached_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
  ]);

  const profiles = new Map(((profilesResult.data ?? []) as Profile[]).map((row) => [row.id, displayName(row.full_name)]));
  const stats = new Map(((statsResult.data ?? []) as RecallStat[]).map((row) => [row.student_id, row]));
  const classNames = new Map(activeClasses.map((item) => [item.id, item.name]));
  const classesByStudent = new Map<string, string[]>();
  memberships.forEach((membership) => {
    const existing = classesByStudent.get(membership.student_id) ?? [];
    const name = classNames.get(membership.class_id);
    if (name && !existing.includes(name)) existing.push(name);
    classesByStudent.set(membership.student_id, existing);
  });

  const roster = studentIds.map((studentId) => {
    const stat = stats.get(studentId);
    const totalCorrect = stat?.total_correct ?? 0;
    const attempts = stat?.total_attempts ?? 0;
    const level = stat?.current_level ?? 1;
    const nextRewardAt = Math.max(level * REWARD_INTERVAL, REWARD_INTERVAL);
    return {
      id: studentId,
      name: profiles.get(studentId) ?? 'Student',
      classes: classesByStudent.get(studentId) ?? [],
      totalCorrect,
      attempts,
      level,
      accuracy: attempts ? Math.round((totalCorrect / attempts) * 100) : null,
      toNextReward: Math.max(0, nextRewardAt - totalCorrect),
    };
  }).sort((a, b) => b.level - a.level || b.totalCorrect - a.totalCorrect || a.name.localeCompare(b.name));

  const rewards = (rewardsResult.data ?? []) as Reward[];
  const pending = rewards.filter((row) => row.status === 'pending');
  const given = rewards.filter((row) => row.status === 'given').slice(0, 12);
  const totalCorrect = roster.reduce((sum, row) => sum + row.totalCorrect, 0);
  const averageLevel = roster.length ? (roster.reduce((sum, row) => sum + row.level, 0) / roster.length).toFixed(1) : '—';
  const loadError = classError || membershipError || profilesResult.error || statsResult.error || rewardsResult.error;

  return <div className={styles.page}>
    {loadError && <section className={styles.error} role="alert"><strong>Some Recall reward data could not be loaded.</strong><span>{loadError.message}</span></section>}

    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>Russia Recall</p><h2>Levels & rewards</h2><p>Levels are based on total correct Recall answers. Every {REWARD_INTERVAL} correct answers raises a student by one level and creates a teacher reward.</p></div>
      <div className={styles.due}><strong>{pending.length}</strong><span>rewards due</span></div>
    </section>

    <section className={styles.metrics} aria-label="Recall reward summary">
      <article><span>Students</span><strong>{roster.length}</strong></article>
      <article><span>Rewards due</span><strong>{pending.length}</strong></article>
      <article><span>Average level</span><strong>{averageLevel}</strong></article>
      <article><span>Total correct</span><strong>{totalCorrect}</strong></article>
    </section>

    <section className={styles.panel}>
      <header className={styles.panelHeader}><div><p className={styles.eyebrow}>Action needed</p><h2>Rewards to give</h2><p>These students have crossed a 50-correct threshold and are waiting for their teacher reward.</p></div></header>
      {pending.length ? <div className={styles.rewardList}>{pending.map((reward) => <article key={reward.id} className={styles.rewardRow}>
        <div><strong>{profiles.get(reward.student_id) ?? 'Student'}</strong><p>{(classesByStudent.get(reward.student_id) ?? []).join(' · ') || 'Current class'}</p></div>
        <div className={styles.rewardDetail}><strong>Level {reward.level_reached}</strong><span>{reward.threshold_correct} correct</span><small>Reached {formatSchoolDateTime(reward.reached_at, { day: 'numeric', month: 'short' })}</small></div>
        <AcknowledgeRecallRewardButton rewardId={reward.id} />
      </article>)}</div> : <div className={styles.empty}><strong>All caught up</strong><p>New rewards will appear here automatically when students reach their next level.</p></div>}
    </section>

    <section className={styles.panel}>
      <header className={styles.panelHeader}><div><p className={styles.eyebrow}>Student overview</p><h2>Recall levels</h2><p>One Russia Recall level follows each student across the course, even if they are in more than one class.</p></div></header>
      {roster.length ? <div className={styles.table}>
        <div className={`${styles.tableRow} ${styles.tableHead}`}><span>Student</span><span>Level</span><span>Correct</span><span>Accuracy</span><span>Next reward</span></div>
        {roster.map((student) => <div className={styles.tableRow} key={student.id}>
          <div><strong>{student.name}</strong><small>{student.classes.join(' · ') || 'Current class'}</small></div>
          <span><strong>Level {student.level}</strong></span>
          <span>{student.totalCorrect}</span>
          <span>{student.accuracy === null ? '—' : `${student.accuracy}%`}</span>
          <span>{student.toNextReward} to go</span>
        </div>)}
      </div> : <div className={styles.empty}><strong>No students yet</strong><p>Students will appear here once they have joined one of your active classes.</p></div>}
    </section>

    {given.length > 0 && <section className={styles.panel}>
      <header className={styles.panelHeader}><div><p className={styles.eyebrow}>Recently completed</p><h2>Rewards given</h2></div></header>
      <div className={styles.history}>{given.map((reward) => <article key={reward.id}><div><strong>{profiles.get(reward.student_id) ?? 'Student'}</strong><span>Level {reward.level_reached} · {reward.threshold_correct} correct</span></div><small>{reward.acknowledged_at ? formatSchoolDateTime(reward.acknowledged_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Given'}</small></article>)}</div>
    </section>}
  </div>;
}
