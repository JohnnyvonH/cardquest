import { Enemy as EnemyType } from '../types/game';
import { Sword, Shield, Skull } from 'lucide-react';

interface EnemyProps {
  enemy: EnemyType;
  onClick: () => void;
  selected?: boolean;
}

const Enemy = ({ enemy, onClick, selected = false }: EnemyProps) => {
  const isDead = enemy.currentHp <= 0;
  const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;

  const getIntentIcon = () => {
    switch (enemy.intent) {
      case 'attack':
        return <Sword className="w-5 h-5 text-red-400" />;
      case 'defend':
        return <Shield className="w-5 h-5 text-blue-400" />;
      default:
        return <Skull className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBorderColor = () => {
    if (enemy.isBoss) return 'border-purple-500';
    if (enemy.isElite) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <div
      onClick={!isDead ? onClick : undefined}
      className={`
        relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6
        border-4 ${getBorderColor()}
        transition-all duration-200
        ${isDead ? 'opacity-30 grayscale' : 'hover:scale-105 cursor-pointer'}
        ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
        min-w-[200px]
      `}
    >
      {/* Elite/Boss Badge */}
      {(enemy.isElite || enemy.isBoss) && (
        <div className={`
          absolute -top-3 left-1/2 transform -translate-x-1/2
          px-3 py-1 rounded-full text-xs font-bold
          ${enemy.isBoss ? 'bg-purple-600 text-white' : 'bg-yellow-500 text-black'}
        `}>
          {enemy.isBoss ? 'BOSS' : 'ELITE'}
        </div>
      )}

      {/* Name */}
      <h3 className="text-xl font-bold text-center mb-4 text-shadow">
        {enemy.name}
      </h3>

      {/* Enemy Visual Placeholder */}
      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-lg flex items-center justify-center border-2 border-red-700/50">
        <Skull className="w-16 h-16 text-red-400/60" />
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-400" />
            {enemy.currentHp} / {enemy.maxHp}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Block */}
      {enemy.block > 0 && (
        <div className="flex items-center justify-center gap-2 mb-3 bg-blue-900/30 rounded py-2 border border-blue-500/30">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">{enemy.block}</span>
        </div>
      )}

      {/* Intent */}
      {!isDead && (
        <div className="bg-black/40 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-1">
            {getIntentIcon()}
            <span className="text-sm font-semibold text-gray-300">Intent</span>
          </div>
          <div className="text-center">
            {enemy.intent === 'attack' && enemy.nextDamage && (
              <span className="text-red-400 font-bold text-lg">
                {enemy.nextDamage} damage
              </span>
            )}
            {enemy.intent === 'defend' && enemy.nextBlock && (
              <span className="text-blue-400 font-bold text-lg">
                {enemy.nextBlock} block
              </span>
            )}
          </div>
        </div>
      )}

      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
          <span className="text-3xl font-bold text-red-500 text-shadow">DEFEATED</span>
        </div>
      )}
    </div>
  );
};

import { Heart } from 'lucide-react';

export default Enemy;