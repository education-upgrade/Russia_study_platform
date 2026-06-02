import { type AdaptiveRendererSupport } from '@/lib/activityRendererContracts';

type AdaptiveSupportPanelProps = {
  adaptiveSupport?: AdaptiveRendererSupport;
  compact?: boolean;
};

export function hasAdaptiveSupport(adaptiveSupport?: AdaptiveRendererSupport) {
  return Boolean(adaptiveSupport?.difficultyLevel || adaptiveSupport?.supportStrategy || adaptiveSupport?.successTarget);
}

export function AdaptiveDifficultyBadge({ adaptiveSupport }: { adaptiveSupport?: AdaptiveRendererSupport }) {
  if (!adaptiveSupport?.difficultyLevel) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        border: '1px solid rgba(213, 226, 235, 0.95)',
        background: 'rgba(255, 255, 255, 0.72)',
        color: 'var(--navy)',
        padding: '5px 10px',
        fontSize: 12,
        fontWeight: 950,
        textTransform: 'capitalize',
      }}
    >
      {adaptiveSupport.difficultyLevel}
    </span>
  );
}

export function AdaptiveSuccessTarget({ adaptiveSupport }: { adaptiveSupport?: AdaptiveRendererSupport }) {
  if (!adaptiveSupport?.successTarget) return null;

  return <p style={{ margin: '4px 0 0', fontWeight: 850 }}><strong>Target:</strong> {adaptiveSupport.successTarget}</p>;
}

export default function AdaptiveSupportPanel({ adaptiveSupport, compact = false }: AdaptiveSupportPanelProps) {
  if (!hasAdaptiveSupport(adaptiveSupport)) return null;

  return (
    <aside
      style={{
        border: '1px solid rgba(213, 226, 235, 0.95)',
        borderRadius: compact ? 16 : 22,
        background: 'rgba(255, 255, 255, 0.78)',
        padding: compact ? '10px 12px' : '12px 14px',
        marginBottom: compact ? 10 : 14,
        color: 'var(--navy)',
        boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <strong>Adaptive support</strong>
        <AdaptiveDifficultyBadge adaptiveSupport={adaptiveSupport} />
      </div>
      {adaptiveSupport?.supportStrategy && <p style={{ margin: '4px 0 0' }}>{adaptiveSupport.supportStrategy}</p>}
      <AdaptiveSuccessTarget adaptiveSupport={adaptiveSupport} />
    </aside>
  );
}
