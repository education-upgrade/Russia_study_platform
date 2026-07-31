import InterventionCentre from '@/components/InterventionCentre';

type Props = {
  searchParams?: Promise<{ assignment?: string; classId?: string; filter?: string; q?: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  return <InterventionCentre initialFilters={params} />;
}
