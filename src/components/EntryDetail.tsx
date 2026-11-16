import { Check, ChevronRight, MapPin, X } from 'lucide-react';
import type { AtlasEntry } from '../types/game';
import { categoryById } from '../data/categories';

interface EntryDetailProps {
  entry: AtlasEntry;
  complete: boolean;
  onClose: () => void;
  onToggleComplete: () => void;
}

export function EntryDetail({ entry, complete, onClose, onToggleComplete }: EntryDetailProps) {
  const category = categoryById[entry.category];
  return (
    <aside className="detail-panel" aria-label={`${entry.name} details`}>
      <div className="detail-topline">
        <span className="eyebrow">FIELD NOTES / {category.label.toUpperCase()}</span>
        <button className="icon-button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
      </div>
      <div className="detail-title-row">
        <span className="detail-symbol" style={{ color: category.colour, borderColor: `${category.colour}66`, background: `${category.colour}15` }}>{category.marker}</span>
        <div>
          <h2>{entry.name}</h2>
          <p className="detail-region"><MapPin size={13} /> {entry.region}</p>
        </div>
      </div>
      {entry.sample && <div className="sample-note">Preview record · location and details are illustrative</div>}
      <p className="detail-summary">{entry.summary}</p>
      <button className={`complete-button ${complete ? 'done' : ''}`} onClick={onToggleComplete}>
        {complete ? <Check size={16} /> : <span className="empty-check" />}
        {complete ? 'Marked as found' : 'Mark as complete'}
      </button>
      <div className="detail-divider" />
      <div className="guide-heading">
        <div>
          <span className="eyebrow">FIELD GUIDE</span>
          <h3>How to complete it</h3>
        </div>
        <span className="step-count">{entry.guide?.length ?? 0} STEPS</span>
      </div>
      {entry.guide?.length ? (
        <ol className="guide-steps">
          {entry.guide.map((step, index) => (
            <li key={`${entry.id}-step-${index}`}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div><strong>{step.title}</strong><p>{step.description}</p>{step.image && <img className="guide-step-image" src={`${import.meta.env.BASE_URL}${step.image}`} alt={step.imageAlt ?? `Screenshot for ${step.title}`} loading="lazy" />}</div>
              <ChevronRight size={15} className="step-chevron" />
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-guide">A guide for this entry hasn't been written yet.</p>
      )}
      <div className="detail-footnote">Guides will support annotated screenshots, item requirements and related locations.</div>
    </aside>
  );
}
