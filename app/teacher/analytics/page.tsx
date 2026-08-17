import TeacherCohortAnalyticsDashboard from '@/components/TeacherCohortAnalyticsDashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherAnalyticsPage({ searchParams }: { searchParams?: Promise<{ classId?: string }> }) {
  const query = searchParams ? await searchParams : {};
  return <TeacherCohortAnalyticsDashboard initialClassId={query.classId} />;
}
