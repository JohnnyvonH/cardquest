import { Card as CardType } from '../types/game';
import Card from './Card';

interface HandProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  selectedCard: CardType | null;
  canPlayCard: (card: CardType) => boolean;
}

const Hand = ({ cards, onCardClick, selectedCard, canPlayCard }: HandProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 justify-center overflow-x-auto pb-2">
          {cards.map((card, index) => (
            <Card
              key={`${card.id}-${index}`}
              card={card}
              onClick={() => onCardClick(card)}
              disabled={!canPlayCard(card)}
              selected={selectedCard === card}
              isInHand={true}
            />
          ))}
        </div>
        
        {cards.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No cards in hand - End your turn to draw more
          </div>
        )}
      </div>
    </div>
  );
};

export default Hand;