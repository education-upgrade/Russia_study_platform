'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export type LessonSection = {
  heading: string;
  body: string;
  question?: string;
  taskType?: string;
};

type Props = {
  sections: LessonSection[];
  nextHref?: string;
  pathwayHref: string;
};

function countWords(value: string) {
  return value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;
}

export default function LessonContentActivity({ sections, nextHref, pathwayHref }: Props) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const wordCount = useMemo(() => countWords(summary), [summary]);
  const tooLong = wordCount > 90;
  const canSubmit = wordCount > 0 && !tooLong && !saving;

  function updateSummary(value: string) {
    setSummary(value);
    if (saved) setSaved(false);
    if (error) setError('');
  }

  async function submitSummary() {
    if (!canSubmit) return;
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      if (assignmentId) {
        const response = await fetch('/api/assignment-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId,
            activityType: 'lesson_content',
            status: 'complete',
            position: {
              lessonSummary: summary.trim(),
              summaryWordCount: wordCount,
              completedVia: 'lesson_summary',
            },
          }),
        });

        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error ?? 'Your lesson summary could not be saved.');
      }

      setSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Your lesson summary could not be saved.');
    } finally {
      setSaving(false);
    }
  }

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

      <section
        style={{
          border: '1px solid rgba(213, 226, 235, 0.95)',
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
          display: 'grid',
          gap: 12,
        }}
      >
        <div>
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
            Final task
          </p>
          <h2 style={{ margin: '8px 0 8px', color: 'var(--navy)' }}>Summarise the lesson notes</h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--navy)' }}>
            Summarise the most important ideas from these lesson notes in no more than 90 words. Focus on what you would need to remember later.
          </p>
        </div>

        <textarea
          value={summary}
          onChange={(event) => updateSummary(event.target.value)}
          placeholder="Write your summary here..."
          rows={7}
          aria-label="Lesson notes summary"
          disabled={saving}
          style={{
            width: '100%',
            resize: 'vertical',
            minHeight: 150,
            border: tooLong ? '2px solid #b94747' : '1px solid rgba(213, 226, 235, 0.95)',
            borderRadius: 18,
            padding: '14px 16px',
            font: 'inherit',
            lineHeight: 1.6,
            color: 'var(--navy)',
            background: 'white',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: tooLong ? '#9f3434' : 'var(--muted)', fontWeight: 800 }}>
            {wordCount}/90 words{tooLong ? ' — shorten your summary before submitting' : ''}
          </span>
          {error && <span style={{ color: '#9f3434', fontWeight: 800 }}>{error}</span>}
        </div>

        {!saved ? (
          <button
            type="button"
            onClick={submitSummary}
            disabled={!canSubmit}
            style={{
              minHeight: 52,
              border: 0,
              borderRadius: 999,
              padding: '12px 20px',
              background: 'var(--navy)',
              color: 'white',
              fontWeight: 950,
              fontSize: 16,
              opacity: canSubmit ? 1 : 0.48,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {saving ? 'Saving summary...' : 'Save summary'}
          </button>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            <div
              role="status"
              style={{
                borderRadius: 18,
                padding: '13px 16px',
                background: 'rgba(220, 244, 235, 0.92)',
                color: 'var(--navy)',
                fontWeight: 900,
                textAlign: 'center',
              }}
            >
              ✓ Summary saved. Lesson notes complete.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: nextHref ? '1fr 1fr' : '1fr', gap: 10 }}>
              <Link
                href={pathwayHref}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 52,
                  borderRadius: 999,
                  padding: '12px 18px',
                  border: '1px solid rgba(213, 226, 235, 0.95)',
                  background: 'white',
                  color: 'var(--navy)',
                  fontWeight: 950,
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Back to pathway
              </Link>
              {nextHref && (
                <Link
                  href={nextHref}
                  style={{
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 52,
                    borderRadius: 999,
                    padding: '12px 18px',
                    background: 'var(--navy)',
                    color: 'white',
                    fontWeight: 950,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Next activity →
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
