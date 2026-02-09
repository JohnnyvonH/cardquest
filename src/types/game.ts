// Core game type definitions

export type CardType = 'attack' | 'defense' | 'skill';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type EnemyIntent = 'attack' | 'defend' | 'buff' | 'debuff';
export type NodeType = 'combat' | 'elite' | 'rest' | 'treasure' | 'boss' | 'event';
export type GameScreen = 'menu' | 'map' | 'combat' | 'victory' | 'defeat' | 'cardReward' | 'rest';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  damage?: number;
  block?: number;
  draw?: number;
  energy?: number;
  description: string;
  rarity: CardRarity;
  upgraded: boolean;
  exhausts?: boolean;
  targets?: 'single' | 'all';
  effects?: CardEffect[];
}

export interface CardEffect {
  type: 'damage' | 'block' | 'draw' | 'energy' | 'vulnerable' | 'weak' | 'strength';
  value: number;
  target: 'self' | 'enemy' | 'all_enemies';
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  block: number;
  intent: EnemyIntent;
  nextDamage?: number;
  nextBlock?: number;
  image?: string;
  isElite?: boolean;
  isBoss?: boolean;
  statuses: StatusEffect[];
}

export interface StatusEffect {
  type: 'vulnerable' | 'weak' | 'strength' | 'poison' | 'regeneration';
  stacks: number;
  duration: number;
}

export interface Player {
  maxHp: number;
  currentHp: number;
  block: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  deck: Card[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  relics: Relic[];
  statuses: StatusEffect[];
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  image?: string;
  effects: RelicEffect[];
}

export interface RelicEffect {
  trigger: 'combat_start' | 'turn_start' | 'turn_end' | 'card_played' | 'damage_taken' | 'kill';
  type: 'energy' | 'draw' | 'heal' | 'damage' | 'gold';
  value: number;
}

export interface MapNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  connections: string[];
  cleared: boolean;
  current: boolean;
}

export interface GameState {
  screen: GameScreen;
  floor: number;
  act: number;
  player: Player;
  enemies: Enemy[];
  currentNode: MapNode | null;
  map: MapNode[][];
  turn: number;
  combatRewards: CombatReward[];
}

export interface CombatReward {
  type: 'card' | 'gold' | 'relic' | 'potion';
  cards?: Card[];
  gold?: number;
  relic?: Relic;
}