import { Card } from '../types/game';

// Card database with all available cards
export const cardDatabase: Record<string, Card> = {
  strike: {
    id: 'strike',
    name: 'Strike',
    type: 'attack',
    cost: 1,
    damage: 6,
    description: 'Deal 6 damage.',
    rarity: 'common',
    upgraded: false,
    targets: 'single'
  },
  defend: {
    id: 'defend',
    name: 'Defend',
    type: 'defense',
    cost: 1,
    block: 5,
    description: 'Gain 5 Block.',
    rarity: 'common',
    upgraded: false
  },
  bash: {
    id: 'bash',
    name: 'Bash',
    type: 'attack',
    cost: 2,
    damage: 8,
    description: 'Deal 8 damage. Apply 2 Vulnerable.',
    rarity: 'common',
    upgraded: false,
    targets: 'single',
    effects: [{ type: 'vulnerable', value: 2, target: 'enemy' }]
  },
  powerStrike: {
    id: 'powerStrike',
    name: 'Power Strike',
    type: 'attack',
    cost: 2,
    damage: 12,
    description: 'Deal 12 damage.',
    rarity: 'common',
    upgraded: false,
    targets: 'single'
  },
  dualStrike: {
    id: 'dualStrike',
    name: 'Dual Strike',
    type: 'attack',
    cost: 1,
    damage: 4,
    description: 'Deal 4 damage twice.',
    rarity: 'common',
    upgraded: false,
    targets: 'single'
  },
  cleave: {
    id: 'cleave',
    name: 'Cleave',
    type: 'attack',
    cost: 1,
    damage: 5,
    description: 'Deal 5 damage to ALL enemies.',
    rarity: 'uncommon',
    upgraded: false,
    targets: 'all'
  },
  ironWall: {
    id: 'ironWall',
    name: 'Iron Wall',
    type: 'defense',
    cost: 2,
    block: 12,
    description: 'Gain 12 Block.',
    rarity: 'uncommon',
    upgraded: false
  },
  preparation: {
    id: 'preparation',
    name: 'Preparation',
    type: 'skill',
    cost: 0,
    draw: 2,
    description: 'Draw 2 cards.',
    rarity: 'common',
    upgraded: false
  },
  quickSlash: {
    id: 'quickSlash',
    name: 'Quick Slash',
    type: 'attack',
    cost: 0,
    damage: 4,
    description: 'Deal 4 damage.',
    rarity: 'uncommon',
    upgraded: false,
    targets: 'single'
  },
  heavyBlow: {
    id: 'heavyBlow',
    name: 'Heavy Blow',
    type: 'attack',
    cost: 3,
    damage: 18,
    description: 'Deal 18 damage.',
    rarity: 'rare',
    upgraded: false,
    targets: 'single'
  },
  shieldBash: {
    id: 'shieldBash',
    name: 'Shield Bash',
    type: 'attack',
    cost: 2,
    damage: 6,
    block: 6,
    description: 'Deal 6 damage. Gain 6 Block.',
    rarity: 'uncommon',
    upgraded: false,
    targets: 'single'
  },
  concentrate: {
    id: 'concentrate',
    name: 'Concentrate',
    type: 'skill',
    cost: 1,
    energy: 2,
    description: 'Gain 2 Energy. Discard 1 card.',
    rarity: 'uncommon',
    upgraded: false
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind',
    type: 'attack',
    cost: 2,
    damage: 3,
    description: 'Deal 3 damage to ALL enemies 3 times.',
    rarity: 'rare',
    upgraded: false,
    targets: 'all'
  },
  impervious: {
    id: 'impervious',
    name: 'Impervious',
    type: 'defense',
    cost: 3,
    block: 20,
    description: 'Gain 20 Block.',
    rarity: 'rare',
    upgraded: false,
    exhausts: true
  },
  fury: {
    id: 'fury',
    name: 'Fury',
    type: 'attack',
    cost: 1,
    damage: 3,
    description: 'Deal 3 damage 4 times.',
    rarity: 'uncommon',
    upgraded: false,
    targets: 'single'
  }
};

// Create an upgraded version of a card
export function upgradeCard(card: Card): Card {
  if (card.upgraded) return card;
  
  const upgraded = { ...card, upgraded: true, name: `${card.name}+` };
  
  // Upgrade effects
  if (upgraded.damage) upgraded.damage = Math.floor(upgraded.damage * 1.4);
  if (upgraded.block) upgraded.block = Math.floor(upgraded.block * 1.4);
  if (upgraded.draw) upgraded.draw += 1;
  if (upgraded.cost && upgraded.cost > 0) upgraded.cost = Math.max(0, upgraded.cost - 1);
  
  // Update description
  upgraded.description = upgraded.description.replace(/\d+/g, (match) => {
    const num = parseInt(match);
    return String(Math.floor(num * 1.4));
  });
  
  return upgraded;
}

// Get random cards of specified rarity
export function getRandomCards(count: number, rarity?: 'common' | 'uncommon' | 'rare'): Card[] {
  const allCards = Object.values(cardDatabase);
  const filteredCards = rarity 
    ? allCards.filter(c => c.rarity === rarity)
    : allCards;
  
  const selected: Card[] = [];
  const available = [...filteredCards];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push({ ...available[index] });
    available.splice(index, 1);
  }
  
  return selected;
}

// Starting deck for new game
export function getStarterDeck(): Card[] {
  return [
    { ...cardDatabase.strike },
    { ...cardDatabase.strike },
    { ...cardDatabase.strike },
    { ...cardDatabase.strike },
    { ...cardDatabase.strike },
    { ...cardDatabase.defend },
    { ...cardDatabase.defend },
    { ...cardDatabase.defend },
    { ...cardDatabase.defend },
    { ...cardDatabase.bash }
  ];
}