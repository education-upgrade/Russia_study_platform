import type { ReactNode } from 'react';
import { requireRoles } from '@/lib/auth/access';

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  await requireRoles(['teacher', 'admin']);
  return children;
}
