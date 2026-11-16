import type { GameDefinition } from '../types/game';

export const games: GameDefinition[] = [
  {
    id: 'botw',
    title: 'Breath of the Wild',
    subtitle: 'BOTW',
    status: 'available',
    description: 'Explore Hyrule, find every shrine and Korok, and track your journey.',
    map: { image: 'maps/botw-preview-map.svg', width: 1500, height: 1000 },
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
