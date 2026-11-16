import { BookOpen, ChevronRight, MapPin } from 'lucide-react';
import type { AtlasEntry } from '../types/game';
import { categoryById } from '../data/categories';

export function GuidesView({ entries, onOpenEntry }: { entries: AtlasEntry[]; onOpenEntry: (entry: AtlasEntry) => void }) {
  const guideEntries = entries.filter((entry) => entry.guide?.length);
  return (
    <section className="content-view guides-view">
      <div className="view-heading">
        <div><span className="eyebrow">FIELD LIBRARY / WALKTHROUGHS</span><h1>Guides</h1><p>Quick, practical notes for puzzles, places and challenges.</p></div>
      </div>
      <div className="guide-intro"><BookOpen size={20} /><div><strong>Built for quick reference</strong><p>Guides will include short steps, requirements, annotated screenshots and links to nearby map pins.</p></div></div>
      <div className="guide-card-grid">
        {guideEntries.map((entry) => {
          const category = categoryById[entry.category];
          return <button className="guide-card" key={entry.id} onClick={() => onOpenEntry(entry)}>
            <div className="guide-card-icon" style={{ color: category.colour, background: `${category.colour}18` }}>{category.marker}</div>
            <div className="guide-card-content"><span className="eyebrow">{category.label.toUpperCase()} / {entry.region.toUpperCase()}</span><strong>{entry.name}</strong><p>{entry.summary}</p><span className="guide-card-meta"><MapPin size={12} /> {entry.guide?.length ?? 0} guide steps</span></div>
            <ChevronRight size={17} className="guide-card-arrow" />
          </button>;
        })}
      </div>
      <div className="coming-soon-panel"><span className="eyebrow">UP NEXT</span><h2>Guides with screenshots</h2><p>The guide format is prepared for annotated images. We'll add these alongside verified shrine solutions, Korok puzzle types, quest walkthroughs and challenge requirements.</p></div>
    </section>
  );
}
