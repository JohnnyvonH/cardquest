import { useState } from 'react';
import { Player, Card as CardType } from '../types/game';
import Card from './Card';
import { Heart, Sparkles } from 'lucide-react';

interface RestSiteProps {
  player: Player;
  onRest: (action: 'heal' | 'upgrade', card?: CardType) => void;
}

const RestSite = ({ player, onRest }: RestSiteProps) => {
  const [action, setAction] = useState<'heal' | 'upgrade' | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const upgradeableCards = player.deck.filter(c => !c.upgraded);
  const canHeal = player.currentHp < player.maxHp;
  const healAmount = Math.min(30, player.maxHp - player.currentHp);

  const handleConfirm = () => {
    if (action === 'heal') {
      onRest('heal');
    } else if (action === 'upgrade' && selectedCard) {
      onRest('upgrade', selectedCard);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-shadow">Rest Site</h1>
          <p className="text-xl text-gray-300">Take a moment to recover</p>
        </div>

        {!action ? (
          /* Action Selection */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Heal Option */}
            <button
              onClick={() => canHeal && setAction('heal')}
              disabled={!canHeal}
              className={`
                glass-effect rounded-xl p-8 transition-all duration-200
                ${canHeal 
                  ? 'hover:scale-105 cursor-pointer border-2 border-red-500/30 hover:border-red-400' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Rest</h2>
              <p className="text-gray-300 mb-2">
                Recover health by resting at the campfire
              </p>
              {canHeal ? (
                <p className="text-xl font-bold text-green-400">
                  Heal {healAmount} HP
                </p>
              ) : (
                <p className="text-yellow-400">
                  Already at full health
                </p>
              )}
            </button>

            {/* Upgrade Option */}
            <button
              onClick={() => upgradeableCards.length > 0 && setAction('upgrade')}
              disabled={upgradeableCards.length === 0}
              className={`
                glass-effect rounded-xl p-8 transition-all duration-200
                ${upgradeableCards.length > 0 
                  ? 'hover:scale-105 cursor-pointer border-2 border-purple-500/30 hover:border-purple-400' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Smith</h2>
              <p className="text-gray-300 mb-2">
                Upgrade a card to make it more powerful
              </p>
              {upgradeableCards.length > 0 ? (
                <p className="text-xl font-bold text-purple-400">
                  {upgradeableCards.length} card{upgradeableCards.length > 1 ? 's' : ''} available
                </p>
              ) : (
                <p className="text-yellow-400">
                  All cards already upgraded
                </p>
              )}
            </button>
          </div>
        ) : action === 'upgrade' ? (
          /* Upgrade Card Selection */
          <div className="glass-effect rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-center">Choose a Card to Upgrade</h3>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              {upgradeableCards.map((card, index) => (
                <Card
                  key={`${card.id}-${index}`}
                  card={card}
                  onClick={() => setSelectedCard(card)}
                  selected={selectedCard === card}
                />
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                disabled={!selectedCard}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upgrade Card
              </button>
              <button
                onClick={() => {
                  setAction(null);
                  setSelectedCard(null);
                }}
                className="btn-secondary px-8 py-3"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          /* Confirm Heal */
          <div className="glass-effect rounded-lg p-8 text-center">
            <Heart className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Rest at the campfire?</h3>
            <p className="text-xl mb-6">
              You will recover <span className="text-green-400 font-bold">{healAmount} HP</span>
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="btn-primary px-8 py-3"
              >
                Rest
              </button>
              <button
                onClick={() => setAction(null)}
                className="btn-secondary px-8 py-3"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestSite;