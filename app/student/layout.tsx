import type { ReactNode } from 'react';
import { requireRoles } from '@/lib/auth/access';
import StudentShell from '@/components/StudentShell';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);

  if (auth?.profile.role === 'student') {
    const supabase = await createServerSupabaseClient();
    if (supabase) await supabase.rpc('sync_my_assignment_recipients');
  }

  return <StudentShell>{children}</StudentShell>;
}
