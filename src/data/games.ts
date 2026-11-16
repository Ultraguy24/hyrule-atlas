import type { GameDefinition } from '../types/game';

export const games: GameDefinition[] = [
  {
    id: 'botw',
    title: 'Breath of the Wild',
    subtitle: 'BOTW',
    status: 'available',
    description: 'Explore Hyrule, find every shrine and Korok, and track your journey.',
    map: {
      image: 'maps/botw-map.png',
      width: 2048,
      height: 1706,
      projection: {
        referenceWidth: 6000,
        referenceHeight: 5000,
        originX: 3000,
        originY: 2500,
        pixelsPerWorldUnit: 0.5,
      },
      attribution: {
        label: "MrCheeze's BOTW Waypoint Map",
        url: 'https://github.com/MrCheeze/botw-waypoint-map',
        note: 'Map image reproduced with express permission from MrCheeze.',
      },
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
