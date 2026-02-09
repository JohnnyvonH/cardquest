import { useState } from 'react';
import { GameState, Enemy as EnemyType, Card as CardType } from '../types/game';
import { playCard, canPlayCard, cardNeedsTarget } from '../utils/cardEffects';
import { endTurn } from '../utils/combat';
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
  const { player, enemies } = gameState;

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
        const success = playCard(card, player, aliveEnemies[0], gameState);
        if (success) {
          setSelectedCard(null);
          setGameState({ ...gameState });
        }
      }
    } else {
      // Play card without target (AOE or non-attack cards)
      const success = playCard(card, player, null, gameState);
      if (success) {
        setGameState({ ...gameState });
      }
    }
  };

  const handleEnemyClick = (enemy: EnemyType) => {
    if (enemy.currentHp <= 0) return;

    if (selectedCard) {
      // Play the selected card on this enemy
      const success = playCard(selectedCard, player, enemy, gameState);
      if (success) {
        setSelectedCard(null);
        setSelectedEnemy(null);
        setGameState({ ...gameState });
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
    setGameState({ ...gameState });
  };

  const isCardPlayable = (card: CardType) => {
    return player.energy >= card.cost;
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
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
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-xl">{player.block}</span>
            </div>
          )}

          {/* Energy */}
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-2xl">{player.energy}</span>
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
            <Enemy
              key={enemy.id}
              enemy={enemy}
              onClick={() => handleEnemyClick(enemy)}
              selected={selectedEnemy?.id === enemy.id}
            />
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
            <Card
              key={`${card.id}-${index}`}
              card={card}
              onClick={() => handleCardClick(card)}
              disabled={!isCardPlayable(card)}
              selected={selectedCard === card}
              isInHand={true}
            />
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