import { useState, useEffect } from 'react';
import { GameState, Enemy as EnemyType, Card as CardType } from '../types/game';
import { playCard, cardNeedsTarget } from '../utils/cardEffects';
import { endTurn, isCombatOver } from '../utils/combat';
import Card from './Card';
import Enemy from './Enemy';
import { Heart, Shield, Zap } from 'lucide-react';

interface CombatProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const Combat = ({ gameState, setGameState }: CombatProps) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyType | null>(null);
  const [attackAnimation, setAttackAnimation] = useState<{ x: number; y: number } | null>(null);
  const [blockAnimation, setBlockAnimation] = useState(false);
  const { player, enemies } = gameState;

  // Check for combat end after any state change
  useEffect(() => {
    const result = isCombatOver(gameState);
    if (result === 'victory') {
      // Small delay to let the player see the killing blow
      setTimeout(() => {
        setGameState(prev => ({ ...prev, screen: 'victory' }));
      }, 500);
    } else if (result === 'defeat') {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, screen: 'defeat' }));
      }, 500);
    }
  }, [enemies, player.currentHp, gameState, setGameState]);

  const triggerAttackAnimation = (targetX: number, targetY: number) => {
    setAttackAnimation({ x: targetX, y: targetY });
    setTimeout(() => setAttackAnimation(null), 500);
  };

  const triggerBlockAnimation = () => {
    setBlockAnimation(true);
    setTimeout(() => setBlockAnimation(false), 400);
  };

  const handleCardClick = (card: CardType) => {
    // Check if player has enough energy
    if (player.energy < card.cost) {
      return;
    }

    // If card needs a target, select it and wait for enemy click
    if (cardNeedsTarget(card)) {
      setSelectedCard(card);
      // Auto-select first alive enemy if only one exists
      const aliveEnemies = enemies.filter(e => e.currentHp > 0);
      if (aliveEnemies.length === 1) {
        const enemyElement = document.querySelector(`[data-enemy-id="${aliveEnemies[0].id}"]`);
        if (enemyElement) {
          const rect = enemyElement.getBoundingClientRect();
          triggerAttackAnimation(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        const success = playCard(card, player, aliveEnemies[0], gameState);
        if (success) {
          setSelectedCard(null);
          // Force re-render with new state reference
          setGameState({ ...gameState, enemies: [...gameState.enemies] });
        }
      }
    } else {
      // Play card without target (AOE or non-attack cards)
      if (card.type === 'defense') {
        triggerBlockAnimation();
      }
      const success = playCard(card, player, null, gameState);
      if (success) {
        // Force re-render with new state reference
        setGameState({ ...gameState, enemies: [...gameState.enemies] });
      }
    }
  };

  const handleEnemyClick = (enemy: EnemyType, event: React.MouseEvent) => {
    if (enemy.currentHp <= 0) return;

    if (selectedCard) {
      // Trigger attack animation at enemy position
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      triggerAttackAnimation(rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Play the selected card on this enemy
      const success = playCard(selectedCard, player, enemy, gameState);
      if (success) {
        setSelectedCard(null);
        setSelectedEnemy(null);
        // Force re-render with new state reference
        setGameState({ ...gameState, enemies: [...gameState.enemies] });
      }
    } else {
      // Just highlight the enemy
      setSelectedEnemy(enemy);
    }
  };

  const handleEndTurn = () => {
    endTurn(gameState);
    setSelectedCard(null);
    setSelectedEnemy(null);
    // Force re-render with new state reference
    setGameState({ ...gameState, enemies: [...gameState.enemies] });
  };

  const isCardPlayable = (card: CardType) => {
    return player.energy >= card.cost;
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Attack Animation Overlay */}
      {attackAnimation && (
        <div className="impact-overlay">
          <div
            className="slash-effect"
            style={{
              left: attackAnimation.x - 50,
              top: attackAnimation.y - 50,
            }}
          />
        </div>
      )}

      {/* Block Animation Overlay */}
      {blockAnimation && (
        <div className="impact-overlay">
          <div
            className="shield-effect animate-shield-pop"
            style={{
              left: '50%',
              top: '20%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}

      {/* Top Bar - Player Stats */}
      <div className="glass-effect rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* HP */}
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">{player.currentHp}</span>
                <span className="text-gray-400">/ {player.maxHp}</span>
              </div>
              <div className="w-48 bg-gray-700 rounded-full h-2">
                <div
                  className="health-bar"
                  style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Block */}
          {player.block > 0 && (
            <div className={`flex items-center gap-2 ${blockAnimation ? 'animate-shield-pop' : ''}`}>
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-xl">{player.block}</span>
            </div>
          )}

          {/* Energy */}
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400 energy-glow" />
            <span className="font-bold text-2xl energy-glow">{player.energy}</span>
            <span className="text-gray-400">/ {player.maxEnergy}</span>
          </div>

          {/* Floor */}
          <div className="text-right">
            <div className="text-sm text-gray-400">Floor</div>
            <div className="font-bold text-xl">{gameState.floor}</div>
          </div>
        </div>
      </div>

      {/* Battle Area */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="flex gap-6 flex-wrap justify-center">
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              data-enemy-id={enemy.id}
              className={enemy.currentHp <= 0 ? '' : attackAnimation ? 'animate-hit' : ''}
            >
              <Enemy
                enemy={enemy}
                onClick={(e: React.MouseEvent) => handleEnemyClick(enemy, e)}
                selected={selectedEnemy?.id === enemy.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hand */}
      <div className="glass-effect rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              Hand: <span className="font-bold text-white">{player.hand.length}</span>
            </span>
            <span className="text-gray-400">
              Draw: <span className="font-bold text-white">{player.drawPile.length}</span>
            </span>
            <span className="text-gray-400">
              Discard: <span className="font-bold text-white">{player.discardPile.length}</span>
            </span>
          </div>
          
          <button
            onClick={handleEndTurn}
            className="btn-primary px-6 py-2"
          >
            End Turn
          </button>
        </div>

        {/* Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
          {player.hand.map((card, index) => (
            <div key={`${card.id}-${index}`}>
              <Card
                card={card}
                onClick={() => handleCardClick(card)}
                disabled={!isCardPlayable(card)}
                selected={selectedCard === card}
                isInHand={true}
              />
            </div>
          ))}
        </div>

        {player.hand.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No cards in hand - Click "End Turn" to draw more cards
          </div>
        )}
      </div>

      {/* Instructions */}
      {selectedCard && cardNeedsTarget(selectedCard) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-effect rounded-lg p-6 border-2 border-yellow-400 animate-pulse-glow z-50">
          <p className="text-lg font-bold mb-2">💡 Select an Enemy Target</p>
          <p className="text-sm text-gray-300 mb-4">Click on an enemy to attack</p>
          <button
            onClick={() => setSelectedCard(null)}
            className="btn-secondary w-full"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Help Text */}
      {!selectedCard && player.hand.length > 0 && (
        <div className="text-center text-gray-400 text-sm mt-2">
          💡 Click a card to play it, then click an enemy to attack
        </div>
      )}
    </div>
  );
};

export default Combat;