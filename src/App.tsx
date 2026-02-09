import { useState, useEffect } from 'react';
import Game from './components/Game';
import { Swords, Shield, Zap } from 'lucide-react';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  if (gameStarted) {
    return <Game />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-12 animate-float">
          <h1 className="text-7xl font-bold mb-4 text-shadow">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Card Quest
            </span>
          </h1>
          <p className="text-xl text-gray-300">A Strategic Roguelike Card Adventure</p>
        </div>

        {/* Main Menu Card */}
        <div className="glass-effect rounded-2xl p-8 mb-6">
          {!showInstructions ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Feature Cards */}
                <div className="bg-gradient-to-br from-red-900/50 to-red-700/50 rounded-lg p-6 border border-red-500/30">
                  <Swords className="w-8 h-8 mb-3 text-red-400" />
                  <h3 className="font-bold text-lg mb-2">Strategic Combat</h3>
                  <p className="text-sm text-gray-300">Choose your cards wisely to defeat powerful enemies</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 rounded-lg p-6 border border-blue-500/30">
                  <Shield className="w-8 h-8 mb-3 text-blue-400" />
                  <h3 className="font-bold text-lg mb-2">Deck Building</h3>
                  <p className="text-sm text-gray-300">Collect and upgrade cards throughout your journey</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/50 rounded-lg p-6 border border-purple-500/30">
                  <Zap className="w-8 h-8 mb-3 text-purple-400" />
                  <h3 className="font-bold text-lg mb-2">Powerful Relics</h3>
                  <p className="text-sm text-gray-300">Discover artifacts that enhance your abilities</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setGameStarted(true)}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Adventure
                </button>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  How to Play
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold mb-6 text-center">How to Play</h2>
              
              <div className="space-y-4 text-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">🎯 Objective</h3>
                  <p>Battle through floors of enemies, collect powerful cards, and defeat bosses to progress through the tower.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">⚡ Energy System</h3>
                  <p>Each turn you have 3 energy. Cards cost energy to play. Plan your moves carefully!</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">🃏 Card Types</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><span className="text-red-400 font-semibold">Attack Cards</span>: Deal damage to enemies</li>
                    <li><span className="text-blue-400 font-semibold">Defense Cards</span>: Gain block to reduce damage taken</li>
                    <li><span className="text-green-400 font-semibold">Skill Cards</span>: Special effects like drawing cards or gaining energy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">🛡️ Block</h3>
                  <p>Block reduces incoming damage and resets at the start of your turn. Use it strategically!</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">🗺️ Map Navigation</h3>
                  <p>Choose your path carefully. Face normal enemies, elite challenges, rest at campsites, or find treasures.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">💎 Relics</h3>
                  <p>Collect powerful relics that provide permanent bonuses and change your playstyle.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">📈 Strategy Tips</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Balance offense and defense</li>
                    <li>Keep your deck lean - avoid taking every card</li>
                    <li>Upgrade cards when possible</li>
                    <li>Watch enemy intentions to plan your defense</li>
                    <li>Build synergies between your cards</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => setGameStarted(true)}
                  className="btn-primary px-8 py-3"
                >
                  Start Game
                </button>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="btn-secondary px-8 py-3"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>Built with React, TypeScript & Tailwind CSS</p>
          <p className="mt-1">© 2026 Card Quest</p>
        </div>
      </div>
    </div>
  );
}

export default App;