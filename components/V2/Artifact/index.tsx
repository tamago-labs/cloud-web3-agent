"use client"

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeft, Heart, Share2, Download, Play, ExternalLink, Copy, Eye, Calendar, User, Code, RefreshCw, ChevronDown, FileText } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"

const ArtifactContainer = ({ artifactId }: any) => {

    const [loading, setLoading] = useState(true)
    const [isFavorited, setIsFavorited] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');
    const [artifactData, setArtifactData] = useState<any>(undefined)

    // Mock data - in real app, this would come from API
    const mockArtifacts: any = {
        "1": {
            id: 1,
            title: "Vitalik Buterin Portfolio Analysis",
            description: "Real-time tracking and analysis of Vitalik Buterin's wallet (vitalik.eth) showing token holdings, transaction patterns, and portfolio value over time. This comprehensive analysis tracks his DeFi activities, token swaps, and overall portfolio performance.",
            author: {
                name: "analyst_pro",
                avatar: "🧙‍♂️",
                verified: true
            },
            createdAt: "2024-07-10",
            updatedAt: "2 hours ago",
            category: "Wallet Analytics",
            chain: "Ethereum",
            tags: ["DeFi", "ETH", "Portfolio", "Whale"],
            metrics: {
                views: 1847,
                likes: 234,
                forks: 12
            },
            query: "Show me Vitalik's wallet portfolio breakdown by token value over the last 6 months with transaction frequency analysis",
            chartData: {
                portfolioValue: [
                    { date: '2024-01', value: 8200000, change: 0 },
                    { date: '2024-02', value: 9100000, change: 10.9 },
                    { date: '2024-03', value: 8800000, change: -3.3 },
                    { date: '2024-04', value: 10500000, change: 19.3 },
                    { date: '2024-05', value: 11200000, change: 6.7 },
                    { date: '2024-06', value: 12400000, change: 10.7 },
                    { date: '2024-07', value: 12100000, change: -2.4 }
                ],
                topHoldings: [
                    { token: 'ETH', value: 6650000, percentage: 55, change: '+2.3%', color: '#627EEA' },
                    { token: 'BTC', value: 3300000, percentage: 27, change: '+5.1%', color: '#F7931A' },
                    { token: 'USDC', value: 1200000, percentage: 10, change: '-0.2%', color: '#2775CA' },
                    { token: 'Others', value: 950000, percentage: 8, change: '+1.8%', color: '#9CA3AF' }
                ]
            }
        },
        "2": {
            id: 2,
            title: "Aave Protocol TVL Dashboard",
            description: "Real-time Total Value Locked tracking across all Aave markets with borrowing rates, protocol revenue, and risk assessment metrics.",
            author: {
                name: "defi_researcher",
                avatar: "📊",
                verified: true
            },
            createdAt: "2024-07-09",
            updatedAt: "4 hours ago",
            category: "Protocol Analytics",
            chain: "Multi-chain",
            tags: ["Aave", "TVL", "Lending", "DeFi"],
            metrics: {
                views: 923,
                likes: 156,
                forks: 8
            },
            query: "Analyze Aave's TVL trends across all markets with APY rates and protocol revenue breakdown",
            chartData: {
                portfolioValue: [
                    { date: 'Week 1', value: 7200000000, change: 0 },
                    { date: 'Week 2', value: 7800000000, change: 8.3 },
                    { date: 'Week 3', value: 8100000000, change: 3.8 },
                    { date: 'Week 4', value: 8900000000, change: 9.9 }
                ],
                topHoldings: [
                    { token: 'USDC', value: 3560000000, percentage: 40, change: '+1.2%', color: '#2775CA' },
                    { token: 'ETH', value: 2670000000, percentage: 30, change: '+3.1%', color: '#627EEA' },
                    { token: 'WBTC', value: 1780000000, percentage: 20, change: '+0.8%', color: '#F7931A' },
                    { token: 'Others', value: 890000000, percentage: 10, change: '+2.3%', color: '#9CA3AF' }
                ]
            }
        }
    };

    useEffect(() => {
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            const artifact = mockArtifacts[artifactId];
            setArtifactData(artifact)
            setLoading(false)
        }, 500)
    }, [artifactId])

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'Wallet Analytics':
                return 'from-blue-500 to-indigo-600';
            case 'Protocol Analytics':
                return 'from-green-500 to-emerald-600';
            case 'Trading Analytics':
                return 'from-purple-500 to-pink-600';
            case 'Infrastructure':
                return 'from-orange-500 to-red-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Wallet Analytics':
                return <BarChart3 className="w-6 h-6" />;
            case 'Protocol Analytics':
                return <TrendingUp className="w-6 h-6" />;
            default:
                return <BarChart3 className="w-6 h-6" />;
        }
    };

    const PortfolioChart = ({ data }: { data: any[] }) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const range = maxValue - minValue;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {artifactData?.category === 'Wallet Analytics' ? 'Portfolio Value Over Time' : 'TVL Over Time'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {artifactData?.category === 'Wallet Analytics' ? 'Total wallet value in USD' : 'Total Value Locked in USD'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-3 py-1"
                        >
                            <option value="1d">1D</option>
                            <option value="7d">7D</option>
                            <option value="30d">30D</option>
                            <option value="90d">90D</option>
                        </select>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-80 relative">
                    <svg className="w-full h-full" viewBox="0 0 800 300">
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                            </linearGradient>
                        </defs>
                        
                        {/* Grid */}
                        {[0, 60, 120, 180, 240, 300].map(y => (
                            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#F3F4F6" strokeWidth="1"/>
                        ))}

                        {/* Area */}
                        <path
                            d={`M 0,300 ${data.map((point, index) => {
                                const x = (index / (data.length - 1)) * 800;
                                const y = range === 0 ? 150 : ((maxValue - point.value) / range) * 240 + 30;
                                return `L ${x},${y}`;
                            }).join(' ')} L 800,300 Z`}
                            fill="url(#chartGradient)"
                        />

                        {/* Line */}
                        <polyline
                            points={data.map((point, index) => {
                                const x = (index / (data.length - 1)) * 800;
                                const y = range === 0 ? 150 : ((maxValue - point.value) / range) * 240 + 30;
                                return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                        />

                        {/* Data points */}
                        {data.map((point, index) => {
                            const x = (index / (data.length - 1)) * 800;
                            const y = range === 0 ? 150 : ((maxValue - point.value) / range) * 240 + 30;
                            return (
                                <g key={index}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="5"
                                        fill="#3B82F6"
                                        className="hover:r-7 cursor-pointer transition-all"
                                    />
                                    <text
                                        x={x}
                                        y="320"
                                        textAnchor="middle"
                                        className="text-xs fill-gray-500"
                                    >
                                        {point.date.split('-')[1] || point.date.split(' ')[1]}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Y-axis labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                            const value = minValue + (range * ratio);
                            const y = 270 - (ratio * 240);
                            const unit = value >= 1000000000 ? 'B' : 'M';
                            const displayValue = value >= 1000000000 ? (value / 1000000000).toFixed(1) : (value / 1000000).toFixed(1);
                            return (
                                <text
                                    key={index}
                                    x="-10"
                                    y={y}
                                    textAnchor="end"
                                    className="text-xs fill-gray-500"
                                >
                                    ${displayValue}{unit}
                                </text>
                            );
                        })}
                    </svg>
                </div>

                {/* Current Value */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                        ${data[data.length - 1]?.value >= 1000000000 
                            ? `${(data[data.length - 1]?.value / 1000000000).toFixed(1)}B` 
                            : `${(data[data.length - 1]?.value / 1000000).toFixed(1)}M`}
                    </div>
                    <div className={`text-sm font-medium ${
                        data[data.length - 1]?.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {data[data.length - 1]?.change >= 0 ? '+' : ''}{data[data.length - 1]?.change}% this period
                    </div>
                </div>
            </div>
        );
    };

    const HoldingsBreakdown = ({ holdings }: { holdings: any[] }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {artifactData?.category === 'Wallet Analytics' ? 'Token Holdings' : 'Asset Breakdown'}
            </h3>
            <div className="space-y-4">
                {holdings.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                                style={{ backgroundColor: holding.color }}
                            >
                                {holding.token.slice(0, 2)}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{holding.token}</div>
                                <div className="text-sm text-gray-500">{holding.percentage}% of {artifactData?.category === 'Wallet Analytics' ? 'portfolio' : 'TVL'}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium text-gray-900">
                                ${holding.value >= 1000000000 
                                    ? `${(holding.value / 1000000000).toFixed(1)}B` 
                                    : `${(holding.value / 1000000).toFixed(0)}M`}
                            </div>
                            <div className={`text-sm ${
                                holding.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {holding.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">

                {loading && (
                    <div className="bg-white border-b min-h-screen border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                            <div className="animate-pulse">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <div className="w-20 h-4 bg-gray-300 rounded"></div>
                                    <span>/</span>
                                    <div className="w-32 h-4 bg-gray-300 rounded"></div>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-xl bg-gray-300 flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-8 w-80 bg-gray-300 rounded" />
                                                <div className="h-4 w-full bg-gray-200 rounded" />
                                                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-80">
                                        <div className="bg-gray-100 rounded-xl p-6 space-y-4">
                                            <div className="h-12 bg-gray-300 rounded-lg"></div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="h-10 bg-gray-300 rounded-lg"></div>
                                                <div className="h-10 bg-gray-300 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && artifactData && (
                    <>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                                {/* Breadcrumb */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <Link href="/" className="hover:text-gray-700 flex items-center gap-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Browse Analytics
                                    </Link>
                                    <span>/</span>
                                    <span>{artifactData.title}</span>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Left: Artifact Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getCategoryGradient(artifactData.category)} flex items-center justify-center text-white flex-shrink-0`}>
                                                {getCategoryIcon(artifactData.category)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h1 className="text-3xl font-bold text-gray-900">{artifactData.title}</h1>
                                                </div>
                                                <p className="text-gray-600 mb-4">{artifactData.description}</p>
                                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {artifactData.author.name}
                                                        {artifactData.author.verified && <span className="text-blue-500">✓</span>}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Updated {artifactData.updatedAt}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {artifactData.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="lg:w-80 flex-shrink-0">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <div className="space-y-3">
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2">
                                                    <Play className="w-5 h-5" />
                                                    Fork Analysis
                                                </button>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <button
                                                        onClick={() => setIsFavorited(!isFavorited)}
                                                        className={`px-3 py-2 border rounded-lg transition-colors flex items-center justify-center gap-1 ${isFavorited
                                                            ? 'border-red-300 bg-red-50 text-red-600'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600' : ''}`} />
                                                        <span className="text-xs">Like</span>
                                                    </button>
                                                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                                        <Share2 className="w-4 h-4" />
                                                        <span className="text-xs">Share</span>
                                                    </button>
                                                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                                        <Download className="w-4 h-4" />
                                                        <span className="text-xs">Export</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Analytics Stats */}
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h3 className="font-medium text-gray-900 mb-3">Analytics</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            Views
                                                        </span>
                                                        <span className="font-medium">{artifactData.metrics.views}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            Likes
                                                        </span>
                                                        <span className="font-medium">{artifactData.metrics.likes}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 flex items-center gap-1">
                                                            <Play className="w-4 h-4" />
                                                            Forks
                                                        </span>
                                                        <span className="font-medium">{artifactData.metrics.forks}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {artifactData.tags.map((tag: string) => (
                                                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Data Source */}
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h3 className="font-medium text-gray-900 mb-3">Data Source</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Chain</span>
                                                        <span className="font-medium">{artifactData.chain}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Updated</span>
                                                        <span className="font-medium">{artifactData.updatedAt}</span>
                                                    </div>
                                                </div>
                                                <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                    <ExternalLink className="w-4 h-4" />
                                                    View on Explorer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="space-y-6">
                                {/* Original Query */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Code className="w-5 h-5" />
                                        Original Query
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700">
                                        "{artifactData.query}"
                                    </div>
                                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                        <Copy className="w-4 h-4" />
                                        Copy query
                                    </button>
                                </div>

                                {/* Main Chart */}
                                <PortfolioChart data={artifactData.chartData.portfolioValue} />

                                {/* Holdings Breakdown */}
                                <HoldingsBreakdown holdings={artifactData.chartData.topHoldings} />
                            </div>
                        </div>
                    </>
                )}

                {!loading && !artifactData && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artifact Not Found</h2>
                            <p className="text-gray-600 mb-6">The requested analytics artifact could not be found.</p>
                            <Link 
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse Analytics
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ArtifactContainer;