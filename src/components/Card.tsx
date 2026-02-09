import { Card as CardType } from '../types/game';
import { Sword, Shield, Sparkles } from 'lucide-react';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  isInHand?: boolean;
}

const Card = ({ card, onClick, disabled = false, selected = false, isInHand = false }: CardProps) => {
  const getCardTypeClass = () => {
    switch (card.type) {
      case 'attack': return 'card-attack';
      case 'defense': return 'card-defense';
      case 'skill': return 'card-skill';
      default: return 'from-gray-800 to-gray-700 border-gray-500';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'attack': return <Sword className="w-4 h-4" />;
      case 'defense': return <Shield className="w-4 h-4" />;
      case 'skill': return <Sparkles className="w-4 h-4" />;
    }
  };

  const getRarityColor = () => {
    switch (card.rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-blue-400';
      case 'rare': return 'text-purple-400';
    }
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        card-base ${getCardTypeClass()}
        w-40 p-3 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-2'}
        ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
        ${isInHand ? 'transition-transform duration-200' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1">
          {getCardIcon()}
          <span className="font-bold text-sm truncate">{card.name}</span>
        </div>
        <div className="bg-black/40 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {card.cost}
        </div>
      </div>

      {/* Description */}
      <div className="bg-black/30 rounded p-2 mb-2 min-h-[60px]">
        <p className="text-xs text-gray-100 leading-relaxed">{card.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${getRarityColor()}`}>
          {card.rarity.toUpperCase()}
        </span>
        {card.upgraded && (
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">
            +
          </span>
        )}
      </div>

      {/* Stats overlay for quick reference */}
      {(card.damage || card.block) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {card.damage && (
            <div className="bg-red-500/80 rounded px-1.5 py-0.5 text-xs font-bold">
              {card.damage}
            </div>
          )}
          {card.block && (
            <div className="bg-blue-500/80 rounded px-1.5 py-0.5 text-xs font-bold">
              {card.block}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;