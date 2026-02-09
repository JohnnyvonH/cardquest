import { MapNode, CombatReward, Card } from '../types/game';
import { getRandomCards } from '../data/cards';
import { getRandomRelic, getRandomRelicByRarity } from '../data/relics';

// Generate a floor map
export function generateFloorMap(floor: number): MapNode[][] {
  const rows = 15;
  const cols = 7;
  const map: MapNode[][] = [];
  
  // Create nodes
  for (let y = 0; y < rows; y++) {
    const row: MapNode[] = [];
    for (let x = 0; x < cols; x++) {
      const node: MapNode = {
        id: `${x}-${y}`,
        type: determineNodeType(y, rows, floor),
        x,
        y,
        connections: [],
        cleared: false,
        current: false
      };
      row.push(node);
    }
    map.push(row);
  }
  
  // Create paths through the map
  generatePaths(map, rows, cols);
  
  // Set starting node
  const startX = Math.floor(cols / 2);
  map[0][startX].current = true;
  
  return map;
}

// Determine node type based on position and floor
function determineNodeType(y: number, totalRows: number, floor: number): 'combat' | 'elite' | 'rest' | 'treasure' | 'boss' {
  // Boss at the end
  if (y === totalRows - 1) {
    return floor % 3 === 0 ? 'boss' : 'combat';
  }
  
  // Rest/shop in middle third
  if (y > totalRows * 0.4 && y < totalRows * 0.6) {
    const rand = Math.random();
    if (rand < 0.15) return 'rest';
    if (rand < 0.25) return 'treasure';
  }
  
  // Elite encounters
  if (y > totalRows * 0.3) {
    if (Math.random() < 0.12) return 'elite';
  }
  
  return 'combat';
}

// Generate paths between nodes
function generatePaths(map: MapNode[][], rows: number, cols: number): void {
  // Connect each row to the next
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols; x++) {
      const currentNode = map[y][x];
      
      // Connect to 1-3 nodes in next row
      const connections = Math.random() < 0.6 ? 2 : (Math.random() < 0.5 ? 1 : 3);
      const startX = Math.max(0, x - 1);
      const endX = Math.min(cols - 1, x + 1);
      
      for (let i = 0; i < connections; i++) {
        const targetX = Math.floor(Math.random() * (endX - startX + 1)) + startX;
        const targetId = `${targetX}-${y + 1}`;
        
        if (!currentNode.connections.includes(targetId)) {
          currentNode.connections.push(targetId);
        }
      }
    }
  }
}

// Generate combat rewards
export function generateCombatRewards(isElite: boolean, isBoss: boolean): CombatReward[] {
  const rewards: CombatReward[] = [];
  
  // Gold reward
  const goldAmount = isBoss ? 100 : isElite ? 50 : 20 + Math.floor(Math.random() * 20);
  rewards.push({ type: 'gold', gold: goldAmount });
  
  // Card reward
  const cardCount = isBoss ? 5 : 3;
  const cardRarity = isBoss ? undefined : (Math.random() < 0.2 ? 'uncommon' : 'common');
  rewards.push({
    type: 'card',
    cards: getRandomCards(cardCount, cardRarity as any)
  });
  
  // Relic reward for elite and boss
  if (isElite || isBoss) {
    const relicRarity = isBoss ? 'rare' : (Math.random() < 0.5 ? 'uncommon' : 'common');
    rewards.push({
      type: 'relic',
      relic: getRandomRelicByRarity(relicRarity as any)
    });
  }
  
  return rewards;
}

// Get available paths from current node
export function getAvailablePaths(map: MapNode[][], currentNode: MapNode): MapNode[] {
  const available: MapNode[] = [];
  
  currentNode.connections.forEach(connId => {
    const [x, y] = connId.split('-').map(Number);
    if (map[y] && map[y][x]) {
      available.push(map[y][x]);
    }
  });
  
  return available;
}

// Find current node in map
export function findCurrentNode(map: MapNode[][]): MapNode | null {
  for (const row of map) {
    for (const node of row) {
      if (node.current) return node;
    }
  }
  return null;
}

// Move to next node
export function moveToNode(map: MapNode[][], targetNode: MapNode): void {
  // Clear current node flag
  for (const row of map) {
    for (const node of row) {
      node.current = false;
    }
  }
  
  // Set new current node
  targetNode.current = true;
  targetNode.cleared = true;
}