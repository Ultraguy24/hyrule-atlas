export type GameId = 'botw' | 'totk' | 'aoc';

export type CategoryId =
  | 'shrine'
  | 'korok'
  | 'tower'
  | 'stable'
  | 'town'
  | 'memory'
  | 'quest'
  | 'divine-beast';

export interface MapCoordinates {
  /** Normalized horizontal position from the community map reference. */
  x: number;
  /** Normalized vertical position from the community map reference (north is larger). */
  y: number;
}

export interface MapCoordinateBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface GuideStep {
  title: string;
  description: string;
  /** Optional project-hosted screenshot, relative to the public directory. */
  image?: string;
  imageAlt?: string;
}

export interface AtlasEntry {
  id: string;
  game: GameId;
  category: CategoryId;
  name: string;
  region: string;
  coordinates?: MapCoordinates;
  summary: string;
  /** Optional classification tags such as DLC or Champions’ Ballad. */
  tags?: string[];
  guide?: GuideStep[];
  /** True for illustrative starter entries whose locations are not verified. */
  sample?: boolean;
}

export interface GameDefinition {
  id: GameId;
  title: string;
  subtitle: string;
  status: 'available' | 'planned';
  description: string;
  map: { image: string; width: number; height: number; coordinateBounds: MapCoordinateBounds } | null;
}

export type ProgressByGame = Record<GameId, string[]>;
