import type { ReactNode } from 'react';
import { requireRoles } from '@/lib/auth/access';
import StudentShell from '@/components/StudentShell';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireRoles(['student', 'teacher', 'admin']);
  return <StudentShell>{children}</StudentShell>;
}
