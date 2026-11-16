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

/** BOTW game-world coordinates. X increases east; Y increases south. */
export interface MapCoordinates {
  x: number;
  y: number;
}

/** Original-image coordinate transform used by a game's map artwork. */
export interface MapProjection {
  referenceWidth: number;
  referenceHeight: number;
  originX: number;
  originY: number;
  pixelsPerWorldUnit: number;
}

export interface GuideStep {
  title: string;
  description: string;
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
  sourceCoordinates?: MapCoordinates;
  summary: string;
  tags?: string[];
  guide?: GuideStep[];
  sample?: boolean;
}

export interface GameDefinition {
  id: GameId;
  title: string;
  subtitle: string;
  status: 'available' | 'planned';
  description: string;
  map: {
    image: string;
    width: number;
    height: number;
    projection: MapProjection;
    attribution: {
      label: string;
      url: string;
      note: string;
    };
  } | null;
}

export type ProgressByGame = Record<GameId, string[]>;
