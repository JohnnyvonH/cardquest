import { GameState, MapNode as MapNodeType } from '../types/game';
import { getAvailablePaths, findCurrentNode } from '../utils/generator';
import { Sword, Shield, Flame, Gift, Tent, Crown, Heart, Coins } from 'lucide-react';

interface MapProps {
  gameState: GameState;
  onNodeClick: (nodeId: string) => void;
}

const Map = ({ gameState, onNodeClick }: MapProps) => {
  const currentNode = findCurrentNode(gameState.map);
  const availablePaths = currentNode ? getAvailablePaths(gameState.map, currentNode) : [];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'combat': return <Sword className="w-6 h-6" />;
      case 'elite': return <Flame className="w-6 h-6" />;
      case 'rest': return <Tent className="w-6 h-6" />;
      case 'treasure': return <Gift className="w-6 h-6" />;
      case 'boss': return <Crown className="w-6 h-6" />;
      default: return <Sword className="w-6 h-6" />;
    }
  };

  const getNodeColor = (node: MapNodeType) => {
    if (node.current) return 'from-green-600 to-green-500 border-green-400 ring-4 ring-green-400/50';
    if (node.cleared) return 'from-gray-700 to-gray-600 border-gray-500 opacity-50';
    
    const isAvailable = availablePaths.some(n => n.id === node.id);
    if (!isAvailable) return 'from-gray-800 to-gray-700 border-gray-600 opacity-30';

    switch (node.type) {
      case 'combat': return 'from-red-700 to-red-600 border-red-500 hover:from-red-600 hover:to-red-500';
      case 'elite': return 'from-orange-700 to-orange-600 border-orange-500 hover:from-orange-600 hover:to-orange-500';
      case 'rest': return 'from-blue-700 to-blue-600 border-blue-500 hover:from-blue-600 hover:to-blue-500';
      case 'treasure': return 'from-yellow-700 to-yellow-600 border-yellow-500 hover:from-yellow-600 hover:to-yellow-500';
      case 'boss': return 'from-purple-700 to-purple-600 border-purple-500 hover:from-purple-600 hover:to-purple-500';
      default: return 'from-gray-700 to-gray-600 border-gray-500';
    }
  };

  const isNodeClickable = (node: MapNodeType) => {
    if (node.cleared) return false;
    return availablePaths.some(n => n.id === node.id);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="glass-effect rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Floor {gameState.floor}</h1>
            <p className="text-gray-300">Choose your path wisely</p>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <div className="font-bold">{gameState.player.currentHp}/{gameState.player.maxHp}</div>
            </div>
            <div className="text-center">
              <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="font-bold">{gameState.player.gold}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* SVG for paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {gameState.map.flatMap((row, y) =>
              row.flatMap(node =>
                node.connections.map(connId => {
                  const [targetX, targetY] = connId.split('-').map(Number);
                  const startX = node.x * 140 + 70 + 50;
                  const startY = y * 120 + 60;
                  const endX = targetX * 140 + 70 + 50;
                  const endY = targetY * 120 + 60;

                  const isActive = availablePaths.some(n => n.id === connId) && node.current;

                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={isActive ? '#60a5fa' : '#4b5563'}
                      strokeWidth={isActive ? '3' : '2'}
                      strokeDasharray={isActive ? '5,5' : '0'}
                      opacity={isActive ? '0.8' : '0.3'}
                    />
                  );
                })
              )
            )}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ zIndex: 1 }}>
            {gameState.map.map((row, y) => (
              <div key={y} className="flex justify-center gap-4 mb-8">
                {row.map(node => (
                  <div
                    key={node.id}
                    onClick={() => isNodeClickable(node) && onNodeClick(node.id)}
                    className={`
                      bg-gradient-to-br ${getNodeColor(node)}
                      w-16 h-16 rounded-lg border-2
                      flex items-center justify-center
                      transition-all duration-200
                      ${isNodeClickable(node) ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                    `}
                  >
                    {getNodeIcon(node.type)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="glass-effect rounded-lg p-6 mt-8">
          <h3 className="font-bold mb-4 text-center">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-700 to-red-600 border-2 border-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Sword className="w-5 h-5" />
              </div>
              <span className="text-sm">Combat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-700 to-orange-600 border-2 border-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-sm">Elite</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-700 to-blue-600 border-2 border-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Tent className="w-5 h-5" />
              </div>
              <span className="text-sm">Rest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-yellow-700 to-yellow-600 border-2 border-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-sm">Treasure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-700 to-purple-600 border-2 border-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-sm">Boss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;