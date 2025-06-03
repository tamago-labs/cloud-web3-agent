"use client";

import React, { useState, useEffect } from 'react';
import ToolCategoryComponent from './ToolCategory';
import ToolCard from './ToolCard';
import ConfigExporter from './ConfigExporter';
import { LoadingPage } from '../Shared/LoadingStates';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  isRequired?: boolean;
  documentation?: string;
  usageCount?: number;
}

interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
  enabledCount: number;
}

interface ToolSelectorProps {
  className?: string;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ className = "" }) => {
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('wallet');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCategories: ToolCategory[] = [
          {
            id: 'wallet',
            name: 'Wallet Operations',
            description: 'Core wallet functionality for balance checks and transfers',
            icon: '💰',
            enabledCount: 3,
            tools: [
              {
                id: 'balance_check',
                name: 'Balance Check',
                description: 'Check token balances across multiple wallets',
                category: 'wallet',
                isEnabled: true,
                isRequired: true,
                usageCount: 234
              },
              {
                id: 'token_transfer',
                name: 'Token Transfer',
                description: 'Send tokens to any address or ENS name',
                category: 'wallet',
                isEnabled: true,
                usageCount: 89
              },
              {
                id: 'transaction_history',
                name: 'Transaction History',
                description: 'View detailed transaction history and receipts',
                category: 'wallet',
                isEnabled: true,
                usageCount: 156
              },
              {
                id: 'multisig_operations',
                name: 'Multi-sig Operations',
                description: 'Create and manage multi-signature transactions',
                category: 'wallet',
                isEnabled: false,
                usageCount: 0
              }
            ]
          },
          {
            id: 'defi',
            name: 'DeFi Operations',
            description: 'Decentralized finance protocols and trading',
            icon: '💱',
            enabledCount: 2,
            tools: [
              {
                id: 'dex_swaps',
                name: 'DEX Swaps',
                description: 'Trade tokens on decentralized exchanges',
                category: 'defi',
                isEnabled: true,
                usageCount: 67
              },
              {
                id: 'liquidity_provision',
                name: 'Liquidity Provision',
                description: 'Add/remove liquidity from DEX pools',
                category: 'defi',
                isEnabled: false,
                usageCount: 12
              },
              {
                id: 'lending_borrowing',
                name: 'Lending & Borrowing',
                description: 'Interact with lending protocols like Aave, Compound',
                category: 'defi',
                isEnabled: false,
                usageCount: 8
              },
              {
                id: 'yield_farming',
                name: 'Yield Farming',
                description: 'Manage yield farming positions and strategies',
                category: 'defi',
                isEnabled: true,
                usageCount: 23
              },
              {
                id: 'options_trading',
                name: 'Options Trading',
                description: 'Trade options and derivatives',
                category: 'defi',
                isEnabled: false,
                usageCount: 3
              }
            ]
          },
          {
            id: 'data',
            name: 'Data & Analytics',
            description: 'Market data, prices, and on-chain analytics',
            icon: '📊',
            enabledCount: 1,
            tools: [
              {
                id: 'price_feeds',
                name: 'Price Feeds',
                description: 'Real-time token prices from multiple sources',
                category: 'data',
                isEnabled: true,
                usageCount: 445
              },
              {
                id: 'market_data',
                name: 'Market Data',
                description: 'Trading volume, market cap, and trends',
                category: 'data',
                isEnabled: false,
                usageCount: 78
              },
              {
                id: 'portfolio_analytics',
                name: 'Portfolio Analytics',
                description: 'Track portfolio performance and allocation',
                category: 'data',
                isEnabled: false,
                usageCount: 34
              },
              {
                id: 'onchain_analytics',
                name: 'On-chain Analytics',
                description: 'Blockchain data analysis and insights',
                category: 'data',
                isEnabled: false,
                usageCount: 19
              }
            ]
          },
          {
            id: 'nft',
            name: 'NFT Operations',
            description: 'Non-fungible token management and trading',
            icon: '🎨',
            enabledCount: 0,
            tools: [
              {
                id: 'nft_balance',
                name: 'NFT Balance',
                description: 'View NFT collections and metadata',
                category: 'nft',
                isEnabled: false,
                usageCount: 0
              },
              {
                id: 'nft_transfer',
                name: 'NFT Transfer',
                description: 'Send NFTs to other addresses',
                category: 'nft',
                isEnabled: false,
                usageCount: 0
              },
              {
                id: 'nft_marketplace',
                name: 'NFT Marketplace',
                description: 'Buy and sell NFTs on major marketplaces',
                category: 'nft',
                isEnabled: false,
                usageCount: 0
              }
            ]
          }
        ];
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleToolToggle = (categoryId: string, toolId: string) => {
    setCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        const updatedTools = category.tools.map(tool => {
          if (tool.id === toolId && !tool.isRequired) {
            return { ...tool, isEnabled: !tool.isEnabled };
          }
          return tool;
        });
        
        const enabledCount = updatedTools.filter(tool => tool.isEnabled).length;
        
        return {
          ...category,
          tools: updatedTools,
          enabledCount
        };
      }
      return category;
    }));
    
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Show success toast or notification
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const totalEnabledTools = categories.reduce((sum, cat) => sum + cat.enabledCount, 0);

  if (loading) {
    return <LoadingPage message="Loading tool configuration..." />;
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Categories Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tool Categories</h3>
          
          <div className="space-y-2">
            {categories.map((category) => (
              <ToolCategoryComponent
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-teal-800/50">
            <div className="text-sm text-teal-300 space-y-1">
              <div>Total Tools: {categories.reduce((sum, cat) => sum + cat.tools.length, 0)}</div>
              <div>Enabled: {totalEnabledTools}</div>
            </div>
          </div>

          {/* Config Export */}
          <div className="mt-4">
            <ConfigExporter enabledTools={categories.flatMap(cat => 
              cat.tools.filter(tool => tool.isEnabled)
            )} />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Category Header */}
          {selectedCategoryData && (
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{selectedCategoryData.icon}</span>
                <h2 className="text-2xl font-bold text-white">{selectedCategoryData.name}</h2>
              </div>
              <p className="text-teal-200">{selectedCategoryData.description}</p>
              <div className="mt-3 text-sm text-teal-400">
                {selectedCategoryData.enabledCount} of {selectedCategoryData.tools.length} tools enabled
              </div>
            </div>
          )}

          {/* Tools Grid */}
          {selectedCategoryData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategoryData.tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onToggle={() => handleToolToggle(selectedCategoryData.id, tool.id)}
                />
              ))}
            </div>
          )}

          {/* Save Changes */}
          {hasChanges && (
            <div className="bg-yellow-900/50 border border-yellow-600/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-yellow-200 font-medium">Unsaved Changes</h3>
                  <p className="text-yellow-300 text-sm">You have modified your tool configuration</p>
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolSelector;