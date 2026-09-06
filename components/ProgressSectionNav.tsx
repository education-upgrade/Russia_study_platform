import Link from 'next/link';
import styles from './ProgressSectionNav.module.css';

type ProgressSectionNavProps = {
  active: 'attention' | 'tracking' | 'insights';
};

export default function ProgressSectionNav({ active }: ProgressSectionNavProps) {
  const items = [
    { id: 'attention', label: 'Needs attention', href: '/teacher/progress' },
    { id: 'tracking', label: 'Tracking', href: '/teacher/progress/tracking' },
    { id: 'insights', label: 'Insights', href: '/teacher/analytics' },
  ] as const;

  return <nav className={styles.nav} aria-label="Progress views">
    {items.map((item) => <Link key={item.id} href={item.href} className={`${styles.item} ${active === item.id ? styles.active : ''}`} aria-current={active === item.id ? 'page' : undefined}>{item.label}</Link>)}
  </nav>;
}
