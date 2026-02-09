import { useState, useEffect } from 'react';
import { GameState, Player, Enemy, Card as CardType } from '../types/game';
import { getStarterDeck } from '../data/cards';
import { generateFloorMap, generateCombatRewards, findCurrentNode, moveToNode, getAvailablePaths } from '../utils/generator';
import { generateEnemyGroup, generateEnemy, determineEnemyIntent } from '../data/enemies';
import { initializeCombat, isCombatOver } from '../utils/combat';
import Combat from './Combat';
import Map from './Map';
import Victory from './Victory';
import CardReward from './CardReward';
import RestSite from './RestSite';
import Defeat from './Defeat';

const Game = () => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());

  function initializeGame(): GameState {
    const player: Player = {
      maxHp: 80,
      currentHp: 80,
      block: 0,
      energy: 3,
      maxEnergy: 3,
      gold: 100,
      deck: getStarterDeck(),
      hand: [],
      drawPile: [],
      discardPile: [],
      exhaustPile: [],
      relics: [{ id: 'burningBlood', name: 'Burning Blood', description: 'Heal 6 HP after combat', rarity: 'common', effects: [] }],
      statuses: []
    };

    const map = generateFloorMap(1);

    return {
      screen: 'map',
      floor: 1,
      act: 1,
      player,
      enemies: [],
      currentNode: findCurrentNode(map),
      map,
      turn: 0,
      combatRewards: []
    };
  }

  const startCombat = (enemies: Enemy[]) => {
    initializeCombat(gameState.player);
    enemies.forEach((enemy, idx) => determineEnemyIntent(enemy, 0));
    setGameState(prev => ({
      ...prev,
      screen: 'combat',
      enemies,
      turn: 0
    }));
  };

  const handleNodeClick = (nodeId: string) => {
    const [x, y] = nodeId.split('-').map(Number);
    const targetNode = gameState.map[y][x];
    
    if (!targetNode || targetNode.cleared) return;

    // Check if node is reachable from current position
    const currentNode = findCurrentNode(gameState.map);
    if (!currentNode) return;

    const availablePaths = getAvailablePaths(gameState.map, currentNode);
    const isReachable = availablePaths.some(node => node.id === targetNode.id);
    
    if (!isReachable) return;

    moveToNode(gameState.map, targetNode);

    switch (targetNode.type) {
      case 'combat':
        const enemies = generateEnemyGroup(gameState.floor);
        startCombat(enemies);
        break;
      case 'elite':
        const elite = [generateEnemy(gameState.floor, 'elite')];
        startCombat(elite);
        break;
      case 'boss':
        const boss = [generateEnemy(gameState.floor, 'boss')];
        startCombat(boss);
        break;
      case 'rest':
        setGameState(prev => ({ ...prev, screen: 'rest' }));
        break;
      case 'treasure':
        // TODO: Implement treasure
        setGameState(prev => ({ ...prev, screen: 'map' }));
        break;
    }
  };

  const handleCombatVictory = () => {
    // Apply burning blood relic
    if (gameState.player.relics.some(r => r.id === 'burningBlood')) {
      gameState.player.currentHp = Math.min(
        gameState.player.maxHp,
        gameState.player.currentHp + 6
      );
    }

    const isElite = gameState.enemies.some(e => e.isElite);
    const isBoss = gameState.enemies.some(e => e.isBoss);
    
    const rewards = generateCombatRewards(isElite, isBoss);
    
    setGameState(prev => ({
      ...prev,
      screen: 'victory',
      combatRewards: rewards
    }));
  };

  const handleClaimRewards = (selectedCards: CardType[]) => {
    // Add selected cards to deck
    gameState.player.deck.push(...selectedCards);
    
    // Add gold
    const goldReward = gameState.combatRewards.find(r => r.type === 'gold');
    if (goldReward && goldReward.gold) {
      gameState.player.gold += goldReward.gold;
    }
    
    // Add relic
    const relicReward = gameState.combatRewards.find(r => r.type === 'relic');
    if (relicReward && relicReward.relic) {
      gameState.player.relics.push(relicReward.relic);
    }

    setGameState(prev => ({
      ...prev,
      screen: 'map',
      combatRewards: []
    }));
  };

  const handleRest = (action: 'heal' | 'upgrade', card?: CardType) => {
    if (action === 'heal') {
      gameState.player.currentHp = Math.min(
        gameState.player.maxHp,
        gameState.player.currentHp + 30
      );
    } else if (action === 'upgrade' && card) {
      const cardIndex = gameState.player.deck.findIndex(c => c.id === card.id && !c.upgraded);
      if (cardIndex !== -1) {
        gameState.player.deck[cardIndex].upgraded = true;
        gameState.player.deck[cardIndex].name += '+';
        // Apply upgrade effects
        if (gameState.player.deck[cardIndex].damage) {
          gameState.player.deck[cardIndex].damage = Math.floor(gameState.player.deck[cardIndex].damage! * 1.4);
        }
        if (gameState.player.deck[cardIndex].block) {
          gameState.player.deck[cardIndex].block = Math.floor(gameState.player.deck[cardIndex].block! * 1.4);
        }
      }
    }

    setGameState(prev => ({ ...prev, screen: 'map' }));
  };

  const handleDefeat = () => {
    setGameState(initializeGame());
  };

  // Check for defeat or victory
  useEffect(() => {
    if (gameState.screen === 'combat') {
      const result = isCombatOver(gameState);
      if (result === 'victory') {
        handleCombatVictory();
      } else if (result === 'defeat') {
        setGameState(prev => ({ ...prev, screen: 'defeat' }));
      }
    }
  }, [gameState.player.currentHp, gameState.enemies]);

  return (
    <div className="min-h-screen">
      {gameState.screen === 'map' && (
        <Map
          gameState={gameState}
          onNodeClick={handleNodeClick}
        />
      )}
      
      {gameState.screen === 'combat' && (
        <Combat
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      
      {gameState.screen === 'victory' && (
        <Victory
          rewards={gameState.combatRewards}
          onContinue={handleClaimRewards}
        />
      )}
      
      {gameState.screen === 'rest' && (
        <RestSite
          player={gameState.player}
          onRest={handleRest}
        />
      )}
      
      {gameState.screen === 'defeat' && (
        <Defeat
          floor={gameState.floor}
          onRestart={handleDefeat}
        />
      )}
    </div>
  );
};

export default Game;