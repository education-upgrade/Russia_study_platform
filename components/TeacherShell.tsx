'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { activeSubjectIdentity } from '@/subjects/activeIdentity';
import styles from './TeacherShell.module.css';

type TeacherShellProps = { children: ReactNode };
type Section = 'home' | 'classes' | 'assignments' | 'progress';

const navigation = [
  { id: 'home', label: 'Home', href: '/teacher/dashboard', icon: '⌂' },
  { id: 'classes', label: 'Classes', href: '/teacher/classes', icon: '▦' },
  { id: 'assignments', label: 'Assignments', href: '/teacher/assignments', icon: '✓' },
  { id: 'progress', label: 'Progress', href: '/teacher/progress', icon: '↗' },
] as const;

function sectionFor(pathname: string): Section {
  if (pathname.startsWith('/teacher/classes')) return 'classes';
  if (pathname.startsWith('/teacher/assignments') || pathname.startsWith('/teacher/set-study')) return 'assignments';
  if (pathname.startsWith('/teacher/progress') || pathname.startsWith('/teacher/analytics')) return 'progress';
  return 'home';
}

function isNestedWorkspace(pathname: string) {
  return /^\/teacher\/classes\/[^/]+/.test(pathname)
    || /^\/teacher\/assignments\/[^/]+/.test(pathname)
    || /^\/teacher\/progress\/.+/.test(pathname)
    || pathname.startsWith('/teacher/analytics');
}

function topLevelMeta(section: Section) {
  if (section === 'classes') return { title: 'Classes', description: 'Who you teach, their assignments and class progress.' };
  if (section === 'assignments') return { title: 'Assignments', description: 'Manage active work, drafts and archived assignments.' };
  if (section === 'progress') return { title: 'Progress', description: 'See who needs attention, track completion and review patterns.' };
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
        <Link className={styles.brand} href="/teacher/dashboard" aria-label={`${activeSubjectIdentity.platformName} teacher home`}>
          <span className={styles.brandMark}>{activeSubjectIdentity.brandMark}</span>
          <span><strong>{activeSubjectIdentity.platformName}</strong><small>Teacher workspace</small></span>
        </Link>

        <nav className={styles.navigation} aria-label="Teacher navigation">
          {navigation.map((item) => {
            const active = item.id === section;
            return <Link className={`${styles.navItem} ${active ? styles.active : ''}`} href={item.href} key={item.id} aria-current={active ? 'page' : undefined}>
              <span className={styles.navIcon} aria-hidden="true">{item.icon}</span><span>{item.label}</span>
            </Link>;
          })}
        </nav>

        <div className={styles.sidebarActions}>
          <Link className={styles.primaryAction} href="/teacher/set-study">+ Set work</Link>
          <form action="/auth/signout" method="post"><button className={styles.signOut} type="submit">Sign out</button></form>
        </div>
      </aside>

      <div className={styles.workspace}>
        {!nested && pathname !== '/teacher/set-study' && <header className={styles.pageHeader}>
          <div className={styles.headerText}><h1>{meta.title}</h1><p>{meta.description}</p></div>
        </header>}
        <main className={styles.content}>{children}</main>
        <form className={styles.mobileSignOut} action="/auth/signout" method="post"><button type="submit">Sign out</button></form>
      </div>

      <nav className={styles.mobileNavigation} aria-label="Teacher mobile navigation">
        <Link href="/teacher/dashboard" className={section === 'home' ? styles.mobileActive : ''} aria-current={section === 'home' ? 'page' : undefined}><span aria-hidden="true">⌂</span><small>Home</small></Link>
        <Link href="/teacher/classes" className={section === 'classes' ? styles.mobileActive : ''} aria-current={section === 'classes' ? 'page' : undefined}><span aria-hidden="true">▦</span><small>Classes</small></Link>
        <Link href="/teacher/set-study" className={pathname.startsWith('/teacher/set-study') ? styles.mobileActive : styles.mobileSetWork} aria-current={pathname.startsWith('/teacher/set-study') ? 'page' : undefined}><span aria-hidden="true">＋</span><small>Set work</small></Link>
        <Link href="/teacher/assignments" className={section === 'assignments' && !pathname.startsWith('/teacher/set-study') ? styles.mobileActive : ''} aria-current={section === 'assignments' && !pathname.startsWith('/teacher/set-study') ? 'page' : undefined}><span aria-hidden="true">✓</span><small>Assignments</small></Link>
        <Link href="/teacher/progress" className={section === 'progress' ? styles.mobileActive : ''} aria-current={section === 'progress' ? 'page' : undefined}><span aria-hidden="true">↗</span><small>Progress</small></Link>
      </nav>
    </div>
  );
}
