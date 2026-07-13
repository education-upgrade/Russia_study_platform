'use client';

import Link from 'next/link';

type LessonSection = {
  heading: string;
  body: string;
  question?: string;
  taskType?: string;
};

type Props = {
  sections: LessonSection[];
  nextHref?: string;
};

export default function LessonContentActivity({ sections, nextHref }: Props) {
  if (!sections.length) {
    return (
      <section className="card warm">
        <h1>No lesson content found</h1>
        <p>This pathway does not currently have any lesson sections.</p>
      </section>
    );
  }

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      {sections.map((section, index) => (
        <article
          key={`${section.heading}-${index}`}
          style={{
            border: '1px solid rgba(213, 226, 235, 0.95)',
            borderRadius: 24,
            background: 'rgba(255, 255, 255, 0.86)',
            padding: '20px',
            boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'var(--muted)',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Section {index + 1}
          </p>
          <h2 style={{ margin: '8px 0 10px', color: 'var(--navy)' }}>{section.heading}</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--navy)' }}>{section.body}</p>
          {section.question && (
            <div
              style={{
                marginTop: 16,
                borderRadius: 18,
                background: 'rgba(238, 244, 249, 0.95)',
                padding: '14px 16px',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 6, color: 'var(--navy)' }}>
                Check your understanding
              </strong>
              <p style={{ margin: 0, color: 'var(--navy)' }}>{section.question}</p>
            </div>
          )}
        </article>
      ))}

      {nextHref && (
        <Link
          href={nextHref}
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 52,
            borderRadius: 999,
            padding: '12px 20px',
            background: 'var(--navy)',
            color: 'white',
            fontWeight: 950,
          }}
        >
          Continue
        </Link>
      )}
    </section>
  );
}
