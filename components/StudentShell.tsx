'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
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

function Navigation({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  return <nav className={mobile ? styles.mobileNav : undefined} aria-label={mobile ? 'Student mobile navigation' : 'Student navigation'}>{items.map((item) => <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? styles.active : ''}><span className={mobile ? undefined : styles.desktopLabel}>{mobile ? item.icon : item.label}</span>{mobile ? <small>{item.label}</small> : null}</Link>)}</nav>;
}

export default function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inPathway = pathname.startsWith('/student/lesson/');

  return <div className={`${styles.shell} ${inPathway ? styles.pathwayShell : ''}`}>
    {!inPathway ? <header className={styles.topbar}>
      <Link className={styles.brand} href="/student/dashboard"><span>R</span><strong>Russia Study</strong></Link>
      <Navigation pathname={pathname} />
    </header> : null}
    <div className={styles.content}>{children}</div>
    <Navigation pathname={pathname} mobile />
  </div>;
}
