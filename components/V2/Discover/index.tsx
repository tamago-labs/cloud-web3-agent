"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts';
import * as d3 from 'd3';
import Link from "next/link";
import Header from "../Landing/Header"
import ComingSoonModal from "@/components/modals/ComingSoonModal";

const DiscoverContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Popular');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal after 1 second on component mount
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const artifacts = [
        {
            id: 1,
            title: "Ethereum Top Token Holdings",
            description: "Distribution of top 10 tokens in Ethereum wallets",
            author: "defi_analyst",
            timeAgo: "2h",
            category: "Portfolio Analytics",
            currentValue: "$847.2B",
            change: "+12.4%",
            trend: "up",
            chartType: "pie",
            chart: [
                { name: "ETH", value: 65.2, color: "#627EEA" },
                { name: "USDC", value: 12.8, color: "#2775CA" },
                { name: "USDT", value: 8.9, color: "#26A17B" },
                { name: "WBTC", value: 5.1, color: "#F7931A" },
                { name: "DAI", value: 3.2, color: "#F5AC37" },
                { name: "Others", value: 4.8, color: "#6B7280" }
            ],
            views: 3247,
            likes: 567
        },
        {
            id: 2,
            title: "DeFi Protocol TVL Rankings",
            description: "Total Value Locked across major DeFi protocols",
            author: "tvl_tracker",
            timeAgo: "1h",
            category: "DeFi Analytics",
            currentValue: "$52.8B",
            change: "+8.7%",
            trend: "up",
            chartType: "bar",
            chart: [
                { name: "Aave", value: 12.4 },
                { name: "Uniswap", value: 9.8 },
                { name: "MakerDAO", value: 8.2 },
                { name: "Compound", value: 6.1 },
                { name: "Curve", value: 5.9 },
                { name: "Lido", value: 10.4 }
            ],
            views: 2847,
            likes: 423
        },
        {
            id: 3,
            title: "Bitcoin Mining Pool Distribution",
            description: "Hash rate distribution among mining pools",
            author: "btc_miner",
            timeAgo: "30min",
            category: "Bitcoin Analytics",
            currentValue: "421 EH/s",
            change: "+3.2%",
            trend: "up",
            chartType: "donut",
            chart: [
                { name: "Foundry USA", value: 28.5, color: "#F97316" },
                { name: "AntPool", value: 22.1, color: "#EF4444" },
                { name: "F2Pool", value: 15.8, color: "#3B82F6" },
                { name: "Binance Pool", value: 12.4, color: "#FBBF24" },
                { name: "ViaBTC", value: 9.2, color: "#10B981" },
                { name: "Others", value: 12.0, color: "#6B7280" }
            ],
            views: 1923,
            likes: 234
        },
        {
            id: 4,
            title: "Gas Price Trends (7 Days)",
            description: "Ethereum gas price fluctuations over the past week",
            author: "gas_tracker",
            timeAgo: "15min",
            category: "Gas Analytics",
            currentValue: "23.4 gwei",
            change: "-15.2%",
            trend: "down",
            chartType: "area",
            chart: [
                { time: "Mon", price: 45.2 },
                { time: "Tue", price: 38.7 },
                { time: "Wed", price: 42.1 },
                { time: "Thu", price: 35.6 },
                { time: "Fri", price: 28.9 },
                { time: "Sat", price: 31.2 },
                { time: "Sun", price: 23.4 }
            ],
            views: 4156,
            likes: 312
        },
        {
            id: 5,
            title: "Cross-Chain Bridge Volume",
            description: "24h volume across major blockchain bridges",
            author: "bridge_monitor",
            timeAgo: "3h",
            category: "Cross-Chain Analytics",
            currentValue: "$1.2B",
            change: "+24.8%",
            trend: "up",
            chartType: "horizontal_bar",
            chart: [
                { name: "Arbitrum Bridge", value: 285.4 },
                { name: "Polygon Bridge", value: 234.7 },
                { name: "Optimism Bridge", value: 189.2 },
                { name: "Base Bridge", value: 156.8 },
                { name: "Avalanche Bridge", value: 142.3 },
                { name: "Polygon zkEVM", value: 98.6 }
            ],
            views: 2134,
            likes: 289
        },
        {
            id: 6,
            title: "NFT Market Cap by Chain",
            description: "NFT market capitalization distribution across blockchains",
            author: "nft_analyst",
            timeAgo: "4h",
            category: "NFT Analytics",
            currentValue: "$12.8B",
            change: "+18.5%",
            trend: "up",
            chartType: "pie",
            chart: [
                { name: "Ethereum", value: 78.2, color: "#627EEA" },
                { name: "Solana", value: 12.4, color: "#00D18C" },
                { name: "Polygon", value: 4.8, color: "#8247E5" },
                { name: "Arbitrum", value: 2.1, color: "#28A0F0" },
                { name: "Base", value: 1.7, color: "#0052FF" },
                { name: "Others", value: 0.8, color: "#6B7280" }
            ],
            views: 1789,
            likes: 456
        },
        {
            id: 7,
            title: "Aptos DeFi Pool Analytics",
            description: "Liquidity pool performance on Aptos ecosystem",
            author: "aptos_explorer",
            timeAgo: "5h",
            category: "Aptos Analytics",
            currentValue: "$420M",
            change: "+22.1%",
            trend: "up",
            chartType: "bar",
            chart: [
                { name: "PancakeSwap", value: 89.4 },
                { name: "Liquidswap", value: 156.8 },
                { name: "Thala", value: 98.2 },
                { name: "Aries Markets", value: 45.7 },
                { name: "Hippo", value: 29.9 }
            ],
            views: 756,
            likes: 189
        },
        {
            id: 8,
            title: "Whale Wallet Activity (24h)",
            description: "Large transaction movements tracked across networks",
            author: "whale_watcher",
            timeAgo: "1h",
            category: "Whale Analytics",
            currentValue: "$2.8B",
            change: "+35.4%",
            trend: "up",
            chartType: "area",
            chart: [
                { time: "00:00", price: 1.2 },
                { time: "04:00", price: 1.8 },
                { time: "08:00", price: 2.1 },
                { time: "12:00", price: 2.6 },
                { time: "16:00", price: 2.9 },
                { time: "20:00", price: 2.5 },
                { time: "24:00", price: 2.8 }
            ],
            views: 3421,
            likes: 678
        }
    ];

    const categories = ["All", "Portfolio Analytics", "DeFi Analytics", "Gas Analytics", "Bitcoin Analytics", "NFT Analytics", "Cross-Chain Analytics", "Aptos Analytics", "Whale Analytics"];

    const filteredArtifacts = artifacts.filter(artifact => {
        const matchesSearch = artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artifact.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || artifact.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const sortedArtifacts = [...filteredArtifacts].sort((a, b) => {
        switch (sortBy) {
            case 'Popular':
                return b.views - a.views;
            case 'Recent':
                return 0;
            case 'Liked':
                return b.likes - a.likes;
            default:
                return 0;
        }
    });

    const ProfessionalChart = ({ data, chartType, trend }: { data: any[], chartType: string, trend: string }) => {
        const trendColor = trend === 'up' ? '#10B981' : '#EF4444';

        if (chartType === 'pie') {
            return (
                <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <ResponsiveContainer width="90%" height="90%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => [`${value}%`, 'Share']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                fontSize={12}
                                wrapperStyle={{ paddingTop: '10px' }}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'donut') {
            return (
                <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <ResponsiveContainer width="90%" height="90%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => [`${value}%`, 'Share']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                fontSize={12}
                                wrapperStyle={{ paddingTop: '10px' }}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'bar') {
            return (
                <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar data={data}>
                            <XAxis
                                dataKey="name"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}B`}
                            />
                            <Tooltip
                                formatter={(value: any) => [`$${value}B`, 'TVL']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                            />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'area') {
            return (
                <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={trendColor} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${value} gwei`}
                            />
                            <Tooltip
                                formatter={(value: any) => [`${value} gwei`, 'Gas Price']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={trendColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'horizontal_bar') {
            return (
                <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar
                            data={data}
                            layout="horizontal"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis
                                type="number"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}M`}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value: any) => [`$${value}M`, 'Volume']}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#8B5CF6"
                                radius={[0, 4, 4, 0]}
                            />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        // Default line chart
        return (
            <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="time"
                            fontSize={12}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            fontSize={12}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor}
                            strokeWidth={3}
                            dot={{ fill: trendColor, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Discover Community Analytics
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Discover insights created through conversation made by the community
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search analytics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setCategoryFilter(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === categoryFilter
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="md:ml-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                            >
                                <option value="Popular">Most Popular</option>
                                <option value="Recent">Most Recent</option>
                                <option value="Liked">Most Liked</option>
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            {sortedArtifacts.length} analytics found
                        </p>
                    </div>

                    {/* Analytics Grid - 2 columns */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {sortedArtifacts.map((artifact) => (
                            <div key={artifact.id} onClick={() => setShowModal(true)}>
                                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                                    {/* Chart */}
                                    <div className="p-4">
                                        <ProfessionalChart
                                            data={artifact.chart}
                                            chartType={artifact.chartType}
                                            trend={artifact.trend}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-2">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                    {artifact.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {artifact.description}
                                                </p>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-3 flex-shrink-0" />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {artifact.currentValue}
                                                </div>
                                                <div className={`text-sm font-medium flex items-center gap-1 ${artifact.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {artifact.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    {artifact.change}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" />
                                                        {artifact.likes}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        {artifact.views}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    by {artifact.author} • {artifact.timeAgo}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {sortedArtifacts.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics found</h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search or filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('All');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Coming Soon Modal */}
            <ComingSoonModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default DiscoverContainer