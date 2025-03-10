"use client"

import React, { useState } from 'react';
import { ChevronDown, Zap, ArrowRight, Check } from 'react-feather';

const NewAgent = () => {

    const [selectedBlockchain, setSelectedBlockchain] = useState(null);
    const [selectedSDK, setSelectedSDK] = useState(null);
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');

    const blockchains: any = [
        { id: 'solana', name: 'Solana', icon: '◎', color: 'bg-purple-500' },
        { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', color: 'bg-blue-500' },
        { id: 'near', name: 'NEAR Protocol', icon: 'Ⓝ', color: 'bg-teal-500' },
        { id: 'aptos', name: 'Aptos', icon: '𝔸', color: 'bg-indigo-500' }
    ];

    const sdkOptions: any = {
        solana: [
            { id: 'agent-kit', name: 'Solana Agent Kit', description: 'Official Solana AI agent toolkit for on-chain activities' },
            { id: 'xray-sdk', name: 'X-Ray SDK', description: 'Enhanced toolkit with advanced transaction capabilities' },
            { id: 'custom', name: 'Custom Configuration', description: 'Manually configure agent capabilities and permissions' }
        ],
        ethereum: [
            { id: 'eth-agent', name: 'Ethereum Agent Kit', description: 'Standard agent toolkit for Ethereum blockchain' },
            { id: 'custom', name: 'Custom Configuration', description: 'Manually configure agent capabilities and permissions' }
        ],
        near: [
            { id: 'near-ai', name: 'NEAR AI Toolkit', description: 'Official NEAR Protocol AI agent development kit' }
        ],
        aptos: [
            { id: 'aptos-kit', name: 'Aptos Agent Kit', description: 'Aptos-native agent development toolkit' }
        ]
    };

    const handleBlockchainSelect = (blockchain: any) => {
        setSelectedBlockchain(blockchain);
        setSelectedSDK(null);
    };

    const handleSDKSelect = (sdk: any) => {
        setSelectedSDK(sdk);
    };

    const handleCreateAgent = () => {
        console.log('Creating agent with:', {
            name: agentName,
            description: agentDescription,
            blockchain: selectedBlockchain,
            sdk: selectedSDK
        });
    };

    return (
        <div className="relative mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
            <p className="text-gray-600 mb-8">Configure and deploy a new Web3 AI agent to your managed infrastructure.</p>

            {/* Agent Basic Info */}
            <div className="mb-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Agent Information</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Agent Name
                        </label>
                        <input
                            id="agent-name"
                            type="text"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="My Solana Agent"
                        />
                    </div>
                    <div>
                        <label htmlFor="agent-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            id="agent-description"
                            value={agentDescription}
                            onChange={(e) => setAgentDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="What will this agent do?"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Step 1: Select Blockchain */}
            <div className="mb-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Step 1: Select Blockchain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blockchains.map((blockchain:any) => (
                        <div
                            key={blockchain.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedBlockchain === blockchain.id
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                            onClick={() => handleBlockchainSelect(blockchain.id)}
                        >
                            <div className="flex items-center">
                                <div className={`w-10 h-10 ${blockchain.color} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                                    {blockchain.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium">{blockchain.name}</h3>
                                    {selectedBlockchain === blockchain.id && (
                                        <span className="text-blue-600 text-sm flex items-center">
                                            <Check size={16} className="mr-1" /> Selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 2: Select SDK */}
            {selectedBlockchain && (
                <div className="mb-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 2: Select SDK</h2>
                    <div className="space-y-3">
                        {sdkOptions[selectedBlockchain].map((sdk: any) => (
                            <div
                                key={sdk.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedSDK === sdk.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => handleSDKSelect(sdk.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{sdk.name}</h3>
                                        <p className="text-sm text-gray-600">{sdk.description}</p>
                                    </div>
                                    {selectedSDK === sdk.id ? (
                                        <Check size={20} className="text-blue-600" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Button */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Additional configuration can be done in the Automation tab after creation.
                </p>
                <button
                    onClick={handleCreateAgent}
                    disabled={!selectedBlockchain || !selectedSDK || !agentName}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium ${selectedBlockchain && selectedSDK && agentName
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Zap size={18} className="mr-2" />
                    Create Agent
                    <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        </div>
    )
}

export default NewAgent