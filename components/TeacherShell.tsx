'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './TeacherShell.module.css';

type TeacherShellProps = { children: ReactNode };
type Section = 'home' | 'classes' | 'assignments' | 'interventions';

const navigation = [
  { id: 'home', label: 'Home', href: '/teacher/dashboard', icon: '⌂' },
  { id: 'classes', label: 'Classes', href: '/teacher/classes', icon: '▦' },
  { id: 'assignments', label: 'Assignments', href: '/teacher/assignments', icon: '✓' },
  { id: 'interventions', label: 'Interventions', href: '/teacher/progress', icon: '↗' },
] as const;

function sectionFor(pathname: string): Section {
  if (pathname.startsWith('/teacher/classes')) return 'classes';
  if (pathname.startsWith('/teacher/assignments') || pathname.startsWith('/teacher/set-study')) return 'assignments';
  if (pathname.startsWith('/teacher/progress')) return 'interventions';
  return 'home';
}

function isNestedWorkspace(pathname: string) {
  return /^\/teacher\/classes\/[^/]+/.test(pathname)
    || /^\/teacher\/assignments\/[^/]+/.test(pathname)
    || /^\/teacher\/progress\/.+/.test(pathname);
}

function topLevelMeta(section: Section) {
  if (section === 'classes') return { title: 'Classes', description: 'Open a teaching group or create a new class.' };
  if (section === 'assignments') return { title: 'Assignments', description: 'Find existing work or set a new assignment.' };
  if (section === 'interventions') return { title: 'Interventions', description: 'Focus on students who need teacher attention.' };
  return { title: 'Teacher home', description: 'What needs your attention today.' };
}

export default function TeacherShell({ children }: TeacherShellProps) {
  const pathname = usePathname();
  const section = sectionFor(pathname);
  const nested = isNestedWorkspace(pathname);
  const meta = topLevelMeta(section);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/teacher/dashboard" aria-label="Russia Study Platform teacher home">
          <span className={styles.brandMark}>R</span>
          <span><strong>Russia Study</strong><small>Teacher workspace</small></span>
        </Link>

        <nav className={styles.navigation} aria-label="Teacher navigation">
          {navigation.map((item) => {
            const active = item.id === section;
            return <Link className={`${styles.navItem} ${active ? styles.active : ''}`} href={item.href} key={item.id} aria-current={active ? 'page' : undefined}>
              <span className={styles.navIcon} aria-hidden="true">{item.icon}</span><span>{item.label}</span>
            </Link>;
          })}
        </nav>

        <Link className={styles.primaryAction} href="/teacher/set-study">+ Set work</Link>
      </aside>

      <div className={styles.workspace}>
        {!nested && pathname !== '/teacher/set-study' && <header className={styles.pageHeader}>
          <div className={styles.headerText}><h1>{meta.title}</h1><p>{meta.description}</p></div>
          {section !== 'assignments' && <Link className={styles.primaryAction} href="/teacher/set-study">Set work</Link>}
        </header>}
        <main className={styles.content}>{children}</main>
      </div>

      <nav className={styles.mobileNavigation} aria-label="Teacher mobile navigation">
        {navigation.map((item) => {
          const active = item.id === section;
          return <Link href={item.href} key={item.id} className={active ? styles.mobileActive : ''} aria-current={active ? 'page' : undefined}>
            <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
          </Link>;
        })}
      </nav>
    </div>
  );
}
