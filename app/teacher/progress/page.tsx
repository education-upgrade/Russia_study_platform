import TeacherEvidenceDashboard from '@/components/TeacherEvidenceDashboard';

type Props = {
  searchParams?: Promise<{ assignment?: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  return <TeacherEvidenceDashboard selectedAssignmentId={params.assignment} />;
}
