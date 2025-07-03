import React from 'react';
import { Clock, GitBranch, Star, Users, ArrowRight, Tag, TrendingUp, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers, Database, Globe, Cpu } from 'lucide-react';
import Link from "next/link";

// Recently Updated Section
const RecentlyAdded = () => {
    const recentServers = [
        {
            name: "Uniswap V4 Analytics",
            description: "Advanced analytics for Uniswap V4 hooks and concentrated liquidity positions",
            category: "Analytics",
            lastUpdated: "2 hours ago",
            updateType: "New Features",
            version: "v2.1.0",
            author: "DeFi Labs",
            stars: 89,
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-pink-500 to-rose-500",
            isNew: false
        },
        {
            name: "Solana MEV Scanner",
            description: "Real-time MEV opportunity detection and sandwich attack monitoring on Solana",
            category: "Trading",
            lastUpdated: "6 hours ago",
            updateType: "Bug Fixes",
            version: "v1.4.2",
            author: "SolDev Team",
            stars: 124,
            icon: <Zap className="w-5 h-5" />,
            color: "from-purple-500 to-violet-500",
            isNew: false
        },
        {
            name: "Cross-Chain Bridge Monitor",
            description: "Monitor bridge transactions and detect potential exploits across 15+ bridges",
            category: "Security",
            lastUpdated: "1 day ago",
            updateType: "New Release",
            version: "v3.0.0",
            author: "Bridge Security",
            stars: 156,
            icon: <Shield className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
            isNew: true
        },
        {
            name: "Ethereum Gas Optimizer",
            description: "AI-powered gas optimization suggestions and transaction timing recommendations",
            category: "Development",
            lastUpdated: "2 days ago",
            updateType: "Performance",
            version: "v1.8.1",
            author: "Gas Labs",
            stars: 203,
            icon: <Code className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
            isNew: false
        }
    ];

    return (
        <div className="py-20 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="text-center mb-16">
                     
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Recently Added
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Check out the latest MCP servers added to our platform
                    </p>
                </div>

                {/* Updates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentServers.map((server, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group relative">
                            
                            
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

                            {/* Update Info Tags */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                        {server.version}
                                    </span>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                                        {server.updateType}
                                    </span>
                                    {server.isNew && (
                                        <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">
                                            NEW
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>by {server.author}</span>
                                    <span>{server.lastUpdated}</span>
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

                {/* Mobile View All Button */}
                <div className="text-center mt-8 md:hidden">
                    <Link href="/updates" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        View All Updates
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecentlyAdded