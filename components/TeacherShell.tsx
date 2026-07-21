'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './TeacherShell.module.css';

type TeacherShellProps = { children: ReactNode };

type RouteMeta = {
  title: string;
  description: string;
  section: 'home' | 'classes' | 'assignments' | 'progress';
  primaryHref?: string;
  primaryLabel?: string;
};

const navigation = [
  { id: 'home', label: 'Home', href: '/teacher/dashboard', icon: '⌂' },
  { id: 'classes', label: 'Classes', href: '/teacher/classes', icon: '▦' },
  { id: 'assignments', label: 'Assignments', href: '/teacher/set-study', icon: '✓' },
  { id: 'progress', label: 'Progress', href: '/teacher/progress', icon: '↗' },
] as const;

function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith('/teacher/classes')) {
    return {
      title: 'Classes',
      description: 'Manage teaching groups, join codes and class membership.',
      section: 'classes',
      primaryHref: '/teacher/set-study',
      primaryLabel: 'Set work',
    };
  }

  if (pathname.startsWith('/teacher/set-study')) {
    return {
      title: 'Assignments',
      description: 'Set, review and manage guided study for your classes.',
      section: 'assignments',
    };
  }

  if (pathname.startsWith('/teacher/progress/')) {
    return {
      title: 'Student evidence',
      description: 'Review an individual student’s progress and saved activity evidence.',
      section: 'progress',
      primaryHref: '/teacher/progress',
      primaryLabel: 'Class progress',
    };
  }

  if (pathname.startsWith('/teacher/progress')) {
    return {
      title: 'Progress',
      description: 'Identify completion, confidence and students who need attention.',
      section: 'progress',
      primaryHref: '/teacher/set-study',
      primaryLabel: 'Set work',
    };
  }

  return {
    title: 'Teacher home',
    description: 'Open a class, set work and review student progress.',
    section: 'home',
    primaryHref: '/teacher/set-study',
    primaryLabel: 'Set work',
  };
}

function Breadcrumbs({ pathname, title }: { pathname: string; title: string }) {
  const items: { label: string; href?: string }[] = [{ label: 'Teacher', href: '/teacher/dashboard' }];

  if (pathname.startsWith('/teacher/classes')) items.push({ label: 'Classes' });
  else if (pathname.startsWith('/teacher/set-study')) items.push({ label: 'Assignments' });
  else if (pathname.startsWith('/teacher/progress/')) {
    items.push({ label: 'Progress', href: '/teacher/progress' });
    items.push({ label: title });
  } else if (pathname.startsWith('/teacher/progress')) items.push({ label: 'Progress' });
  else items.push({ label: 'Home' });

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export default function TeacherShell({ children }: TeacherShellProps) {
  const pathname = usePathname();
  const meta = getRouteMeta(pathname);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/teacher/dashboard" aria-label="Russia Study Platform teacher home">
          <span className={styles.brandMark}>R</span>
          <span><strong>Russia Study</strong><small>Teacher workspace</small></span>
        </Link>

        <nav className={styles.navigation} aria-label="Teacher navigation">
          {navigation.map((item) => {
            const active = item.id === meta.section;
            return (
              <Link className={`${styles.navItem} ${active ? styles.active : ''}`} href={item.href} key={item.id} aria-current={active ? 'page' : undefined}>
                <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.futureNavigation} aria-label="Future teacher sections">
          <span><b aria-hidden="true">◇</b> Resources <small>Coming soon</small></span>
          <span><b aria-hidden="true">⚙</b> Settings <small>Coming soon</small></span>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.pageHeader}>
          <div className={styles.headerText}>
            <Breadcrumbs pathname={pathname} title={meta.title} />
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </div>
          {meta.primaryHref && meta.primaryLabel && (
            <Link className={styles.primaryAction} href={meta.primaryHref}>{meta.primaryLabel}</Link>
          )}
        </header>

        <main className={styles.content}>{children}</main>
      </div>

      <nav className={styles.mobileNavigation} aria-label="Teacher mobile navigation">
        {navigation.map((item) => {
          const active = item.id === meta.section;
          return (
            <Link href={item.href} key={item.id} className={active ? styles.mobileActive : ''} aria-current={active ? 'page' : undefined}>
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
