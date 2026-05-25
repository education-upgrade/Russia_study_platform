import Link from 'next/link';

export type ComingSoonActivityRendererProps = {
  title: string;
  activityLabel: string;
  pathwayHref: string;
  nextHref?: string;
  explanation?: string;
};

export default function ComingSoonActivityRenderer({
  title,
  activityLabel,
  pathwayHref,
  nextHref,
  explanation,
}: ComingSoonActivityRendererProps) {
  return (
    <section
      style={{
        width: '100%',
        borderRadius: 28,
        padding: '28px 24px',
        background: 'linear-gradient(135deg, #eef6fb 0%, #f5f0fb 100%)',
        border: '1px solid rgba(42, 63, 86, 0.12)',
        boxShadow: '0 18px 40px rgba(35, 52, 73, 0.08)',
        color: '#17263b',
      }}
    >
      <p
        style={{
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: 12,
          fontWeight: 800,
          color: '#54708e',
        }}
      >
        {activityLabel}
      </p>
      <h2 style={{ margin: '10px 0 8px', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', lineHeight: 1.05 }}>
        {title}
      </h2>
      <p style={{ margin: '0 0 18px', maxWidth: 680, lineHeight: 1.6, color: '#44566f' }}>
        {explanation ??
          'This activity type is approved in the pathway system, but its interactive renderer has not been built yet. The pathway is safe: return to the route or continue to the next available task.'}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link
          href={pathwayHref}
          style={{
            borderRadius: 999,
            padding: '11px 16px',
            background: '#17263b',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          Return to pathway
        </Link>
        {nextHref && nextHref !== pathwayHref && (
          <Link
            href={nextHref}
            style={{
              borderRadius: 999,
              padding: '11px 16px',
              background: 'white',
              color: '#17263b',
              textDecoration: 'none',
              fontWeight: 800,
              border: '1px solid rgba(42, 63, 86, 0.16)',
            }}
          >
            Continue
          </Link>
        )}
      </div>
    </section>
  );
}
