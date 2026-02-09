import { Relic } from '../types/game';

export const relicDatabase: Record<string, Relic> = {
  burningBlood: {
    id: 'burningBlood',
    name: 'Burning Blood',
    description: 'At the end of combat, heal 6 HP.',
    rarity: 'common',
    effects: [{ trigger: 'combat_start', type: 'heal', value: 0 }]
  },
  bag_of_preparation: {
    id: 'bag_of_preparation',
    name: 'Bag of Preparation',
    description: 'At the start of each combat, draw 2 additional cards.',
    rarity: 'common',
    effects: [{ trigger: 'combat_start', type: 'draw', value: 2 }]
  },
  akabeko: {
    id: 'akabeko',
    name: 'Akabeko',
    description: 'Your first attack each combat deals 8 additional damage.',
    rarity: 'common',
    effects: [{ trigger: 'card_played', type: 'damage', value: 8 }]
  },
  anchor: {
    id: 'anchor',
    name: 'Anchor',
    description: 'Start each combat with 10 Block.',
    rarity: 'uncommon',
    effects: [{ trigger: 'combat_start', type: 'damage', value: 0 }]
  },
  lantern: {
    id: 'lantern',
    name: 'Lantern',
    description: 'Gain 1 additional energy at the start of your first 3 turns.',
    rarity: 'common',
    effects: [{ trigger: 'turn_start', type: 'energy', value: 1 }]
  },
  meal_ticket: {
    id: 'meal_ticket',
    name: 'Meal Ticket',
    description: 'Whenever you enter a shop, heal 15 HP.',
    rarity: 'uncommon',
    effects: [{ trigger: 'combat_start', type: 'heal', value: 0 }]
  },
  oddlySmoothStone: {
    id: 'oddlySmoothStone',
    name: 'Oddly Smooth Stone',
    description: 'Start each combat with 1 additional energy.',
    rarity: 'rare',
    effects: [{ trigger: 'combat_start', type: 'energy', value: 1 }]
  },
  preserved_insect: {
    id: 'preserved_insect',
    name: 'Preserved Insect',
    description: 'Elite enemies drop additional rewards.',
    rarity: 'uncommon',
    effects: [{ trigger: 'kill', type: 'gold', value: 25 }]
  },
  red_skull: {
    id: 'red_skull',
    name: 'Red Skull',
    description: 'Deal 3 additional damage with attacks when HP is below 50%.',
    rarity: 'rare',
    effects: [{ trigger: 'card_played', type: 'damage', value: 3 }]
  },
  vajra: {
    id: 'vajra',
    name: 'Vajra',
    description: 'Start each combat with 1 Strength.',
    rarity: 'common',
    effects: [{ trigger: 'combat_start', type: 'damage', value: 0 }]
  }
};

export function getRandomRelic(): Relic {
  const relics = Object.values(relicDatabase);
  const index = Math.floor(Math.random() * relics.length);
  return { ...relics[index] };
}

export function getRandomRelicByRarity(rarity: 'common' | 'uncommon' | 'rare'): Relic {
  const relics = Object.values(relicDatabase).filter(r => r.rarity === rarity);
  if (relics.length === 0) return getRandomRelic();
  const index = Math.floor(Math.random() * relics.length);
  return { ...relics[index] };
}