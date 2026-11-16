import { Check, ChevronRight, Circle, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AtlasEntry, CategoryId } from '../types/game';
import { categories } from '../data/categories';

interface ChecklistViewProps {
  entries: AtlasEntry[];
  completed: Set<string>;
  onToggleComplete: (entry: AtlasEntry) => void;
  onOpenEntry: (entry: AtlasEntry) => void;
}

export function ChecklistView({ entries, completed, onToggleComplete, onOpenEntry }: ChecklistViewProps) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [hideComplete, setHideComplete] = useState(false);
  const filtered = useMemo(() => entries.filter((entry) => {
    const matchesQuery = `${entry.name} ${entry.region} ${entry.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    const matchesComplete = !hideComplete || !completed.has(entry.id);
    return matchesQuery && matchesCategory && matchesComplete;
  }), [entries, query, categoryFilter, hideComplete, completed]);

  const grouped = categories.map((category) => ({
    category,
    items: filtered.filter((entry) => entry.category === category.id),
    total: entries.filter((entry) => entry.category === category.id).length,
    done: entries.filter((entry) => entry.category === category.id && completed.has(entry.id)).length,
  })).filter((group) => group.items.length > 0 || (categoryFilter === 'all' && !query && group.total > 0));

  return (
    <section className="content-view checklist-view">
      <div className="view-heading">
        <div><span className="eyebrow">YOUR ADVENTURE / TRACKER</span><h1>Checklist</h1><p>Keep track of what you've discovered across Hyrule.</p></div>
      </div>
      <div className="checklist-toolbar">
        <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries or regions…" /></label>
        <label className="filter-select"><SlidersHorizontal size={15} /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as CategoryId | 'all')}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.plural}</option>)}</select></label>
        <label className="hide-complete"><input type="checkbox" checked={hideComplete} onChange={(event) => setHideComplete(event.target.checked)} /> Hide completed</label>
      </div>
      {filtered.length === 0 ? <div className="empty-state"><Search size={24} /><strong>No matching entries</strong><span>Try another search or category.</span></div> : (
        <div className="checklist-groups">
          {grouped.map(({ category, items, total, done }) => (
            <section className="checklist-group" key={category.id}>
              <div className="group-heading">
                <span className="category-dot" style={{ background: category.colour }} />
                <h2>{category.plural}</h2>
                <span className="group-progress">{done}/{total}</span>
                <div className="mini-progress"><span style={{ width: `${total ? (done / total) * 100 : 0}%`, background: category.colour }} /></div>
              </div>
              {items.length === 0 ? <p className="no-items">All entries in this category are complete.</p> : items.map((entry) => {
                const isDone = completed.has(entry.id);
                return (
                  <div className={`checklist-entry ${isDone ? 'is-done' : ''}`} key={entry.id}>
                    <button className="check-toggle" onClick={() => onToggleComplete(entry)} aria-label={isDone ? `Mark ${entry.name} incomplete` : `Mark ${entry.name} complete`}>{isDone ? <Check size={15} /> : <Circle size={16} />}</button>
                    <button className="entry-main" onClick={() => onOpenEntry(entry)}><strong>{entry.name}</strong><span>{entry.region}{entry.sample ? ' · sample' : ''}</span></button>
                    <button className="entry-open" onClick={() => onOpenEntry(entry)} aria-label={`Open ${entry.name}`}><ChevronRight size={17} /></button>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      )}
      <div className="view-footnote">Progress is saved only in this browser. Use Settings to export or import a backup.</div>
    </section>
  );
}
