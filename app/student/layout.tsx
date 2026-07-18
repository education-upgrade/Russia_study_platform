import type { ReactNode } from 'react';
import { requireRoles } from '@/lib/auth/access';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  // Teachers and admins retain access so they can preview the student experience.
  await requireRoles(['student', 'teacher', 'admin']);
  return children;
}
