import { useState } from 'react';
import { Card as CardType } from '../types/game';
import Card from './Card';

interface CardRewardProps {
  cards: CardType[];
  onSelect: (cards: CardType[]) => void;
}

const CardReward = ({ cards, onSelect }: CardRewardProps) => {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);

  const handleCardClick = (card: CardType) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Reward</h2>
          <p className="text-gray-300">Select cards to add to your deck, or skip</p>
        </div>

        <div className="glass-effect rounded-lg p-8 mb-6">
          <div className="flex gap-4 justify-center flex-wrap">
            {cards.map((card, index) => (
              <Card
                key={`${card.id}-${index}`}
                card={card}
                onClick={() => handleCardClick(card)}
                selected={selectedCards.includes(card)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSelect(selectedCards)}
            className="btn-primary px-8 py-3"
          >
            {selectedCards.length > 0 
              ? `Add ${selectedCards.length} Card${selectedCards.length > 1 ? 's' : ''}` 
              : 'Skip'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Tip: Keeping your deck small helps you draw your best cards more often
        </p>
      </div>
    </div>
  );
};

export default CardReward;