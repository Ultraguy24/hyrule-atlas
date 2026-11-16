import type { CategoryId } from '../types/game';

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  plural: string;
  colour: string;
  marker: string;
  group: 'Discover' | 'Collect' | 'Story';
}

export const categories: CategoryDefinition[] = [
  { id: 'shrine', label: 'Shrine', plural: 'Shrines', colour: '#78c9bd', marker: '✧', group: 'Discover' },
  { id: 'tower', label: 'Tower', plural: 'Sheikah Towers', colour: '#83a7e8', marker: '▴', group: 'Discover' },
  { id: 'stable', label: 'Stable', plural: 'Stables', colour: '#d6ac70', marker: '⌂', group: 'Discover' },
  { id: 'town', label: 'Town', plural: 'Towns & villages', colour: '#e1c77f', marker: '⌂', group: 'Discover' },
  { id: 'korok', label: 'Korok', plural: 'Korok Seeds', colour: '#9fc77e', marker: '❀', group: 'Collect' },
  { id: 'memory', label: 'Memory', plural: 'Memories', colour: '#c19ae5', marker: '◉', group: 'Story' },
  { id: 'quest', label: 'Quest', plural: 'Quests', colour: '#e49a83', marker: '!', group: 'Story' },
  { id: 'divine-beast', label: 'Divine Beast', plural: 'Divine Beasts', colour: '#82b5d9', marker: '◇', group: 'Story' },
];

export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category])) as Record<CategoryId, CategoryDefinition>;
