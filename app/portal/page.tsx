import { redirectToRoleHome } from '@/lib/auth/access';

export default async function PortalPage() {
  await redirectToRoleHome();
  return null;
}
