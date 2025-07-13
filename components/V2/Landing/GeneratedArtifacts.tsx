"use client"

import React from 'react';
import { TrendingUp, TrendingDown, Eye, Heart, ArrowUpRight } from 'lucide-react';
import Link from "next/link";

const GeneratedArtifacts = () => {
    const artifacts = [
        {
            id: 1,
            title: "Vitalik Buterin Wallet Analysis",
            description: "Portfolio tracking and transaction analysis for vitalik.eth",
            author: "analyst_pro",
            timeAgo: "2h",
            currentValue: "$12.4M",
            change: "+23.4%",
            trend: "up",
            chart: [65, 78, 82, 68, 95, 87, 91, 78, 85, 92, 88, 94],
            views: 1847,
            likes: 234
        },
        {
            id: 2,
            title: "Aave Protocol TVL Dashboard",
            description: "Real-time Total Value Locked across all Aave markets",
            author: "defi_researcher",
            timeAgo: "4h",
            currentValue: "$8.9B",
            change: "+8.1%",
            trend: "up",
            chart: [45, 52, 58, 67, 71, 68, 75, 82, 79, 88, 91, 87],
            views: 923,
            likes: 156
        },
        {
            id: 3,
            title: "DEX Volume Comparison",
            description: "Trading volume analysis across major DEXs",
            author: "trading_alpha",
            timeAgo: "6h",
            currentValue: "$2.1B",
            change: "+12.4%",
            trend: "up",
            chart: [38, 42, 55, 48, 61, 72, 69, 78, 85, 79, 88, 92],
            views: 642,
            likes: 89
        },
        {
            id: 4,
            title: "Layer 2 Gas Price Monitor",
            description: "Real-time gas tracking across L2 networks",
            author: "gas_tracker",
            timeAgo: "1d",
            currentValue: "0.12 gwei",
            change: "-15.2%",
            trend: "down",
            chart: [12, 8, 15, 9, 6, 11, 7, 14, 10, 5, 8, 9],
            views: 1156,
            likes: 198
        },
        {
            id: 5,
            title: "NFT Floor Price Tracker",
            description: "Floor price movements for top NFT collections",
            author: "nft_alpha",
            timeAgo: "1d",
            currentValue: "3.2 ETH",
            change: "+5.7%",
            trend: "up",
            chart: [28, 35, 42, 38, 51, 47, 55, 61, 58, 66, 72, 69],
            views: 834,
            likes: 127
        },
        {
            id: 6,
            title: "Yield Farming Optimizer",
            description: "Optimal yield strategies across DeFi protocols",
            author: "yield_hunter",
            timeAgo: "2d",
            currentValue: "23.4% APY",
            change: "+2.1%",
            trend: "up",
            chart: [15, 22, 28, 35, 31, 39, 45, 42, 48, 52, 49, 56],
            views: 2103,
            likes: 312
        }
    ];

    const MiniChart = ({ data, trend }: { data: number[], trend: string }) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;
        
        return (
            <div className="h-12 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <polyline
                        points={data.map((value, index) => {
                            const x = (index / (data.length - 1)) * 100;
                            const y = range === 0 ? 20 : ((max - value) / range) * 30 + 5;
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke={trend === 'up' ? '#10B981' : '#EF4444'}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>
        );
    };

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Community Analytics
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover insights created through conversation made by the community
                    </p>
                </div>

                {/* Artifacts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {artifacts.map((artifact) => (
                        <Link key={artifact.id} href={`/artifact/${artifact.id}`}>
                            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {artifact.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {artifact.description}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-2 flex-shrink-0" />
                                </div>

                                {/* Chart */}
                                <div className="mb-4">
                                    <MiniChart data={artifact.chart} trend={artifact.trend} />
                                </div>

                                {/* Value & Change */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {artifact.currentValue}
                                        </div>
                                        <div className={`text-sm font-medium flex items-center gap-1 ${
                                            artifact.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {artifact.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {artifact.change}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span>{artifact.author}</span>
                                        <span>•</span>
                                        <span>{artifact.timeAgo}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            {artifact.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {artifact.views}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Discover All Analytics
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        Explore the full collection of community insights
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GeneratedArtifacts