import type { GameDefinition } from '../types/game';

export const games: GameDefinition[] = [
  {
    id: 'botw',
    title: 'Breath of the Wild',
    subtitle: 'BOTW',
    status: 'available',
    description: 'Explore Hyrule, find every shrine and Korok, and track your journey.',
    map: {
      image: 'maps/botw-preview-map.svg',
      width: 1280,
      height: 1000,
      // Bounds of the normalized coordinate reference used by the BOTW POI dataset.
      coordinateBounds: { minX: -1.05, maxX: -0.37, minY: 0.44, maxY: 0.97 },
    },
  },
  {
    id: 'totk',
    title: 'Tears of the Kingdom',
    subtitle: 'TOTK',
    status: 'planned',
    description: 'Planned: Surface, Sky Islands, Depths, caves, wells and more.',
    map: null,
  },
  {
    id: 'aoc',
    title: 'Age of Calamity',
    subtitle: 'AOC',
    status: 'planned',
    description: 'Planned: missions, challenges, characters, weapons and materials.',
    map: null,
  },
];
