import { NextResponse } from 'next/server';
import { requireRoles } from '@/lib/auth/access';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const auth = await requireRoles(['teacher', 'admin']);
  const supabase = await createServerSupabaseClient();
  if (!auth || !supabase) return NextResponse.json({ error: 'Staff access is required.' }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { rewardId?: string };
  if (!body.rewardId) return NextResponse.json({ error: 'Missing reward id.' }, { status: 400 });

  const { data: reward, error: readError } = await supabase
    .from('recall_reward_events')
    .select('id, status')
    .eq('id', body.rewardId)
    .maybeSingle();
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });
  if (!reward) return NextResponse.json({ error: 'Reward was not found or is not available to you.' }, { status: 404 });
  if (reward.status === 'given') return NextResponse.json({ ok: true, status: 'given' });

  const { error } = await supabase
    .from('recall_reward_events')
    .update({ status: 'given', acknowledged_at: new Date().toISOString(), acknowledged_by: auth.userId })
    .eq('id', reward.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, status: 'given' });
}
