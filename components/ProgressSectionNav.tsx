import Link from 'next/link';

type ProgressSectionNavProps = {
  active: 'attention' | 'tracking' | 'insights';
};

export default function ProgressSectionNav({ active }: ProgressSectionNavProps) {
  const items = [
    { id: 'attention', label: 'Needs attention', href: '/teacher/progress' },
    { id: 'tracking', label: 'Tracking', href: '/teacher/progress/tracking' },
    { id: 'insights', label: 'Insights', href: '/teacher/analytics' },
  ] as const;

  return <nav className="button-row" aria-label="Progress views" style={{ marginBottom: 14 }}>
    {items.map((item) => <Link key={item.id} href={item.href} className={`button ${active === item.id ? '' : 'secondary'}`} aria-current={active === item.id ? 'page' : undefined}>{item.label}</Link>)}
  </nav>;
}
