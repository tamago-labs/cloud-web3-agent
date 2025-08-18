import React, { useState, useEffect, useContext } from 'react';
import { Wallet, Plus, Copy, AlertCircle } from 'lucide-react';
import { WalletInfo, supportedBlockchains } from './types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { AccountContext } from '@/contexts/account';
import { QRCodeComponent } from './QRCodeComponent';

const client = generateClient<Schema>();

interface WalletsTabProps {
    selectedBlockchain: string;
    setSelectedBlockchain: (blockchain: string) => void;
    wallets: Record<string, WalletInfo | null>;
    isCreatingWallet: boolean;
    onCreateWallet: () => void;
    onCopyToClipboard: (text: string) => void;
}

export const WalletsTab: React.FC<WalletsTabProps> = ({
    selectedBlockchain,
    setSelectedBlockchain,
    wallets,
    isCreatingWallet,
    onCreateWallet,
    onCopyToClipboard
}) => {
    const { profile } = useContext(AccountContext);
    const [realWallets, setRealWallets] = useState<Record<string, WalletInfo | null>>({});
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load user's existing wallets on component mount
    useEffect(() => {
        if (profile?.id) {
            loadUserWallets();
        }
    }, [profile]);

    const loadUserWallets = async () => {
        if (!profile?.id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const { data: userWallets } = await client.models.UserWallet.list({
                filter: {
                    userId: { eq: profile.id },
                    isActive: { eq: true }
                }
            });

            const walletsMap: Record<string, WalletInfo | null> = {};
            
            // Initialize all supported blockchains as null
            supportedBlockchains.forEach(blockchain => {
                walletsMap[blockchain.id] = null;
            });

            // Fill in existing wallets
            userWallets.forEach(wallet => {
                if (wallet.network && wallet.address) {
                    // Map the network from the database to our blockchain IDs
                    let blockchainId = wallet.network;
                    
                    // Handle EVM chains
                    if (wallet.network === 'evm') {
                        // For EVM, we need to determine which specific chain this is
                        // For now, we'll default to ethereum, but this could be enhanced
                        blockchainId = 'ethereum';
                    }

                    walletsMap[blockchainId] = {
                        address: wallet.address,
                        qrCode: wallet.address, // QR code will show the address
                        balance: '0.00', // TODO: Fetch real balance
                        network: wallet.network
                    };
                }
            });

            setRealWallets(walletsMap);
        } catch (err) {
            console.error('Error loading wallets:', err);
            setError('Failed to load wallets');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWallet = async () => {
        if (!profile?.id) {
            setError('Please log in to create a wallet');
            return;
        }

        setCreating(true);
        setError(null);

        try {
            const selectedChain = supportedBlockchains.find(chain => chain.id === selectedBlockchain);
            if (!selectedChain) {
                throw new Error('Invalid blockchain selected');
            }

            // Map our blockchain IDs to the backend's expected format
            let backendBlockchainId = selectedChain.chainType;
            
            // For EVM chains, use 'evm' as the network type
            if (selectedChain.chainType === 'evm') {
                backendBlockchainId = 'evm';
            }

            const { data: success } = await client.queries.CreateWallet({
                userId: profile.id,
                blockchain: backendBlockchainId
            });

            if (success) {
                // Reload wallets after successful creation
                await loadUserWallets();
            } else {
                throw new Error('Failed to create wallet');
            }
        } catch (err) {
            console.error('Error creating wallet:', err);
            setError(err instanceof Error ? err.message : 'Failed to create wallet');
        } finally {
            setCreating(false);
        }
    };

    const selectedWallet = realWallets[selectedBlockchain];
    const selectedChain = supportedBlockchains.find(chain => chain.id === selectedBlockchain);

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Web3 Wallets</h2>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading wallets...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Web3 Wallets</h2>
            <p className="text-gray-600">Manage your wallets for depositing tokens and interacting with Web3 protocols</p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <div className="flex gap-6">
                {/* Left side - Blockchain selection (30%) */}
                <div className="w-1/3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Blockchains</h3>
                    <div className="space-y-2">
                        {supportedBlockchains.map((blockchain) => (
                            <button
                                key={blockchain.id}
                                onClick={() => setSelectedBlockchain(blockchain.id)}
                                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                                    selectedBlockchain === blockchain.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <img 
                                    src={blockchain.icon} 
                                    alt={blockchain.name}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        // Fallback for broken images
                                        e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#e5e7eb"/><text x="16" y="20" text-anchor="middle" font-size="12" fill="#6b7280">${blockchain.symbol}</text></svg>`)}`;
                                    }}
                                />
                                <div className="text-left flex-1">
                                    <div className="font-medium">{blockchain.name}</div>
                                    <div className="text-sm text-gray-500">{blockchain.symbol}</div>
                                </div>
                                {realWallets[blockchain.id] && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side - Wallet information (70%) */}
                <div className="flex-1">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedChain?.name} Wallet
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedChain?.color}`}>
                                {selectedChain?.symbol}
                            </span>
                        </div>

                        {selectedWallet ? (
                            <div className="space-y-6">
                                {/* Wallet Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Wallet Address
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                                            {selectedWallet.address}
                                        </div>
                                        <button
                                            onClick={() => onCopyToClipboard(selectedWallet.address)}
                                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            title="Copy address"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Balance */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Balance
                                    </label>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {selectedWallet.balance} {selectedChain?.symbol}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Balance updates may take a few minutes
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        QR Code
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <QRCodeComponent value={selectedWallet.address} />
                                        <div className="text-sm text-gray-600">
                                            <p className="mb-2">Scan this QR code to send {selectedChain?.symbol} tokens to this wallet.</p>
                                            <p className="text-xs text-gray-500">
                                                {selectedChain?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        View Transactions
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Refresh Balance
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wallet className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    No {selectedChain?.name} Wallet
                                </h4>
                                <p className="text-gray-600 mb-6">
                                    Create a wallet to start depositing {selectedChain?.symbol} tokens and interact with {selectedChain?.name}
                                </p>
                                <button
                                    onClick={handleCreateWallet}
                                    disabled={creating}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Wallet...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Create {selectedChain?.name} Wallet
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
