
import React from 'react';
import { Database, Download, Globe, Star, ArrowRight, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers } from 'lucide-react';
import Link from "next/link";

 

// Online Hosted Servers Section
const OnlineHostedServers = () => {
    const servers = [
        {
            name: "DeFi Analytics",
            description: "Real-time DeFi protocol analysis, yield farming opportunities, and liquidity pool monitoring across major DEXs",
            category: "Analytics",
            author: "DeFi Labs",
            stars: 142,
            features: ["TVL Tracking", "Yield Calculation", "Impermanent Loss Analysis"],
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            name: "Multi-Chain Wallet",
            description: "Unified wallet operations across multiple blockchains with transaction history and portfolio tracking",
            category: "Wallet",
            author: "Wallet Team",
            stars: 98,
            features: ["Balance Queries", "Transaction History", "Multi-Chain Support"],
            icon: <Wallet className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Trading Assistant",
            description: "AI-powered trading signals, market analysis, and automated trading strategy recommendations",
            category: "Trading",
            author: "Trade AI",
            stars: 186,
            features: ["Price Analysis", "Signal Generation", "Risk Assessment"],
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-green-500 to-emerald-500"
        },
        {
            name: "Smart Contract Auditor",
            description: "Automated smart contract security analysis and vulnerability detection for Solidity and Move contracts",
            category: "Security",
            author: "Security Labs",
            stars: 234,
            features: ["Vulnerability Scan", "Gas Optimization", "Best Practices"],
            icon: <Shield className="w-5 h-5" />,
            color: "from-red-500 to-orange-500"
        },
        {
            name: "NFT Inspector",
            description: "Comprehensive NFT metadata analysis, rarity scoring, and collection insights across marketplaces",
            category: "NFT",
            author: "NFT Tools",
            stars: 67,
            features: ["Metadata Analysis", "Rarity Scoring", "Price History"],
            icon: <Layers className="w-5 h-5" />,
            color: "from-indigo-500 to-purple-500"
        },
        {
            name: "DevOps Deployer",
            description: "Streamlined smart contract deployment, testing frameworks, and CI/CD pipeline integration",
            category: "Development",
            author: "Dev Studio",
            stars: 156,
            features: ["Auto Deployment", "Test Generation", "CI/CD Integration"],
            icon: <Code className="w-5 h-5" />,
            color: "from-teal-500 to-blue-500"
        }
    ];

    const categories = ["All", "Analytics", "Wallet", "Trading", "Security", "NFT", "Development"];

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
               <div className="text-center mb-16">
                    {/*<div className="flex items-center justify-center mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Online Hosted Servers
                        </span>
                    </div>*/}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Online Hosted Servers
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Try any MCP server right in your browser, no setup needed
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                category === "All" 
                                    ? "bg-gray-900 text-white" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Server Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map((server, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group">
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
                                <div className="flex flex-wrap gap-1">
                                    {server.features.map((feature, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                            {feature}
                                        </span>
                                    ))}
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

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        View All MCP Servers
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default OnlineHostedServers