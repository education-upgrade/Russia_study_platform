import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getPathwayConfig } from '@/lib/pathwayRegistry';

const DEMO_STUDENT_ID = '22222222-2222-2222-2222-222222222222';

type AssignmentRoute = {
  pathway_slug: string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentEntryPage() {
  if (!supabase) {
    redirect(getPathwayConfig('alexander-ii-wider-reforms').routeBase);
  }

  const { data: assignment } = await supabase
    .from('guided_study_assignments')
    .select('pathway_slug')
    .eq('assigned_student_id', DEMO_STUDENT_ID)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<AssignmentRoute>();

  const config = getPathwayConfig(assignment?.pathway_slug ?? 'alexander-ii-wider-reforms');
  redirect(config.routeBase);
}
