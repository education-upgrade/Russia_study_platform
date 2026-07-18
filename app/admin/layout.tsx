import type { ReactNode } from 'react';
import { requireRoles } from '@/lib/auth/access';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRoles(['admin']);
  return children;
}
