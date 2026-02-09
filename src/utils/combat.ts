import { Player, Enemy, Card, GameState } from '../types/game';
import { determineEnemyIntent } from '../data/enemies';

// Deal damage to an enemy, accounting for block
export function damageEnemy(enemy: Enemy, amount: number): void {
  const actualDamage = Math.max(0, amount - enemy.block);
  enemy.block = Math.max(0, enemy.block - amount);
  enemy.currentHp = Math.max(0, enemy.currentHp - actualDamage);
}

// Deal damage to player, accounting for block
export function damagePlayer(player: Player, amount: number): void {
  const vulnerable = player.statuses.find(s => s.type === 'vulnerable');
  let actualAmount = amount;
  
  if (vulnerable) {
    actualAmount = Math.floor(amount * 1.5);
  }
  
  const actualDamage = Math.max(0, actualAmount - player.block);
  player.block = Math.max(0, player.block - actualAmount);
  player.currentHp = Math.max(0, player.currentHp - actualDamage);
}

// Add block to player
export function addBlock(player: Player, amount: number): void {
  player.block += amount;
}

// Draw cards from draw pile to hand
export function drawCards(player: Player, count: number): void {
  for (let i = 0; i < count; i++) {
    if (player.drawPile.length === 0) {
      shuffleDiscardIntoDraw(player);
    }
    
    if (player.drawPile.length > 0) {
      const card = player.drawPile.pop()!;
      player.hand.push(card);
    }
  }
}

// Shuffle discard pile into draw pile
export function shuffleDiscardIntoDraw(player: Player): void {
  player.drawPile = [...player.discardPile];
  player.discardPile = [];
  shuffleArray(player.drawPile);
}

// Shuffle an array in place
export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Discard a card from hand
export function discardCard(player: Player, card: Card): void {
  const index = player.hand.findIndex(c => c === card);
  if (index !== -1) {
    player.hand.splice(index, 1);
    if (card.exhausts) {
      player.exhaustPile.push(card);
    } else {
      player.discardPile.push(card);
    }
  }
}

// Start a new turn
export function startTurn(player: Player): void {
  // Reset energy
  player.energy = player.maxEnergy;
  
  // Reset block
  player.block = 0;
  
  // Draw cards
  const cardsToDraw = 5;
  drawCards(player, cardsToDraw);
  
  // Update status effects
  updateStatusDurations(player.statuses);
}

// End player turn and execute enemy actions
export function endTurn(gameState: GameState): void {
  const { player, enemies } = gameState;
  
  // Discard hand
  player.discardPile.push(...player.hand);
  player.hand = [];
  
  // Execute enemy actions
  enemies.forEach(enemy => {
    if (enemy.currentHp > 0) {
      executeEnemyAction(player, enemy);
      // Determine next action
      gameState.turn++;
      determineEnemyIntent(enemy, gameState.turn);
    }
  });
  
  // Update enemy status effects
  enemies.forEach(enemy => updateStatusDurations(enemy.statuses));
  
  // Start new turn
  startTurn(player);
}

// Execute enemy's intended action
export function executeEnemyAction(player: Player, enemy: Enemy): void {
  switch (enemy.intent) {
    case 'attack':
      if (enemy.nextDamage) {
        damagePlayer(player, enemy.nextDamage);
      }
      break;
    case 'defend':
      if (enemy.nextBlock) {
        enemy.block += enemy.nextBlock;
      }
      break;
  }
  
  // Reset enemy block at start of their turn
  enemy.block = 0;
}

// Update status effect durations
export function updateStatusDurations(statuses: any[]): void {
  for (let i = statuses.length - 1; i >= 0; i--) {
    statuses[i].duration--;
    if (statuses[i].duration <= 0) {
      statuses.splice(i, 1);
    }
  }
}

// Check if combat is over
export function isCombatOver(gameState: GameState): 'victory' | 'defeat' | 'ongoing' {
  if (gameState.player.currentHp <= 0) {
    return 'defeat';
  }
  
  const aliveEnemies = gameState.enemies.filter(e => e.currentHp > 0);
  if (aliveEnemies.length === 0) {
    return 'victory';
  }
  
  return 'ongoing';
}

// Initialize combat
export function initializeCombat(player: Player): void {
  // Reset piles
  player.drawPile = [...player.deck];
  player.hand = [];
  player.discardPile = [];
  player.exhaustPile = [];
  player.block = 0;
  
  // Shuffle draw pile
  shuffleArray(player.drawPile);
  
  // Apply relic effects
  let startingEnergy = player.maxEnergy;
  let startingDraw = 5;
  let startingBlock = 0;
  
  player.relics.forEach(relic => {
    relic.effects.forEach(effect => {
      if (effect.trigger === 'combat_start') {
        if (effect.type === 'energy') startingEnergy += effect.value;
        if (effect.type === 'draw') startingDraw += effect.value;
      }
    });
  });
  
  // Check for Anchor relic
  if (player.relics.some(r => r.id === 'anchor')) {
    startingBlock = 10;
  }
  
  player.energy = startingEnergy;
  player.block = startingBlock;
  
  // Draw starting hand
  drawCards(player, startingDraw);
}

// Calculate total deck damage potential
export function calculateDeckPower(deck: Card[]): number {
  return deck.reduce((total, card) => {
    if (card.damage) total += card.damage;
    return total;
  }, 0);
}