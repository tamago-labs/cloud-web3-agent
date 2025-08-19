// TopUpModal.tsx - Minimal version
import React from 'react';
import { X } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const supportedChains = [
    { name: 'Aptos', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' },
    { name: 'Sui', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png' },
    { name: 'Ethereum', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
    { name: 'Base', icon: 'https://images.blockscan.com/chain-logos/base.svg' },
    { name: 'Optimism', icon: 'https://optimistic.etherscan.io/assets/optimism/images/svg/logos/token-secondary-light.svg?v=25.7.5.2' }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Top-up Credits Now Live!
          </h2>
          <p className="text-sm text-gray-600">
            You can now top up more credits with USDC on:
          </p>
        </div>

        <div className="flex justify-center items-center gap-3 mb-6">
          {supportedChains.map((chain) => (
            <div key={chain.name} className="flex flex-col items-center">
              <img
                src={chain.icon}
                alt={chain.name}
                className="w-8 h-8 rounded-full mb-1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xs text-gray-600">{chain.name}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;