import { Skull } from 'lucide-react';

interface DefeatProps {
  floor: number;
  onRestart: () => void;
}

const Defeat = ({ floor, onRestart }: DefeatProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="animate-pulse mb-8">
          <Skull className="w-32 h-32 text-red-500 mx-auto mb-6" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-shadow">
          <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            DEFEATED
          </span>
        </h1>
        
        <p className="text-2xl text-gray-300 mb-8">
          You fell on floor {floor}
        </p>

        <div className="glass-effect rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Run Statistics</h3>
          <div className="space-y-2 text-gray-300">
            <p>Floor Reached: <span className="font-bold text-white">{floor}</span></p>
            <p className="text-sm text-gray-400 mt-4">
              Every defeat is a lesson learned. Try again with a new strategy!
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-primary text-xl px-12 py-4"
        >
          Try Again
        </button>

        <div className="mt-8 text-gray-400 text-sm">
          <p>&quot;The spire claims another adventurer...&quot;</p>
        </div>
      </div>
    </div>
  );
};

export default Defeat;