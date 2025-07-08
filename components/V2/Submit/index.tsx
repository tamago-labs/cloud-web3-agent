"use client"

import React, { useState } from 'react';
import { AlertTriangle, Upload, Server, Code, Globe, Tag, Users, Github, ExternalLink, CheckCircle, X } from 'lucide-react';
import Header from "../Landing/Header"

const SubmitContainer = () => {

    const [formData, setFormData] = useState({
        serverName: '',
        description: '',
        githubUrl: '',
        npmPackage: '',
        category: '',
        tags: '',
        supportedChains: [],
        maintainerName: '',
        maintainerEmail: '',
        documentation: '',
        license: 'MIT',
        version: '1.0.0',
        features: '',
        requirements: '',
        installCommand: '',
        usageExample: ''
    });

    const [selectedChains, setSelectedChains] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const blockchainOptions = [
        'Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'Arbitrum', 'Optimism',
        'Base', 'Avalanche', 'BNB Chain', 'Cardano', 'Polkadot', 'Aptos',
        'Sui', 'Near', 'Cosmos', 'Tezos', 'Algorand', 'Cronos'
    ];

    const categoryOptions = [
        'DeFi Analytics', 'Portfolio Tracking', 'Transaction Analysis', 'Price Monitoring',
        'Wallet Management', 'NFT Tools', 'Governance', 'Staking', 'Bridge Tools',
        'Security', 'Developer Tools', 'Data Feeds', 'Trading Bots', 'Other'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChainToggle = (chain: string) => {
        setSelectedChains(prev => {
            const newSelection = prev.includes(chain)
                ? prev.filter(c => c !== chain)
                : [...prev, chain];

            setFormData((prevData: any) => ({
                ...prevData,
                supportedChains: newSelection
            }));

            return newSelection;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        alert('Server submitted successfully! We will review it and get back to you within 24-48 hours.');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <Header bgColor="bg-gray-50" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Submit Your MCP Server
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share your Web3 MCP server with the community and help others access blockchain data through AI conversations.
                    </p>
                </div>

                {/* Alert Banner */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                                Submission System Not Available Yet
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                The server submission system is currently under development. This form is for preview purposes only.
                                Please check back soon or contact us directly for urgent submissions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Server className="w-5 h-5 mr-2" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Server Name *
                                </label>
                                <input
                                    type="text"
                                    name="serverName"
                                    value={formData.serverName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Ethereum Portfolio Tracker"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe what your MCP server does, its key features, and how it helps users interact with blockchain data..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Code className="w-5 h-5 mr-2" />
                            Technical Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GitHub Repository *
                                </label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NPM Package
                                </label>
                                <input
                                    type="text"
                                    name="npmPackage"
                                    value={formData.npmPackage}
                                    onChange={handleInputChange}
                                    placeholder="@username/package-name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Version
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    placeholder="1.0.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License
                                </label>
                                <select
                                    name="license"
                                    value={formData.license}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="MIT">MIT</option>
                                    <option value="Apache-2.0">Apache 2.0</option>
                                    <option value="GPL-3.0">GPL 3.0</option>
                                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Install Command
                            </label>
                            <input
                                type="text"
                                name="installCommand"
                                value={formData.installCommand}
                                onChange={handleInputChange}
                                placeholder="npm install -g @username/package-name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Supported Blockchains */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            Supported Blockchains
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {blockchainOptions.map(chain => (
                                <label key={chain} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedChains.includes(chain)}
                                        onChange={() => handleChainToggle(chain)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{chain}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Features & Usage */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Features & Usage
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Key Features
                                </label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="List the main features of your MCP server..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Usage Example
                                </label>
                                <textarea
                                    name="usageExample"
                                    value={formData.usageExample}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Provide a sample conversation or usage example..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="API keys, dependencies, setup requirements..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maintainer Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Maintainer Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="maintainerName"
                                    value={formData.maintainerName}
                                    onChange={handleInputChange}
                                    placeholder="Your name or organization"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="maintainerEmail"
                                    value={formData.maintainerEmail}
                                    onChange={handleInputChange}
                                    placeholder="contact@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Tag className="w-5 h-5 mr-2" />
                            Additional Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="defi, portfolio, analytics, ethereum (comma-separated)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Documentation URL
                                </label>
                                <input
                                    type="url"
                                    name="documentation"
                                    value={formData.documentation}
                                    onChange={handleInputChange}
                                    placeholder="https://docs.example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            * Required fields
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Submit Server
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            

        </div>
    )
}

export default SubmitContainer