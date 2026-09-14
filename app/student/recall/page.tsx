import RecallHub from '@/components/recall/RecallHub';
import { requireRoles } from '@/lib/auth/access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentRecallPage() {
  await requireRoles(['student']);
  return <RecallHub />;
}
