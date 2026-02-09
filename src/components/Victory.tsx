import { useState } from 'react';
import { CombatReward, Card as CardType } from '../types/game';
import Card from './Card';
import { Trophy, Coins, Sparkles } from 'lucide-react';

interface VictoryProps {
  rewards: CombatReward[];
  onContinue: (selectedCards: CardType[]) => void;
}

const Victory = ({ rewards, onContinue }: VictoryProps) => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);

  const cardReward = rewards.find(r => r.type === 'card');
  const goldReward = rewards.find(r => r.type === 'gold');
  const relicReward = rewards.find(r => r.type === 'relic');

  const handleCardClick = (card: CardType) => {
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleContinue = () => {
    onContinue(selectedCards);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Victory Header */}
        <div className="text-center mb-8 animate-float">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-2 text-shadow bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            VICTORY!
          </h1>
          <p className="text-xl text-gray-300">Choose your rewards</p>
        </div>

        {/* Rewards */}
        <div className="space-y-6">
          {/* Gold */}
          {goldReward && goldReward.gold && (
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center justify-center gap-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold">+{goldReward.gold} Gold</span>
              </div>
            </div>
          )}

          {/* Relic */}
          {relicReward && relicReward.relic && (
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-400">{relicReward.relic.name}</h3>
                  <p className="text-gray-300">{relicReward.relic.description}</p>
                </div>
                <div className="text-sm text-purple-400 font-semibold">
                  {relicReward.relic.rarity.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Card Selection */}
          {cardReward && cardReward.cards && cardReward.cards.length > 0 && (
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Choose Cards to Add to Your Deck</h3>
              <p className="text-center text-gray-400 mb-6 text-sm">
                Select cards you want (or skip all)
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                {cardReward.cards.map((card, index) => (
                  <Card
                    key={`${card.id}-${index}`}
                    card={card}
                    onClick={() => handleCardClick(card)}
                    selected={selectedCards.some(c => c.id === card.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleContinue}
            className="btn-primary text-lg px-12 py-4"
          >
            Continue
            {selectedCards.length > 0 && (
              <span className="ml-2">({selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected)</span>
            )}
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Tip: A smaller deck draws key cards more consistently
          </p>
        </div>
      </div>
    </div>
  );
};

export default Victory;