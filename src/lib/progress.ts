import type { GameId, ProgressByGame } from '../types/game';

const STORAGE_KEY = 'hyrule-atlas:progress:v1';

const emptyProgress = (): ProgressByGame => ({ botw: [], totk: [], aoc: [] });

export function loadProgress(): ProgressByGame {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressByGame>;
    return {
      botw: Array.isArray(parsed.botw) ? parsed.botw : [],
      totk: Array.isArray(parsed.totk) ? parsed.totk : [],
      aoc: Array.isArray(parsed.aoc) ? parsed.aoc : [],
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: ProgressByGame): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Could not save Hyrule Atlas progress.', error);
  }
}

export function setEntryComplete(progress: ProgressByGame, game: GameId, entryId: string, complete: boolean): ProgressByGame {
  const current = new Set(progress[game]);
  if (complete) current.add(entryId);
  else current.delete(entryId);
  return { ...progress, [game]: [...current] };
}

export function exportProgress(progress: ProgressByGame): void {
  const file = new Blob([JSON.stringify({ format: 'hyrule-atlas-progress', version: 1, exportedAt: new Date().toISOString(), progress }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'hyrule-atlas-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file: File): Promise<ProgressByGame> {
  const parsed: unknown = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object' || !('progress' in parsed)) {
    throw new Error('That file does not look like a Hyrule Atlas progress backup.');
  }
  const candidate = (parsed as { progress: Partial<ProgressByGame> }).progress;
  const clean = emptyProgress();
  for (const game of ['botw', 'totk', 'aoc'] as const) {
    const items = candidate?.[game];
    if (Array.isArray(items) && items.every((value) => typeof value === 'string')) clean[game] = [...new Set(items)];
  }
  return clean;
}
