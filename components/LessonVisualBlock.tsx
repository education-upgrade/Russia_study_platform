import styles from './LessonVisualBlock.module.css';

export type LessonVisual =
  | {
      type: 'image';
      title?: string;
      label?: string;
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: 'comparison';
      title?: string;
      leftTitle: string;
      rightTitle: string;
      rows: { left: string; right: string }[];
    }
  | {
      type: 'flow';
      title?: string;
      steps: string[];
    }
  | {
      type: 'timeline';
      title?: string;
      events: { date: string; label: string }[];
    }
  | {
      type: 'hierarchy';
      title?: string;
      levels: { label: string; note?: string }[];
    }
  | {
      type: 'conceptMap';
      title?: string;
      centre: string;
      branches: { label: string; note?: string }[];
    }
  | {
      type: 'mapNote';
      title?: string;
      regions: { label: string; note?: string }[];
      caption?: string;
    }
  | {
      type: 'statBlock';
      title?: string;
      stats: { value: string; label: string; note?: string }[];
      takeaway?: string;
    }
  | {
      type: 'judgementScale';
      title?: string;
      leftLabel: string;
      rightLabel: string;
      markerLabel?: string;
      markerPosition?: number;
      prompt?: string;
    };

function VisualHeader({ title, label }: { title?: string; label: string }) {
  return (
    <div className={styles.visualHeader}>
      <span>{label}</span>
      {title && <strong>{title}</strong>}
    </div>
  );
}

export default function LessonVisualBlock({ visual }: { visual?: LessonVisual }) {
  if (!visual) return null;

  if (visual.type === 'image') {
    return (
      <aside className={`${styles.visualCard} ${styles.imageVisualCard}`}>
        <VisualHeader title={visual.title} label={visual.label ?? 'Visual'} />
        <div className={styles.imageFrame}>
          <img src={visual.src} alt={visual.alt} />
        </div>
        {visual.caption && <p className={styles.caption}>{visual.caption}</p>}
      </aside>
    );
  }

  if (visual.type === 'comparison') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Compare" />
        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonHeading}>{visual.leftTitle}</div>
          <div className={styles.comparisonHeading}>{visual.rightTitle}</div>
          {visual.rows.map((row, index) => (
            <div className={styles.comparisonRow} key={`${row.left}-${index}`}>
              <div>{row.left}</div>
              <div>{row.right}</div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (visual.type === 'flow') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Flow" />
        <div className={styles.flowList}>
          {visual.steps.map((step, index) => (
            <div className={styles.flowStep} key={`${step}-${index}`}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (visual.type === 'timeline') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Timeline" />
        <div className={styles.timeline}>
          {visual.events.map((event, index) => (
            <div className={styles.timelineEvent} key={`${event.date}-${index}`}>
              <span>{event.date}</span>
              <strong>{event.label}</strong>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (visual.type === 'hierarchy') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Hierarchy" />
        <div className={styles.hierarchy}>
          {visual.levels.map((level, index) => (
            <div className={styles.hierarchyLevel} key={`${level.label}-${index}`}>
              <strong>{level.label}</strong>
              {level.note && <span>{level.note}</span>}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (visual.type === 'conceptMap') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Concept map" />
        <div className={styles.conceptMap}>
          <div className={styles.conceptCentre}>{visual.centre}</div>
          <div className={styles.conceptBranches}>
            {visual.branches.map((branch, index) => (
              <div className={styles.conceptBranch} key={`${branch.label}-${index}`}>
                <strong>{branch.label}</strong>
                {branch.note && <span>{branch.note}</span>}
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (visual.type === 'mapNote') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Map note" />
        <div className={styles.mapNote}>
          {visual.regions.map((region, index) => (
            <div className={styles.mapRegion} key={`${region.label}-${index}`}>
              <strong>{region.label}</strong>
              {region.note && <span>{region.note}</span>}
            </div>
          ))}
        </div>
        {visual.caption && <p className={styles.caption}>{visual.caption}</p>}
      </aside>
    );
  }

  if (visual.type === 'statBlock') {
    return (
      <aside className={styles.visualCard}>
        <VisualHeader title={visual.title} label="Evidence" />
        <div className={styles.statGrid}>
          {visual.stats.map((stat, index) => (
            <div className={styles.statItem} key={`${stat.value}-${index}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              {stat.note && <small>{stat.note}</small>}
            </div>
          ))}
        </div>
        {visual.takeaway && <p className={styles.takeaway}>{visual.takeaway}</p>}
      </aside>
    );
  }

  return (
    <aside className={styles.visualCard}>
      <VisualHeader title={visual.title} label="Judgement" />
      <div className={styles.scaleLabels}>
        <span>{visual.leftLabel}</span>
        <span>{visual.rightLabel}</span>
      </div>
      <div className={styles.scaleTrack}>
        <div className={styles.scaleMarker} style={{ left: `${visual.markerPosition ?? 50}%` }}>
          {visual.markerLabel ?? 'Judgement'}
        </div>
      </div>
      {visual.prompt && <p className={styles.takeaway}>{visual.prompt}</p>}
    </aside>
  );
}
