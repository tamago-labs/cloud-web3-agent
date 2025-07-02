"use client";

import React, { useState, useEffect, useContext } from 'react';
import ChainSelector from './ChainSelector';
import ChainToolGrid from './ChainToolGrid';
import ConfigExporter from './ConfigExporter';
import { LoadingPage } from '../Shared/LoadingStates';
import { CloudAgentContext } from '@/hooks/useCloudAgent'; // Your existing user context

export interface ChainTool {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isRequired?: boolean;
  documentation?: string;
  usageCount?: number;
  parameters: Record<string, any>;
}

export interface BlockchainNetwork {
  chainId: string;
  name: string;
  symbol: string;
  icon: string;
  type: 'evm' | 'sui' | 'aptos' | 'solana' | 'move';
  status: 'available' | 'coming_soon' | 'beta';
  description: string;
  tools: ChainTool[];
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  ecosystem?: string[];
  features?: string[];
}

interface UserToolSettings {
  userId: string;
  selectedChainId: string;
  toolSelections: Record<string, boolean>; // toolId -> isEnabled
}

interface ToolSelectorProps {
  className?: string;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ className = "" }) => {
  const { profile } = useContext(CloudAgentContext); // Get current user
  const [networks, setNetworks] = useState<BlockchainNetwork[]>([]);
  const [userSettings, setUserSettings] = useState<UserToolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load networks and user settings
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      setLoading(true);
      try {
        // Fetch available networks
        const networksData = await fetchAvailableNetworks();

        // Fetch user's tool settings
        const userToolSettings = await fetchUserToolSettings(profile.id);

        // Merge user settings with network data
        const networksWithUserSettings = networksData.map(network => ({
          ...network,
          tools: network.tools.map(tool => ({
            ...tool,
            isEnabled: userToolSettings.selectedChainId === network.chainId
              ? (userToolSettings.toolSelections[tool.id] ?? tool.isRequired ?? false)
              : false
          }))
        }));

        setNetworks(networksWithUserSettings);
        setUserSettings(userToolSettings);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  const fetchAvailableNetworks = async (): Promise<BlockchainNetwork[]> => {
    // Simulate API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        chainId: 'sui:mainnet',
        name: 'Sui',
        symbol: 'SUI',
        icon: '⚫',
        type: 'sui',
        status: 'available',
        description: 'High-performance blockchain with Move programming language',
        rpcUrl: 'https://fullnode.mainnet.sui.io',
        blockExplorer: 'https://suiexplorer.com',
        nativeCurrency: { name: 'Sui', symbol: 'SUI', decimals: 9 },
        ecosystem: ['Cetus', 'DeepBook', 'Kriya'],
        features: ['Object-centric', 'Move smart contracts', 'Parallel execution'],
        tools: [
          {
            id: 'transfer_token',
            name: 'Transfer Tokens',
            description: 'Send SUI or custom tokens to any address',
            isEnabled: false,
            isRequired: true,
            usageCount: 234,
            parameters: {
              tokenSymbol: { type: 'string', required: true, description: 'Token symbol (e.g., SUI)' },
              amount: { type: 'number', required: true, description: 'Amount to transfer' },
              to: { type: 'string', required: true, description: 'Recipient address' }
            }
          },
          {
            id: 'stake_sui',
            name: 'Stake SUI',
            description: 'Stake SUI tokens with validators',
            isEnabled: false,
            usageCount: 89,
            parameters: {
              amount: { type: 'number', required: true, description: 'Amount of SUI to stake' },
              poolId: { type: 'string', required: true, description: 'Validator pool ID' }
            }
          },
          {
            id: 'unstake_sui',
            name: 'Unstake SUI',
            description: 'Withdraw staked SUI tokens',
            isEnabled: false,
            usageCount: 45,
            parameters: {
              stakedSuiId: { type: 'string', required: true, description: 'Staked SUI object ID' }
            }
          },
          {
            id: 'swap_tokens',
            name: 'Swap Tokens',
            description: 'Trade tokens on Cetus DEX',
            isEnabled: false,
            usageCount: 156,
            parameters: {
              fromToken: { type: 'string', required: true, description: 'Source token symbol' },
              toToken: { type: 'string', required: true, description: 'Destination token symbol' },
              amount: { type: 'number', required: true, description: 'Amount to swap' }
            }
          }
        ]
      },
      {
        chainId: 'evm:1',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '⟠',
        type: 'evm',
        status: 'available',
        description: 'The original smart contract platform and largest DeFi ecosystem',
        rpcUrl: 'https://eth.llamarpc.com',
        blockExplorer: 'https://etherscan.io',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        ecosystem: ['Uniswap', 'Aave', 'Compound', 'Lido'],
        features: ['Largest DeFi ecosystem', 'NFT marketplace', 'Layer 2 scaling'],
        tools: [
          {
            id: 'transfer_token',
            name: 'Transfer Tokens',
            description: 'Send ETH or ERC20 tokens',
            isEnabled: false,
            isRequired: true,
            usageCount: 445,
            parameters: {
              to: { type: 'string', required: true, description: 'Recipient address' },
              amount: { type: 'string', required: true, description: 'Amount to transfer' },
              tokenAddress: { type: 'string', required: false, description: 'ERC20 token address (leave empty for ETH)' }
            }
          },
          {
            id: 'swap_tokens',
            name: 'Swap Tokens',
            description: 'Trade tokens on Uniswap V3',
            isEnabled: false,
            usageCount: 287,
            parameters: {
              tokenIn: { type: 'string', required: true, description: 'Input token address' },
              tokenOut: { type: 'string', required: true, description: 'Output token address' },
              amount: { type: 'string', required: true, description: 'Amount to swap' },
              slippage: { type: 'number', required: false, description: 'Slippage tolerance (default: 0.5%)' }
            }
          },
          {
            id: 'stake_eth',
            name: 'Stake ETH',
            description: 'Stake ETH using Lido',
            isEnabled: false,
            usageCount: 67,
            parameters: {
              amount: { type: 'string', required: true, description: 'Amount of ETH to stake' },
              referral: { type: 'string', required: false, description: 'Referral address' }
            }
          },
          {
            id: 'defi_operations',
            name: 'DeFi Operations',
            description: 'Interact with Aave, Compound protocols',
            isEnabled: false,
            usageCount: 23,
            parameters: {
              protocol: { type: 'string', required: true, description: 'Protocol name (aave, compound)' },
              action: { type: 'string', required: true, description: 'Action (supply, borrow, repay, withdraw)' },
              asset: { type: 'string', required: true, description: 'Asset address' },
              amount: { type: 'string', required: true, description: 'Amount' }
            }
          }
        ]
      },
      {
        chainId: 'evm:137',
        name: 'Polygon',
        symbol: 'MATIC',
        icon: '⬟',
        type: 'evm',
        status: 'available',
        description: 'Low-cost Ethereum scaling solution with fast transactions',
        rpcUrl: 'https://polygon.llamarpc.com',
        blockExplorer: 'https://polygonscan.com',
        nativeCurrency: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
        ecosystem: ['QuickSwap', 'SushiSwap', 'Curve'],
        features: ['Low fees', 'Fast transactions', 'Ethereum compatibility'],
        tools: [
          {
            id: 'transfer_token',
            name: 'Transfer Tokens',
            description: 'Send MATIC or ERC20 tokens',
            isEnabled: false,
            isRequired: true,
            usageCount: 156,
            parameters: {
              to: { type: 'string', required: true, description: 'Recipient address' },
              amount: { type: 'string', required: true, description: 'Amount to transfer' },
              tokenAddress: { type: 'string', required: false, description: 'ERC20 token address (leave empty for MATIC)' }
            }
          },
          {
            id: 'swap_tokens',
            name: 'Swap Tokens',
            description: 'Trade tokens on QuickSwap',
            isEnabled: false,
            usageCount: 89,
            parameters: {
              tokenIn: { type: 'string', required: true, description: 'Input token address' },
              tokenOut: { type: 'string', required: true, description: 'Output token address' },
              amount: { type: 'string', required: true, description: 'Amount to swap' }
            }
          }
        ]
      },
      {
        chainId: 'evm:25',
        name: 'Cronos',
        symbol: 'CRO',
        icon: '🔷',
        type: 'evm',
        status: 'available',
        description: 'Crypto.com blockchain with EVM compatibility',
        rpcUrl: 'https://evm.cronos.org',
        blockExplorer: 'https://cronoscan.com',
        nativeCurrency: { name: 'Cronos', symbol: 'CRO', decimals: 18 },
        ecosystem: ['VVS Finance', 'Tectonic'],
        features: ['EVM compatible', 'Low fees', 'Crypto.com integration'],
        tools: [
          {
            id: 'transfer_token',
            name: 'Transfer Tokens',
            description: 'Send CRO or ERC20 tokens',
            isEnabled: false,
            isRequired: true,
            usageCount: 89,
            parameters: {
              to: { type: 'string', required: true, description: 'Recipient address' },
              amount: { type: 'string', required: true, description: 'Amount to transfer' },
              tokenAddress: { type: 'string', required: false, description: 'ERC20 token address (leave empty for CRO)' }
            }
          }
        ]
      }
    ];
  };

  const fetchUserToolSettings = async (userId: string): Promise<UserToolSettings> => {
    // Simulate API call - replace with actual Amplify query
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock user settings - replace with:
    // const { data } = await client.models.ToolSelection.list({
    //   filter: { userId: { eq: userId } }
    // });

    return {
      userId,
      selectedChainId: 'sui:mainnet', // Default to Sui
      toolSelections: {
        'transfer_token': true, // Required tools default to true
        'stake_sui': true,
        'unstake_sui': false,
        'swap_tokens': false
      }
    };
  };

  const handleChainSelect = async (chainId: string) => {
    const network = networks.find(n => n.chainId === chainId);
    if (network && network.status === 'available') {
      // Update user settings
      const newSettings: UserToolSettings = {
        ...userSettings!,
        selectedChainId: chainId,
        toolSelections: {} // Reset tool selections when changing chains
      };

      // Set required tools to enabled by default
      network.tools.forEach(tool => {
        if (tool.isRequired) {
          newSettings.toolSelections[tool.id] = true;
        }
      });

      setUserSettings(newSettings);

      // Update networks with new selections
      setNetworks(prev => prev.map(n => ({
        ...n,
        tools: n.tools.map(tool => ({
          ...tool,
          isEnabled: n.chainId === chainId
            ? (newSettings.toolSelections[tool.id] ?? tool.isRequired ?? false)
            : false
        }))
      })));

      setHasChanges(true);
    }
  };

  const handleToolToggle = (toolId: string) => {
    if (!userSettings) return;

    const newToolSelections = {
      ...userSettings.toolSelections,
      [toolId]: !userSettings.toolSelections[toolId]
    };

    const newSettings: UserToolSettings = {
      ...userSettings,
      toolSelections: newToolSelections
    };

    setUserSettings(newSettings);

    // Update networks with new selections
    setNetworks(prev => prev.map(network => {
      if (network.chainId === userSettings.selectedChainId) {
        return {
          ...network,
          tools: network.tools.map(tool => ({
            ...tool,
            isEnabled: tool.id === toolId
              ? !tool.isEnabled
              : tool.isEnabled
          }))
        };
      }
      return network;
    }));

    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!userSettings || !profile?.id) return;

    setSaving(true);
    try {
      // Save to your Amplify backend
      // This should save to ToolSelection model
      await saveUserToolSettings(profile.id, userSettings);
      setHasChanges(false);

      // Show success notification
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveUserToolSettings = async (userId: string, settings: UserToolSettings) => {
    // Simulate API call - replace with actual Amplify mutations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Implementation should be:
    // 1. Delete existing ToolSelection records for this user
    // 2. Create new ToolSelection records based on settings
    /*
    await Promise.all([
      // Delete existing selections
      ...existingSelections.map(selection => 
        client.models.ToolSelection.delete({ id: selection.id })
      ),
      // Create new selections
      ...Object.entries(settings.toolSelections).map(([toolName, isEnabled]) =>
        client.models.ToolSelection.create({
          userId,
          category: settings.selectedChainId.split(':')[0], // e.g., 'sui', 'evm'
          toolName,
          isEnabled
        })
      )
    ]);
    */
  };

  const selectedNetwork = networks.find(n => n.chainId === userSettings?.selectedChainId);
  const availableNetworks = networks.filter(n => n.status === 'available');
  const enabledTools = selectedNetwork?.tools.filter(tool => tool.isEnabled) || [];

  if (loading) {
    return <LoadingPage message="Loading your tool configuration..." />;
  }

  if (!profile?.id) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white mb-2">Authentication Required</h3>
        <p className="text-gray-400">Please sign in to configure your MCP tools</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Chain Selector Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Blockchain</h3>

          <div className="space-y-3">
            {availableNetworks.map((network) => (
              <ChainSelector
                key={network.chainId}
                network={network}
                isSelected={userSettings?.selectedChainId === network.chainId}
                onSelect={() => handleChainSelect(network.chainId)}
              />
            ))}
          </div>

          {/* Current Selection Summary */}
          {selectedNetwork && (
            <div className="mt-6 pt-4 border-t border-teal-800/50">
              <div className="text-sm text-teal-300 space-y-1">
                <div className="font-medium">{selectedNetwork.name}</div>
                <div>{enabledTools.length} tools enabled</div>
                <div className="text-xs text-teal-400">
                  API key will load these settings
                </div>
              </div>
            </div>
          )}

          {/* Config Export */}
          {selectedNetwork && enabledTools.length > 0 && (
            <div className="mt-4">
              <ConfigExporter
                selectedNetwork={selectedNetwork}
                enabledTools={enabledTools}
                // apiKeyNote="Your API key will automatically load these tool settings"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Network Header */}
          {selectedNetwork && (
            <div className="bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{selectedNetwork.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedNetwork.name}</h2>
                    <p className="text-teal-200">{selectedNetwork.description}</p>
                  </div>
                </div>

                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Active Chain
                </div>
              </div>

              {/* Tool Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-teal-300">Available Tools:</span>
                  <span className="text-white ml-2">{selectedNetwork.tools.length}</span>
                </div>
                <div>
                  <span className="text-teal-300">Enabled Tools:</span>
                  <span className="text-white ml-2">{enabledTools.length}</span>
                </div>
                <div>
                  <span className="text-teal-300">Native Token:</span>
                  <span className="text-white ml-2">{selectedNetwork.symbol}</span>
                </div>
                <div>
                  <span className="text-teal-300">Type:</span>
                  <span className="text-white ml-2 capitalize">{selectedNetwork.type}</span>
                </div>
              </div>

              {/* API Key Integration Note */}
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 <strong>Smart Configuration:</strong> Your API key automatically loads these tool settings.
                  No need to manually configure tools in your MCP client.
                </p>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          {selectedNetwork && (
            <ChainToolGrid
              network={selectedNetwork}
              onToolToggle={handleToolToggle}
            />
          )}

          {/* No Chain Selected */}
          {!selectedNetwork && (
            <div className="text-center py-12 bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-2">Select a Blockchain</h3>
              <p className="text-gray-400">
                Choose a blockchain from the sidebar to configure your MCP tools
              </p>
            </div>
          )}

          {/* Save Changes */}
          {hasChanges && (
            <div className="bg-yellow-900/50 border border-yellow-600/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-yellow-200 font-medium">Unsaved Changes</h3>
                  <p className="text-yellow-300 text-sm">
                    Save your configuration to update your API key settings
                  </p>
                </div>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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