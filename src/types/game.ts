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
  /** Horizontal position in the game map image coordinate space. */
  x: number;
  /** Vertical position measured from the top of the game map image. */
  y: number;
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
  map: { image: string; width: number; height: number } | null;
}

export type ProgressByGame = Record<GameId, string[]>;
