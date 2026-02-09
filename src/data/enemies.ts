import { Enemy } from '../types/game';

// Enemy templates
export const enemyDatabase = {
  cultist: {
    id: 'cultist',
    name: 'Cultist',
    maxHp: 48,
    isElite: false,
    isBoss: false,
    attackPattern: [8, 0, 12]
  },
  jawWorm: {
    id: 'jawWorm',
    name: 'Jaw Worm',
    maxHp: 42,
    isElite: false,
    isBoss: false,
    attackPattern: [11, 5, 11]
  },
  fatGremlin: {
    id: 'fatGremlin',
    name: 'Fat Gremlin',
    maxHp: 36,
    isElite: false,
    isBoss: false,
    attackPattern: [4, 0, 4, 0, 4]
  },
  looter: {
    id: 'looter',
    name: 'Looter',
    maxHp: 44,
    isElite: false,
    isBoss: false,
    attackPattern: [10, 6, 14]
  },
  fungi: {
    id: 'fungi',
    name: 'Fungi Beast',
    maxHp: 52,
    isElite: false,
    isBoss: false,
    attackPattern: [6, 0, 6, 0]
  },
  // Elite enemies
  sentryElite: {
    id: 'sentryElite',
    name: 'Sentry',
    maxHp: 120,
    isElite: true,
    isBoss: false,
    attackPattern: [12, 0, 16, 20]
  },
  lagavulin: {
    id: 'lagavulin',
    name: 'Lagavulin',
    maxHp: 150,
    isElite: true,
    isBoss: false,
    attackPattern: [0, 0, 18, 18]
  },
  // Boss enemies
  slimeBoss: {
    id: 'slimeBoss',
    name: 'Slime Boss',
    maxHp: 280,
    isElite: false,
    isBoss: true,
    attackPattern: [15, 0, 20, 12, 25]
  },
  guardian: {
    id: 'guardian',
    name: 'The Guardian',
    maxHp: 320,
    isElite: false,
    isBoss: true,
    attackPattern: [22, 10, 28, 15, 32]
  },
  hexaghost: {
    id: 'hexaghost',
    name: 'Hexaghost',
    maxHp: 300,
    isElite: false,
    isBoss: true,
    attackPattern: [6, 0, 6, 0, 18, 25]
  }
};

// Generate enemy for combat
export function generateEnemy(floor: number, type: 'normal' | 'elite' | 'boss'): Enemy {
  let enemyList: string[];
  
  if (type === 'boss') {
    enemyList = ['slimeBoss', 'guardian', 'hexaghost'];
  } else if (type === 'elite') {
    enemyList = ['sentryElite', 'lagavulin'];
  } else {
    enemyList = ['cultist', 'jawWorm', 'fatGremlin', 'looter', 'fungi'];
  }
  
  const enemyKey = enemyList[Math.floor(Math.random() * enemyList.length)] as keyof typeof enemyDatabase;
  const template = enemyDatabase[enemyKey];
  
  // Scale HP with floor
  const hpMultiplier = 1 + (floor - 1) * 0.1;
  const maxHp = Math.floor(template.maxHp * hpMultiplier);
  
  return {
    id: `${template.id}_${Date.now()}`,
    name: template.name,
    maxHp,
    currentHp: maxHp,
    block: 0,
    intent: 'attack',
    isElite: template.isElite,
    isBoss: template.isBoss,
    statuses: []
  };
}

// Determine enemy action for next turn
export function determineEnemyIntent(enemy: Enemy, turn: number): void {
  const template = enemyDatabase[enemy.id.split('_')[0] as keyof typeof enemyDatabase];
  if (!template) return;
  
  const patternIndex = turn % template.attackPattern.length;
  const damage = template.attackPattern[patternIndex];
  
  if (damage === 0) {
    enemy.intent = 'defend';
    enemy.nextBlock = 8 + Math.floor(Math.random() * 5);
    enemy.nextDamage = undefined;
  } else {
    enemy.intent = 'attack';
    enemy.nextDamage = damage;
    enemy.nextBlock = undefined;
  }
}

// Generate multiple enemies for harder encounters
export function generateEnemyGroup(floor: number): Enemy[] {
  const groupSize = floor < 5 ? 1 : (Math.random() < 0.4 ? 2 : 1);
  const enemies: Enemy[] = [];
  
  for (let i = 0; i < groupSize; i++) {
    enemies.push(generateEnemy(floor, 'normal'));
  }
  
  return enemies;
}