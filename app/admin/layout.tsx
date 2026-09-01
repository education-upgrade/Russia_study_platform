import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedProfile } from '@/lib/auth/access';
import { isPlatformOwner } from '@/lib/auth/owner';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthenticatedProfile();
  if (!auth) redirect('/login?next=/admin');
  if (auth.profile.role !== 'admin' && !isPlatformOwner(auth.userId)) redirect('/access-denied?required=admin');
  return children;
}
