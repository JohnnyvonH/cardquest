import { Card, Player, Enemy, GameState } from '../types/game';
import { damageEnemy, addBlock, drawCards, discardCard } from './combat';

// Play a card and apply its effects
export function playCard(
  card: Card,
  player: Player,
  target: Enemy | null,
  gameState: GameState
): boolean {
  // Check if player has enough energy
  if (player.energy < card.cost) {
    return false;
  }
  
  // Deduct energy
  player.energy -= card.cost;
  
  // Apply card effects based on type
  switch (card.type) {
    case 'attack':
      applyAttackCard(card, player, target, gameState);
      break;
    case 'defense':
      applyDefenseCard(card, player);
      break;
    case 'skill':
      applySkillCard(card, player, gameState);
      break;
  }
  
  // Apply any additional effects
  if (card.effects) {
    card.effects.forEach(effect => {
      applyCardEffect(effect, player, target);
    });
  }
  
  // Discard the card
  discardCard(player, card);
  
  return true;
}

// Apply attack card effects
function applyAttackCard(
  card: Card,
  player: Player,
  target: Enemy | null,
  gameState: GameState
): void {
  if (!card.damage) return;
  
  let damage = card.damage;
  
  // Check for strength status
  const strength = player.statuses.find(s => s.type === 'strength');
  if (strength) {
    damage += strength.stacks;
  }
  
  // Check for relics that boost damage
  const akabeko = player.relics.find(r => r.id === 'akabeko');
  if (akabeko && gameState.turn === 1) {
    damage += 8;
  }
  
  const redSkull = player.relics.find(r => r.id === 'red_skull');
  if (redSkull && player.currentHp < player.maxHp / 2) {
    damage += 3;
  }
  
  // Apply to single target or all enemies
  if (card.targets === 'all') {
    gameState.enemies.forEach(enemy => {
      if (enemy.currentHp > 0) {
        damageEnemy(enemy, damage);
      }
    });
  } else if (target) {
    // Handle multi-hit cards
    if (card.id === 'dualStrike') {
      damageEnemy(target, damage);
      damageEnemy(target, damage);
    } else if (card.id === 'fury') {
      for (let i = 0; i < 4; i++) {
        damageEnemy(target, damage);
      }
    } else if (card.id === 'whirlwind') {
      gameState.enemies.forEach(enemy => {
        if (enemy.currentHp > 0) {
          for (let i = 0; i < 3; i++) {
            damageEnemy(enemy, damage);
          }
        }
      });
    } else {
      damageEnemy(target, damage);
    }
  }
}

// Apply defense card effects
function applyDefenseCard(card: Card, player: Player): void {
  if (card.block) {
    addBlock(player, card.block);
  }
}

// Apply skill card effects
function applySkillCard(card: Card, player: Player, gameState: GameState): void {
  // Draw cards
  if (card.draw) {
    drawCards(player, card.draw);
  }
  
  // Grant energy
  if (card.energy) {
    player.energy += card.energy;
    // Concentrate card requires discarding
    if (card.id === 'concentrate' && player.hand.length > 0) {
      const randomIndex = Math.floor(Math.random() * player.hand.length);
      const cardToDiscard = player.hand[randomIndex];
      discardCard(player, cardToDiscard);
    }
  }
}

// Apply individual card effect
function applyCardEffect(
  effect: any,
  player: Player,
  target: Enemy | null
): void {
  switch (effect.type) {
    case 'vulnerable':
      if (target) {
        addStatusEffect(target, 'vulnerable', effect.value, 2);
      }
      break;
    case 'weak':
      if (target) {
        addStatusEffect(target, 'weak', effect.value, 2);
      }
      break;
    case 'strength':
      if (effect.target === 'self') {
        addStatusEffect(player, 'strength', effect.value, 999);
      }
      break;
  }
}

// Add status effect to entity
function addStatusEffect(
  entity: Player | Enemy,
  type: 'vulnerable' | 'weak' | 'strength',
  stacks: number,
  duration: number
): void {
  const existing = entity.statuses.find(s => s.type === type);
  if (existing) {
    existing.stacks += stacks;
    existing.duration = Math.max(existing.duration, duration);
  } else {
    entity.statuses.push({ type, stacks, duration });
  }
}

// Check if card can be played
export function canPlayCard(card: Card, player: Player, needsTarget: boolean, hasTarget: boolean): boolean {
  if (player.energy < card.cost) return false;
  if (needsTarget && !hasTarget) return false;
  return true;
}

// Check if card needs a target
export function cardNeedsTarget(card: Card): boolean {
  return card.type === 'attack' && card.targets !== 'all';
}