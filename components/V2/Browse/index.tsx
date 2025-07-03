"use client"

import React, { useState } from 'react';
import { Search, Filter, Star, ArrowRight, BarChart3, Wallet, DollarSign, Shield, Layers, Code, Database, Zap, Globe, Users, Clock, GitBranch } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"

const BrowseAllContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBlockchain, setSelectedBlockchain] = useState('All');
    const [sortBy, setSortBy] = useState('Popular');

    const categories = ['All', 'Analytics', 'Wallet', 'Trading', 'Security', 'NFT', 'Development', 'DeFi', 'Infrastructure'];
    const blockchains = ['All', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 'Base'];
    const sortOptions = ['Popular', 'Newest', 'Most Stars', 'Recently Updated', 'Name A-Z'];

    const allServers = [
        {
            name: "DeFi Analytics Pro",
            description: "Comprehensive DeFi protocol analysis with real-time TVL tracking, yield calculations, and risk assessment across 50+ protocols",
            category: "Analytics",
            author: "DeFi Labs",
            stars: 342,
            blockchain: "Ethereum",
            lastUpdated: "2 hours ago",
            version: "v2.1.0",
            features: ["TVL Tracking", "Yield Calculation", "Risk Assessment", "Multi-Protocol"],
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            isNew: false,
            isFeatured: true
        },
        {
            name: "Multi-Chain Wallet Manager",
            description: "Unified wallet operations across 15+ blockchains with portfolio tracking, transaction history, and balance monitoring",
            category: "Wallet",
            author: "Wallet Team",
            stars: 298,
            blockchain: "Multi-Chain",
            lastUpdated: "6 hours ago",
            version: "v3.2.1",
            features: ["Balance Queries", "Transaction History", "Multi-Chain Support", "Portfolio Tracking"],
            icon: <Wallet className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500",
            isNew: false,
            isFeatured: true
        },
        {
            name: "AI Trading Assistant",
            description: "Advanced AI-powered trading signals with market analysis, sentiment tracking, and automated strategy recommendations",
            category: "Trading",
            author: "Trade AI",
            stars: 486,
            blockchain: "Ethereum",
            lastUpdated: "1 day ago",
            version: "v1.8.3",
            features: ["Price Analysis", "Signal Generation", "Market Sentiment", "Strategy Optimization"],
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500",
            isNew: false,
            isFeatured: true
        },
        {
            name: "Smart Contract Security Scanner",
            description: "Automated vulnerability detection for Solidity contracts with gas optimization and best practice recommendations",
            category: "Security",
            author: "Security Labs",
            stars: 234,
            blockchain: "Ethereum",
            lastUpdated: "3 hours ago",
            version: "v2.0.1",
            features: ["Vulnerability Scan", "Gas Optimization", "Best Practices", "Automated Reports"],
            icon: <Shield className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            isNew: true,
            isFeatured: false
        },
        {
            name: "NFT Collection Analyzer",
            description: "Deep NFT analytics including rarity scoring, floor price tracking, and marketplace insights across major platforms",
            category: "NFT",
            author: "NFT Tools",
            stars: 167,
            blockchain: "Ethereum",
            lastUpdated: "1 day ago",
            version: "v1.5.2",
            features: ["Rarity Scoring", "Price Tracking", "Marketplace Data", "Collection Insights"],
            icon: <Layers className="w-5 h-5" />,
            color: "from-indigo-500 to-purple-500",
            isNew: false,
            isFeatured: false
        },
        {
            name: "Solana DevOps Suite",
            description: "Complete Solana development toolkit with automated deployment, testing frameworks, and performance monitoring",
            category: "Development",
            author: "Sol Builders",
            stars: 156,
            blockchain: "Solana",
            lastUpdated: "5 hours ago",
            version: "v2.3.0",
            features: ["Auto Deployment", "Test Generation", "Performance Monitoring", "CI/CD Integration"],
            icon: <Code className="w-5 h-5" />,
            color: "from-yellow-500 to-orange-500",
            isNew: true,
            isFeatured: false
        },
        {
            name: "Cross-Chain Bridge Monitor",
            description: "Real-time monitoring of cross-chain bridge transactions with security alerts and exploit detection across 20+ bridges",
            category: "Security",
            author: "Bridge Watch",
            stars: 289,
            blockchain: "Multi-Chain",
            lastUpdated: "4 hours ago",
            version: "v1.9.1",
            features: ["Bridge Monitoring", "Security Alerts", "Transaction Tracking", "Exploit Detection"],
            icon: <Globe className="w-5 h-5" />,
            color: "from-cyan-500 to-blue-500",
            isNew: false,
            isFeatured: false
        },
        {
            name: "Polygon Gas Optimizer",
            description: "Intelligent gas fee optimization for Polygon transactions with timing recommendations and cost predictions",
            category: "Infrastructure",
            author: "Gas Labs",
            stars: 123,
            blockchain: "Polygon",
            lastUpdated: "2 days ago",
            version: "v1.4.0",
            features: ["Gas Optimization", "Fee Prediction", "Timing Analysis", "Cost Savings"],
            icon: <Zap className="w-5 h-5" />,
            color: "from-purple-500 to-indigo-500",
            isNew: false,
            isFeatured: false
        }
    ];

    const filteredServers = allServers.filter(server => {
        const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            server.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || server.category === selectedCategory;
        const matchesBlockchain = selectedBlockchain === 'All' || server.blockchain === selectedBlockchain || server.blockchain === 'Multi-Chain';
        
        return matchesSearch && matchesCategory && matchesBlockchain;
    });

    const sortedServers = [...filteredServers].sort((a, b) => {
        switch (sortBy) {
            case 'Most Stars':
                return b.stars - a.stars;
            case 'Newest':
                return b.isNew ? 1 : -1;
            case 'Recently Updated':
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            case 'Name A-Z':
                return a.name.localeCompare(b.name);
            default: // Popular
                return (b.isFeatured ? 1000 : 0) + b.stars - ((a.isFeatured ? 1000 : 0) + a.stars);
        }
    });

    return (
        <>
        <Header bgColor="bg-white" />
<div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Browse All MCP Servers
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover and try powerful Model Context Protocol servers for your Web3 development workflow
                        </p>
                    </div>
 

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search MCP servers, features, or descriptions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
             
                <div className="max-w-7xl mx-auto   px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col  gap-8">
             
                    {/*<div className="  flex-shrink-0">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 top-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                           
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Blockchain</label>
                                <select
                                    value={selectedBlockchain}
                                    onChange={(e) => setSelectedBlockchain(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {blockchains.map(blockchain => (
                                        <option key={blockchain} value={blockchain}>{blockchain}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            </div>

                           
                        </div>
                    </div>*/}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Showing {sortedServers.length} of {allServers.length} MCP servers
                            </p>
                            <div className="text-sm text-gray-500">
                                {searchQuery && `Results for "${searchQuery}"`}
                            </div>
                        </div>

                        {/* Server Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedServers.map((server, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group relative">
                                    {/* Featured Badge */}
                                    {server.isFeatured && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                        </div>
                                    )}

                                    {/* New Badge */}
                                    {server.isNew && (
                                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                    )}
                                    
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${server.color} flex items-center justify-center text-white`}>
                                            {server.icon}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-700">{server.stars}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                {server.category}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                            {server.description}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {server.features.slice(0, 3).map((feature, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                                    {feature}
                                                </span>
                                            ))}
                                            {server.features.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                                    +{server.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>by {server.author}</span>
                                            <div className="flex items-center gap-2">
                                                <span>{server.blockchain}</span>
                                                <span>•</span>
                                                <span>{server.lastUpdated}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group">
                                            <span>Try Online</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <Link href={`/servers/${server.name.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                                            <span className="text-sm text-gray-600">Details</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {sortedServers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Database className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No servers found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search terms to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                        setSelectedBlockchain('All');
                                        setSortBy('Popular');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* Load More */}
                        {sortedServers.length > 0 && (
                            <div className="text-center mt-12">
                                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    Load More Servers
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div> 

            
        </div>
        </>
    );
};

export default BrowseAllContainer;