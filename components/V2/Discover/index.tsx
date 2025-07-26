"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Eye, Heart, ArrowUpRight, Filter, X, Calendar, BarChart3, Database, Globe, User } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header";
import { usePublicArtifacts } from '@/hooks/usePublicArtifacts';
import { useDebounce } from '@/hooks/useDebounce';
import ArtifactCardSkeleton from '@/components/UI/ArtifactCardSkeleton';
import EmptyState from '@/components/UI/EmptyState';
import ChartView from '../ChartView';

const DiscoverContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [blockchainFilter, setBlockchainFilter] = useState<string[]>([]);
    const [freshnessFilter, setFreshnessFilter] = useState('All');
    const [chartTypeFilter, setChartTypeFilter] = useState('All');
    const [qualityFilter, setQualityFilter] = useState('All');
    const [authorFilter, setAuthorFilter] = useState('');
    const [sortBy, setSortBy] = useState('Popular');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Debounce search query to avoid excessive API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { artifacts, loading, error, refetch } = usePublicArtifacts({
        searchQuery: debouncedSearchQuery,
        category: categoryFilter === 'All' ? undefined : categoryFilter,
        blockchainNetwork: blockchainFilter.length > 0 ? blockchainFilter : undefined,
        dataFreshness: freshnessFilter === 'All' ? undefined : freshnessFilter,
        chartType: chartTypeFilter === 'All' ? undefined : chartTypeFilter,
        qualityFilter: qualityFilter === 'All' ? undefined : qualityFilter,
        sortBy: sortBy.toLowerCase() as 'popular' | 'recent' | 'liked',
        limit: 50
    });

    // Extract unique values for filters
    const [categories, setCategories] = useState<string[]>(['All']);
    const [availableBlockchains, setAvailableBlockchains] = useState<string[]>([]);
    const [availableChartTypes, setAvailableChartTypes] = useState<string[]>(['All']);

    useEffect(() => {
        if (artifacts.length > 0) {
            const uniqueCategories = Array.from(new Set(
                artifacts
                    .map(artifact => artifact.category)
                    .filter(category => category && category.trim())
            )).sort();
            setCategories(['All', ...uniqueCategories]);

            const uniqueBlockchains = Array.from(new Set(
                artifacts
                    .flatMap(artifact => artifact.blockchainNetwork || [])
                    .filter(network => network && network.trim())
            )).sort();
            setAvailableBlockchains(uniqueBlockchains);

            const uniqueChartTypes = Array.from(new Set(
                artifacts
                    .map(artifact => artifact.chartType)
                    .filter(type => type && type.trim())
            )).sort();
            setAvailableChartTypes(['All', ...uniqueChartTypes]);
        }
    }, [artifacts]);

    const handleBlockchainToggle = (blockchain: string) => {
        setBlockchainFilter(prev => 
            prev.includes(blockchain) 
                ? prev.filter(b => b !== blockchain)
                : [...prev, blockchain]
        );
    };

    const clearAllFilters = () => {
        setCategoryFilter('All');
        setBlockchainFilter([]);
        setFreshnessFilter('All');
        setChartTypeFilter('All');
        setQualityFilter('All');
        setAuthorFilter('');
        setSearchQuery('');
    };

    const getDataQualityColor = (artifact: any) => {
        const accuracy = artifact.dataValidation?.accuracy || 'medium';
        switch (accuracy) {
            case 'high': return 'bg-green-100 text-green-700 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTimeliness = (artifact: any) => {
        if (!artifact.dataFreshness) return 'Unknown';
        const now = new Date();
        const freshness = new Date(artifact.dataFreshness);
        const diffHours = Math.abs(now.getTime() - freshness.getTime()) / (1000 * 60 * 60);
        
        if (diffHours < 1) return 'Real-time';
        if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays}d ago`;
    };

    // Error state
    if (error) {
        return (
            <>
                <Header bgColor="bg-white" />
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <div className="text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    Discover Community Analytics
                                </h1>
                                <div className="text-center py-12">
                                    <p className="text-red-600 mb-4">Failed to load analytics</p>
                                    <button
                                        onClick={refetch}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

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
                                Explore insights created through conversations by the Web3 community
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
                            <div className="space-y-4 sticky top-4">
                                {/* Search Card */}
                                {!sidebarCollapsed && (
                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            Search
                                        </h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search analytics..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Filters Card */}
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        {!sidebarCollapsed && (
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                Filters
                                            </h3>
                                        )}
                                        <button
                                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Filter className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>

                                    {!sidebarCollapsed && (
                                        <>
                                            {/* Clear Filters */}
                                            <button
                                                onClick={clearAllFilters}
                                                className="w-full text-sm text-blue-600 hover:text-blue-800 mb-4 text-left"
                                            >
                                                Clear all filters
                                            </button>

                                            {/* Category Filter */}
                                            <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                                                <div className="space-y-2">
                                                    {categories.map((category) => (
                                                        <label key={category} className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="category"
                                                                checked={categoryFilter === category}
                                                                onChange={() => setCategoryFilter(category)}
                                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700">{category}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Blockchain Networks */}
                                            <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Networks</h4>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {availableBlockchains.map((blockchain) => (
                                                        <label key={blockchain} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={blockchainFilter.includes(blockchain)}
                                                                onChange={() => handleBlockchainToggle(blockchain)}
                                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700 capitalize">{blockchain}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Chart Type */}
                                            <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Chart Type</h4>
                                                <select
                                                    value={chartTypeFilter}
                                                    onChange={(e) => setChartTypeFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {availableChartTypes.map(type => (
                                                        <option key={type} value={type} className="capitalize">
                                                            {type === 'All' ? 'All Types' : type.replace('_', ' ')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Data Freshness */}
                                            {/* <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Data Freshness</h4>
                                                <select
                                                    value={freshnessFilter}
                                                    onChange={(e) => setFreshnessFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="All">All Time</option>
                                                    <option value="real-time">Real-time</option>
                                                    <option value="recent">Recent (24h)</option>
                                                    <option value="daily">Daily</option>
                                                    <option value="historical">Historical</option>
                                                </select>
                                            </div> */}

                                            {/* Data Quality */}
                                            {/* <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Data Quality</h4>
                                                <select
                                                    value={qualityFilter}
                                                    onChange={(e) => setQualityFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="All">All Quality</option>
                                                    <option value="high">High Quality</option>
                                                    <option value="medium">Medium Quality</option>
                                                    <option value="low">Low Quality</option>
                                                </select>
                                            </div> */}

                                            {/* Sort */}
                                            <div className="mb-6">
                                                <h4 className="font-medium text-gray-900 mb-2">Sort By</h4>
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="Popular">Most Popular</option>
                                                    <option value="Recent">Most Recent</option>
                                                    <option value="Liked">Most Liked</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex justify-between items-center mb-6">
                                {loading ? (
                                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                                ) : (
                                    <p className="text-gray-600">
                                        {artifacts.length} analytics found
                                        {searchQuery && ` for "${searchQuery}"`}
                                    </p>
                                )}

                                {/* Active Filters */}
                                <div className="flex flex-wrap gap-2">
                                    {categoryFilter !== 'All' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                                            {categoryFilter}
                                            <button onClick={() => setCategoryFilter('All')}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {blockchainFilter.map(blockchain => (
                                        <span key={blockchain} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                            {blockchain}
                                            <button onClick={() => handleBlockchainToggle(blockchain)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <ArtifactCardSkeleton key={index} />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && artifacts.length === 0 && (
                                <EmptyState
                                    title={searchQuery || categoryFilter !== 'All' || blockchainFilter.length > 0 ? "No analytics found" : "No analytics yet"}
                                    description={searchQuery || categoryFilter !== 'All' || blockchainFilter.length > 0 
                                        ? "Try adjusting your search or filters to find what you're looking for."
                                        : "Be the first to create and share an analytics chart with the community."
                                    }
                                    showCreateButton={true}
                                />
                            )}

                            {/* Analytics Grid */}
                            {!loading && artifacts.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {artifacts.map((artifact) => {
                                        const trend = artifact.change?.startsWith('+') ? 'up' : 'down';
                                        
                                        return (
                                            <Link key={artifact.id} href={`/artifact/${artifact.id}`}>
                                                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                                                    {/* Chart */}
                                                    <div className="p-4">
                                                        <div className="h-48">
                                                            <ChartView
                                                                data={artifact.data}
                                                                chartType={artifact.chartType}
                                                                trend={trend}
                                                                height="h-full"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6 pt-2">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                                    {artifact.title}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                                    {artifact.description}
                                                                </p>
                                                            </div>
                                                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-3 flex-shrink-0" />
                                                        </div>

                                                        {/* Blockchain Networks */}
                                                        {artifact.blockchainNetwork && artifact.blockchainNetwork.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {artifact.blockchainNetwork.slice(0, 3).map((network: string) => (
                                                                    <span key={network} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                                                                        {network}
                                                                    </span>
                                                                ))}
                                                                {artifact.blockchainNetwork.length > 3 && (
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                                        +{artifact.blockchainNetwork.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Data Quality & Freshness */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {artifact.dataValidation?.accuracy && (
                                                                <span className={`px-2 py-1 text-xs rounded-md border ${getDataQualityColor(artifact)}`}>
                                                                    {artifact.dataValidation.accuracy} quality
                                                                </span>
                                                            )}
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                                                                {getTimeliness(artifact)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="text-2xl font-bold text-gray-900">
                                                                    {artifact.totalValue || 'N/A'}
                                                                </div>
                                                                {artifact.change && (
                                                                    <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                                        {artifact.change}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Heart className="w-4 h-4" />
                                                                        {artifact.likes || 0}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Eye className="w-4 h-4" />
                                                                        {artifact.views || 0}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    {artifact.category} • {new Date(artifact.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiscoverContainer;