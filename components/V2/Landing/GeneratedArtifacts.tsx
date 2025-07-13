"use client"

import React from 'react';
import { BarChart3, TrendingUp, Wallet, DollarSign, Users, Eye, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from "next/link";

const GeneratedArtifacts = () => {
    const artifacts = [
        {
            id: 1,
            title: "Vitalik's Wallet Portfolio",
            description: "Historical analysis of Vitalik Buterin's wallet holdings and transactions over the past year",
            type: "Portfolio Analysis",
            metrics: {
                totalValue: "$12.4M",
                tokens: "47 tokens",
                lastActive: "2 hours ago"
            },
            chart: {
                data: [65, 78, 82, 68, 95, 87, 91, 78, 85, 92, 88, 94],
                color: "emerald"
            },
            tags: ["Ethereum", "DeFi", "Historical"],
            creator: "0x742d...35Aa",
            likes: 234,
            views: 1847
        },
        {
            id: 2,
            title: "Aave Protocol TVL Trends",
            description: "Total Value Locked analysis across all Aave markets with yield projections and risk metrics",
            type: "TVL Dashboard",
            metrics: {
                totalValue: "$8.9B",
                apy: "4.23%",
                chains: "8 networks"
            },
            chart: {
                data: [45, 52, 58, 67, 71, 68, 75, 82, 79, 88, 91, 87],
                color: "blue"
            },
            tags: ["Aave", "TVL", "Multi-chain"],
            creator: "0x1a2b...9c8d",
            likes: 156,
            views: 923
        },
        {
            id: 3,
            title: "DEX Volume Comparison",
            description: "Real-time trading volume comparison across major DEXs with liquidity depth analysis",
            type: "Trading Analytics",
            metrics: {
                totalValue: "$2.1B",
                volume24h: "+12.4%",
                pairs: "1,247 pairs"
            },
            chart: {
                data: [38, 42, 55, 48, 61, 72, 69, 78, 85, 79, 88, 92],
                color: "purple"
            },
            tags: ["Uniswap", "SushiSwap", "Volume"],
            creator: "0x9f8e...4c3b",
            likes: 89,
            views: 642
        },
        {
            id: 4,
            title: "Layer 2 Gas Tracker",
            description: "Real-time gas price monitoring across Arbitrum, Optimism, and Polygon networks",
            type: "Gas Analytics",
            metrics: {
                avgGas: "0.12 gwei",
                savings: "94% vs L1",
                networks: "5 L2s"
            },
            chart: {
                data: [12, 8, 15, 9, 6, 11, 7, 14, 10, 5, 8, 9],
                color: "orange"
            },
            tags: ["L2", "Gas", "Arbitrum", "Optimism"],
            creator: "0x5e7f...2a1d",
            likes: 198,
            views: 1156
        },
        {
            id: 5,
            title: "NFT Floor Price Tracker",
            description: "Floor price movements for top 50 NFT collections with volume and holder analytics",
            type: "NFT Dashboard",
            metrics: {
                collections: "50 tracked",
                volume24h: "1.2K ETH",
                holders: "45.8K unique"
            },
            chart: {
                data: [28, 35, 42, 38, 51, 47, 55, 61, 58, 66, 72, 69],
                color: "pink"
            },
            tags: ["NFT", "Floor Price", "Collections"],
            creator: "0x3c4d...8e9f",
            likes: 127,
            views: 834
        },
        {
            id: 6,
            title: "Yield Farming Optimizer",
            description: "Auto-calculated optimal yield farming strategies across multiple protocols and chains",
            type: "DeFi Strategy",
            metrics: {
                bestAPY: "23.4%",
                protocols: "12 farms",
                risk: "Medium"
            },
            chart: {
                data: [15, 22, 28, 35, 31, 39, 45, 42, 48, 52, 49, 56],
                color: "green"
            },
            tags: ["Yield", "DeFi", "Strategy"],
            creator: "0x7b8c...5f6e",
            likes: 312,
            views: 2103
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            emerald: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-600",
                chart: "#10B981"
            },
            blue: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-600",
                chart: "#3B82F6"
            },
            purple: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-600",
                chart: "#8B5CF6"
            },
            orange: {
                bg: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-600",
                chart: "#F97316"
            },
            pink: {
                bg: "bg-pink-50",
                border: "border-pink-200",
                text: "text-pink-600",
                chart: "#EC4899"
            },
            green: {
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-600",
                chart: "#22C55E"
            }
        };
        return colors[color as keyof typeof colors];
    };

    const MiniChart = ({ data, color }: { data: number[], color: string }) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;

        return (
            <div className="flex items-end gap-1 h-8">
                {data.map((value, index) => {
                    const height = range === 0 ? 50 : ((value - min) / range) * 100;
                    return (
                        <div
                            key={index}
                            className={`w-1 rounded-sm ${getColorClasses(color)?.bg} opacity-70`}
                            style={{ height: `${Math.max(height, 10)}%` }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Generated Artifacts
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        See what insights others are discovering through conversation
                    </p>
                </div>

                {/* Artifacts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {artifacts.map((artifact) => {
                        const colorClasses = getColorClasses(artifact.chart.color);

                        return (
                            <div key={artifact.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses?.bg} ${colorClasses?.text}`}>
                                        {artifact.type}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {artifact.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {artifact.description}
                                </p>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {Object.entries(artifact.metrics).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                            <div className="text-sm font-semibold text-gray-900">{value}</div>
                                            <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mini Chart */}
                                <div className="mb-4">
                                    <MiniChart data={artifact.chart.data} color={artifact.chart.color} />
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {artifact.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>by {artifact.creator}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            ❤️ {artifact.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {artifact.views}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                        <BarChart3 className="w-4 h-4" />
                        Create Your Own Analytics
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        Join the community and start generating insights through conversation
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GeneratedArtifacts