'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { activeSubjectIdentity } from '@/subjects/activeSubject';
import styles from './StudentShell.module.css';

const items = [
  { href: '/student/dashboard', label: 'Home', icon: '⌂' },
  { href: '/student/work', label: 'My work', icon: '✓' },
  { href: '/student/join', label: 'My classes', icon: '▦' },
];

function isActive(pathname: string, href: string) {
  if (href === '/student/dashboard') return pathname === href;
  return pathname.startsWith(href);
}

export default function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inPathway = pathname.startsWith('/student/lesson/');

  return <div className={`${styles.shell} ${inPathway ? styles.pathwayShell : ''}`}>
    {!inPathway ? <header className={styles.topbar}>
      <Link className={styles.brand} href="/student/dashboard"><span>{activeSubjectIdentity.brandMark}</span><strong>{activeSubjectIdentity.platformName}</strong></Link>
      <nav aria-label="Student navigation">{items.map((item) => <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? styles.active : ''}>{item.label}</Link>)}</nav>
    </header> : null}
    <div className={styles.content}>{children}</div>
    <nav className={styles.mobileNav} aria-label="Student mobile navigation">{items.map((item) => <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? styles.active : ''}><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></Link>)}</nav>
  </div>;
}
