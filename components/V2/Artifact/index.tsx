"use client"

import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeft, Heart, Share2, Download, Play, ExternalLink, Copy, Eye, Calendar, User, Code, RefreshCw, ChevronDown, FileText } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts';
import Link from "next/link";
import Header from "../Landing/Header";
import { useArtifact } from '@/hooks/useArtifact';

const ArtifactContainer = ({ artifactId }: { artifactId: string }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');
    
    const { artifact, loading, error, refetch } = useArtifact(artifactId);

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'Portfolio Analytics':
                return 'from-blue-500 to-indigo-600';
            case 'DeFi Analytics':
                return 'from-green-500 to-emerald-600';
            case 'Gas Analytics':
                return 'from-purple-500 to-pink-600';
            case 'Bitcoin Analytics':
                return 'from-orange-500 to-red-600';
            case 'NFT Analytics':
                return 'from-pink-500 to-rose-600';
            case 'Cross-Chain Analytics':
                return 'from-cyan-500 to-blue-600';
            case 'Aptos Analytics':
                return 'from-teal-500 to-green-600';
            case 'Whale Analytics':
                return 'from-indigo-500 to-purple-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Portfolio Analytics':
            case 'DeFi Analytics':
            case 'Gas Analytics':
            case 'Bitcoin Analytics':
            case 'NFT Analytics':
            case 'Cross-Chain Analytics':
            case 'Aptos Analytics':
            case 'Whale Analytics':
                return <BarChart3 className="w-6 h-6" />;
            default:
                return <BarChart3 className="w-6 h-6" />;
        }
    };

    const ProfessionalChart = ({ data, chartType, trend }: { data: any[], chartType: string, trend: string }) => {
        const trendColor = trend === 'up' ? '#10B981' : '#EF4444';

        if (chartType === 'pie') {
            return (
                <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={120}
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
                                height={60}
                                fontSize={14}
                                wrapperStyle={{ paddingTop: '20px' }}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'donut') {
            return (
                <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
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
                                height={60}
                                fontSize={14}
                                wrapperStyle={{ paddingTop: '20px' }}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'bar') {
            return (
                <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar data={data}>
                            <XAxis
                                dataKey="name"
                                fontSize={14}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                fontSize={14}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}B`}
                            />
                            <Tooltip
                                formatter={(value: any) => [`$${value}B`, 'Value']}
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
                                radius={[6, 6, 0, 0]}
                            />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'area') {
            return (
                <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
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
                                fontSize={14}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                fontSize={14}
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
                <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar
                            data={data}
                            layout="horizontal"
                            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                            <XAxis
                                type="number"
                                fontSize={14}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}M`}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                                width={90}
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
                                radius={[0, 6, 6, 0]}
                            />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        // Default line chart
        return (
            <div className="h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="time"
                            fontSize={14}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            fontSize={14}
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

    // Loading State
    if (loading) {
        return (
            <>
                <Header bgColor="bg-white" />
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-white border-b border-gray-200">
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
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="h-10 bg-gray-300 rounded-lg"></div>
                                                <div className="h-10 bg-gray-300 rounded-lg"></div>
                                                <div className="h-10 bg-gray-300 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <Header bgColor="bg-white" />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Artifact</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={refetch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link 
                                    href="/discover"
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Browse Analytics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Not Found State
    if (!artifact) {
        return (
            <>
                <Header bgColor="bg-white" />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artifact Not Found</h2>
                            <p className="text-gray-600 mb-6">The requested analytics artifact could not be found.</p>
                            <Link 
                                href="/discover"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse Analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const trend = artifact.change?.startsWith('+') ? 'up' : 'down';

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                            <Link href="/discover" className="hover:text-gray-700 flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" />
                                Browse Analytics
                            </Link>
                            <span>/</span>
                            <span>{artifact.title}</span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left: Artifact Info */}
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getCategoryGradient(artifact.category)} flex items-center justify-center text-white flex-shrink-0`}>
                                        {getCategoryIcon(artifact.category)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold text-gray-900">{artifact.title}</h1>
                                        </div>
                                        <p className="text-gray-600 mb-4">{artifact.description}</p>
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Community User
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(artifact.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                {artifact.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="lg:w-80 flex-shrink-0">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="space-y-3">
                                        <Link 
                                            href="/chat"
                                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-5 h-5" />
                                            Create Similar Analysis
                                        </Link>
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
                                                <span className="font-medium">{artifact.views || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <Heart className="w-4 h-4" />
                                                    Likes
                                                </span>
                                                <span className="font-medium">{artifact.likes || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <BarChart3 className="w-4 h-4" />
                                                    Type
                                                </span>
                                                <span className="font-medium capitalize">{artifact.chartType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {artifact.tags && artifact.tags.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {artifact.tags.map((tag: string) => (
                                                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Current Value */}
                                    {artifact.totalValue && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h3 className="font-medium text-gray-900 mb-3">Current Value</h3>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                                {artifact.totalValue}
                                            </div>
                                            {artifact.change && (
                                                <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    {artifact.change}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Main Chart */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{artifact.title}</h3>
                                    <p className="text-sm text-gray-500">Interactive chart visualization</p>
                                </div>
                                {artifact.isPublic && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        Public
                                    </span>
                                )}
                            </div>
                            
                            <ProfessionalChart
                                data={artifact.data}
                                chartType={artifact.chartType}
                                trend={trend}
                            />
                        </div>

                        {/* Data Summary */}
                        {artifact.data && artifact.data.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Data Points</div>
                                        <div className="text-2xl font-bold text-gray-900">{artifact.data.length}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Chart Type</div>
                                        <div className="text-2xl font-bold text-gray-900 capitalize">{artifact.chartType}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Category</div>
                                        <div className="text-lg font-bold text-gray-900">{artifact.category}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Created</div>
                                        <div className="text-lg font-bold text-gray-900">{new Date(artifact.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArtifactContainer;