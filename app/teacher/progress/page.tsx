import Link from 'next/link';
import InterventionCentre from '@/components/InterventionCentre';

type Props = {
  searchParams?: Promise<{ assignment?: string; classId?: string; filter?: string; q?: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeacherProgressPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const insightsHref = params.classId ? `/teacher/analytics?classId=${encodeURIComponent(params.classId)}` : '/teacher/analytics';
  return <>
    <div className="button-row" style={{ justifyContent: 'flex-end', marginBottom: 10 }}><Link className="button secondary" href={insightsHref}>View insights</Link></div>
    <InterventionCentre initialFilters={params} />
  </>;
}
