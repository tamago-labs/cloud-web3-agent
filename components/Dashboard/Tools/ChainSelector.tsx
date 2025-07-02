import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import type { BlockchainNetwork } from './ToolSelector';

interface ChainSelectorProps {
  network: BlockchainNetwork;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  className?: string;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ 
  network, 
  isSelected, 
  onSelect,
  disabled = false,
  className = "" 
}) => {
  const getStatusIcon = () => {
    if (isSelected) return <Check className="w-4 h-4 text-teal-400" />;
    if (network.status === 'coming_soon') return <Clock className="w-4 h-4 text-gray-400" />;
    if (network.status === 'beta') return <Sparkles className="w-4 h-4 text-yellow-400" />;
    return null;
  };

  const getStatusColor = () => {
    if (disabled || network.status === 'coming_soon') {
      return 'border-gray-700 bg-gray-800/30 opacity-60 cursor-not-allowed';
    }
    if (isSelected) {
      return 'border-teal-500 bg-teal-600/20 ring-1 ring-teal-500/30';
    }
    return 'border-teal-700 hover:border-teal-600 hover:bg-teal-800/20 cursor-pointer';
  };

  return (
    <button
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`w-full p-4 border rounded-lg transition-all duration-200 text-left ${getStatusColor()} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{network.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white truncate">{network.name}</h3>
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                network.type === 'evm' ? 'bg-purple-500/20 text-purple-400' :
                network.type === 'sui' ? 'bg-blue-500/20 text-blue-400' :
                network.type === 'move' ? 'bg-green-500/20 text-green-400' :
                network.type === 'solana' ? 'bg-orange-500/20 text-orange-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {network.type.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-teal-300 mt-1">
              {network.status === 'available' && `${network.tools.length} tools available`}
              {network.status === 'coming_soon' && 'Coming soon'}
              {network.status === 'beta' && 'Beta version'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
        </div>
      </div>
      
      {/* Chain features preview */}
      {network.features && network.features.length > 0 && (
        <div className="mt-2 pt-2 border-t border-teal-800/30">
          <div className="flex flex-wrap gap-1">
            {network.features.slice(0, 2).map((feature) => (
              <span key={feature} className="px-1.5 py-0.5 bg-teal-800/20 text-teal-300 text-xs rounded">
                {feature}
              </span>
            ))}
            {network.features.length > 2 && (
              <span className="px-1.5 py-0.5 bg-teal-800/20 text-teal-400 text-xs rounded">
                +{network.features.length - 2}
              </span>
            )}
          </div>
        </div>
      )}
    </button>
  );
};

export default ChainSelector;