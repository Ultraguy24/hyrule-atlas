import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronDown, Compass, Download, Gamepad2, Grid2X2, Layers, Map, MapPin, Search, Settings2, ShieldCheck, SlidersHorizontal, Upload, X } from 'lucide-react';
import entriesJson from './data/games/botw/entries.json';
import { games } from './data/games';
import { categories, categoryById } from './data/categories';
import { ChecklistView } from './components/ChecklistView';
import { EntryDetail } from './components/EntryDetail';
import { GuidesView } from './components/GuidesView';
import { MapView } from './components/MapView';
import { exportProgress, importProgress, loadProgress, saveProgress, setEntryComplete } from './lib/progress';
import type { AtlasEntry, CategoryId, GameId, ProgressByGame } from './types/game';
import './styles.css';

const gameEntries: Record<GameId, AtlasEntry[]> = {
  botw: entriesJson as unknown as AtlasEntry[],
  totk: [],
  aoc: [],
};
type ViewId = 'map' | 'checklist' | 'guides';

function App() {
  const [view, setView] = useState<ViewId>('map');
  const [activeGame, setActiveGame] = useState<GameId>('botw');
  const [progress, setProgress] = useState<ProgressByGame>(() => loadProgress());
  const [visibleCategories, setVisibleCategories] = useState<Set<CategoryId>>(() => new Set(['shrine', 'tower', 'stable', 'town', 'korok']));
  const [selectedEntry, setSelectedEntry] = useState<AtlasEntry | null>(null);
  const [search, setSearch] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLayersOpen, setMobileLayersOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [toast, setToast] = useState('');
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => saveProgress(progress), [progress]);

  const entries = useMemo(() => gameEntries[activeGame], [activeGame]);
  const visibleMapEntries = useMemo(() => entries.filter((entry) => !hideCompleted || !progress[activeGame].includes(entry.id)), [entries, hideCompleted, progress, activeGame]);
  const completed = useMemo(() => new Set(progress[activeGame]), [progress, activeGame]);
  const completedCount = entries.filter((entry) => completed.has(entry.id)).length;
  const progressPercent = entries.length ? Math.round((completedCount / entries.length) * 100) : 0;
  const searchMatches = search.trim() ? entries.filter((entry) => (!hideCompleted || !completed.has(entry.id)) && `${entry.name} ${entry.region} ${entry.category} ${entry.tags?.join(' ') ?? ''}`.toLowerCase().includes(search.toLowerCase())).slice(0, 7) : [];

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function toggleComplete(entry: AtlasEntry) {
    const wasComplete = progress[activeGame].includes(entry.id);
    setProgress((current) => setEntryComplete(current, activeGame, entry.id, !wasComplete));
    flash(wasComplete ? 'Removed from completed' : 'Added to completed');
  }

  function toggleCategory(id: CategoryId) {
    setVisibleCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleImport(file?: File) {
    if (!file) return;
    try {
      const imported = await importProgress(file);
      setProgress(imported);
      setShowSettings(false);
      flash('Progress backup imported');
    } catch (error) {
      flash(error instanceof Error ? error.message : 'Could not import that file');
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  }

  const currentGame = games.find((game) => game.id === activeGame)!;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setView('map'); setSelectedEntry(null); }}>
          <span className="brand-mark"><Compass size={22} strokeWidth={1.7} /></span>
          <span className="brand-copy"><strong>HYRULE <em>ATLAS</em></strong><small>YOUR ADVENTURE, YOUR WAY</small></span>
        </a>
        <div className="topbar-center"><span className="game-kicker">NOW EXPLORING</span><button className="game-switch" onClick={() => setMobileMenuOpen((open) => !open)}><Gamepad2 size={16} /> {currentGame.title}<ChevronDown size={14} /></button>
          {mobileMenuOpen && <div className="game-menu">{games.map((game) => <button key={game.id} disabled={game.status !== 'available'} onClick={() => { setActiveGame(game.id); setMobileMenuOpen(false); setSelectedEntry(null); }}><span><strong>{game.title}</strong><small>{game.status === 'available' ? 'Available now' : 'Planned'}</small></span>{game.status === 'available' ? <Check size={15} /> : <span className="planned-label">SOON</span>}</button>)}</div>}
        </div>
        <div className="topbar-actions"><div className="save-status"><span className="save-dot" /><span>Saved locally</span></div><button className="icon-button settings-button" onClick={() => setShowSettings(true)} aria-label="Open settings"><Settings2 size={18} /></button></div>
      </header>

      <main className={`workspace ${view !== 'map' ? 'workspace-content' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-nav">
            <span className="sidebar-label">JOURNAL</span>
            <button className={`nav-item ${view === 'map' ? 'active' : ''}`} onClick={() => { setView('map'); setSelectedEntry(null); }}><Map size={17} /><span>World map</span><span className="nav-shortcut">01</span></button>
            <button className={`nav-item ${view === 'checklist' ? 'active' : ''}`} onClick={() => { setView('checklist'); setSelectedEntry(null); }}><Grid2X2 size={17} /><span>Checklist</span><span className="nav-shortcut">02</span></button>
            <button className={`nav-item ${view === 'guides' ? 'active' : ''}`} onClick={() => { setView('guides'); setSelectedEntry(null); }}><BookOpen size={17} /><span>Field guides</span><span className="nav-shortcut">03</span></button>
          </div>
          <div className="sidebar-divider" />
          <div className="progress-card">
            <div className="progress-card-top"><span className="sidebar-label">ADVENTURE LOG</span><span className="progress-percent">{progressPercent}%</span></div>
            <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
            <div className="progress-caption"><strong>{completedCount} <span>/ {entries.length}</span></strong><small>locations completed</small></div>
          </div>
          {view === 'map' && <div className="map-filters">
            <div className="filter-title"><span className="sidebar-label">MAP LAYERS</span><button className="text-button" onClick={() => setVisibleCategories(new Set(categories.map((category) => category.id)))}>Show all</button></div>
            {(['Discover', 'Collect', 'Story'] as const).map((group) => <div className="filter-group" key={group}><span className="filter-group-title">{group}</span>{categories.filter((category) => category.group === group).map((category) => {
              const count = entries.filter((entry) => entry.category === category.id).length;
              const checked = visibleCategories.has(category.id);
              return <label className={`layer-row ${count === 0 ? 'muted' : ''}`} key={category.id}><input type="checkbox" checked={checked} onChange={() => toggleCategory(category.id)} /><span className="custom-checkbox"><Check size={11} /></span><span className="layer-marker" style={{ color: category.colour }}>{category.marker}</span><span className="layer-label">{category.plural}</span><span className="layer-count">{count}</span></label>;
            })}</div>)}
            <label className="hide-layer"><input type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} /> Hide completed pins</label>
          </div>}
          <div className="sidebar-bottom"><div className="privacy-note"><ShieldCheck size={15} /><span>No account. No tracking.<br />Your progress stays on this device.</span></div><span className="version-label">EARLY ACCESS / v0.2.0</span></div>
        </aside>

        {view === 'map' ? <section className="map-workspace">
          <div className="map-toolbar">
            <div className="map-title"><span className="eyebrow">BREATH OF THE WILD / HYRULE</span><h1>Explore the kingdom</h1></div>
            <div className="map-tools">
              <div className="map-search-wrap"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a place, shrine, Korok…" aria-label="Search map entries" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}
                {searchMatches.length > 0 && <div className="search-results">{searchMatches.map((entry) => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setSearch(''); setVisibleCategories((current) => new Set(current).add(entry.category)); }}><span className="search-result-marker" style={{ color: categoryById[entry.category].colour }}>{categoryById[entry.category].marker}</span><span><strong>{entry.name}</strong><small>{entry.region}</small></span><MapPin size={14} /></button>)}</div>}
              </div>
              <button className="map-tool-button" onClick={() => setResetKey((key) => key + 1)}><Compass size={15} /><span>Reset map</span></button>
            </div>
          </div>
          <div className="map-stage">
            <MapView entries={visibleMapEntries} visibleCategories={visibleCategories} completed={completed} selectedId={selectedEntry?.id ?? null} onSelect={setSelectedEntry} resetKey={resetKey} mapImage={currentGame.map!.image} mapWidth={currentGame.map!.width} mapHeight={currentGame.map!.height} coordinateBounds={currentGame.map!.coordinateBounds} />
            <div className="map-overlay-top"><span className="map-coordinate-label">BOTW SURFACE REFERENCE <i /> SCHEMATIC</span><span className="map-scale">NOT TO SCALE</span></div>
            <div className="mobile-layer-tools">
              <button className="mobile-layer-button" onClick={() => setMobileLayersOpen((open) => !open)}><Layers size={15} /> Map layers <SlidersHorizontal size={13} /></button>
              {mobileLayersOpen && <div className="mobile-layer-panel">
                <div className="mobile-layer-panel-head"><strong>Visible map layers</strong><button className="icon-button" onClick={() => setMobileLayersOpen(false)} aria-label="Close map layers"><X size={16} /></button></div>
                {categories.map((category) => <label className="mobile-layer-row" key={category.id}><input type="checkbox" checked={visibleCategories.has(category.id)} onChange={() => toggleCategory(category.id)} /><span className="mobile-layer-symbol" style={{ color: category.colour }}>{category.marker}</span><span>{category.plural}</span><small>{entries.filter((entry) => entry.category === category.id).length}</small></label>)}
                <label className="mobile-layer-hide"><input type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} /> Hide completed pins</label>
                <button className="mobile-layer-showall" onClick={() => setVisibleCategories(new Set(categories.map((category) => category.id)))}>Show every category</button>
              </div>}
            </div>
            <div className="map-overlay-bottom"><div className="map-legend"><span><i className="legend-dot" /> Unfinished</span><span><i className="legend-dot done" /> Completed</span></div><span className="map-count">{entries.filter((entry) => entry.coordinates && visibleCategories.has(entry.category) && (!hideCompleted || !completed.has(entry.id))).length} MARKERS SHOWN</span></div>
            <div className="map-disclaimer">Original schematic basemap, not in-game terrain. Pins use normalized community map coordinates; placement is subject to refinement.</div>
            {selectedEntry && <EntryDetail entry={selectedEntry} complete={completed.has(selectedEntry.id)} onClose={() => setSelectedEntry(null)} onToggleComplete={() => toggleComplete(selectedEntry)} />}
          </div>
        </section> : view === 'checklist' ? <ChecklistView entries={entries} completed={completed} onToggleComplete={toggleComplete} onOpenEntry={setSelectedEntry} /> : <GuidesView entries={entries} onOpenEntry={setSelectedEntry} />}
        {view !== 'map' && selectedEntry && <EntryDetail entry={selectedEntry} complete={completed.has(selectedEntry.id)} onClose={() => setSelectedEntry(null)} onToggleComplete={() => toggleComplete(selectedEntry)} />}
      </main>

      {showSettings && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSettings(false); }}><section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="settings-heading"><div><span className="eyebrow">PREFERENCES / DATA</span><h2 id="settings-title">Your atlas</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Close settings"><X size={18} /></button></div><p className="settings-intro">Your progress is stored in this browser. It is never uploaded to an account or server.</p><div className="settings-option"><div className="settings-option-icon"><Download size={18} /></div><div><strong>Export progress</strong><p>Download a JSON backup you can keep or move to another device.</p></div><button className="secondary-button" onClick={() => exportProgress(progress)}>Export</button></div><div className="settings-option"><div className="settings-option-icon"><Upload size={18} /></div><div><strong>Import progress</strong><p>Restore a previous Hyrule Atlas JSON backup.</p></div><button className="secondary-button" onClick={() => importRef.current?.click()}>Import</button><input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => void handleImport(event.target.files?.[0])} /></div><div className="settings-divider" /><div className="settings-meta"><span>Hyrule Atlas</span><span>Version 0.2.0 · BOTW location dataset</span></div></section></div>}
      {toast && <div className="toast" role="status"><Check size={15} />{toast}</div>}
      <footer className="mobile-footer"><button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Map size={18} /><span>Map</span></button><button className={view === 'checklist' ? 'active' : ''} onClick={() => setView('checklist')}><Grid2X2 size={18} /><span>Checklist</span></button><button className={view === 'guides' ? 'active' : ''} onClick={() => setView('guides')}><BookOpen size={18} /><span>Guides</span></button><button onClick={() => setShowSettings(true)}><Settings2 size={18} /><span>Settings</span></button></footer>
    </div>
  );
}

export default App;
