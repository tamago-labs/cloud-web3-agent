"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Eye, Heart, ArrowUpRight } from 'lucide-react';

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
    const [sortBy, setSortBy] = useState('Popular');

    // Debounce search query to avoid excessive API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { artifacts, loading, error, refetch } = usePublicArtifacts({
        searchQuery: debouncedSearchQuery,
        category: categoryFilter === 'All' ? undefined : categoryFilter,
        sortBy: sortBy.toLowerCase() as 'popular' | 'recent' | 'liked',
        limit: 50
    });

    // Extract unique categories from artifacts for dynamic filtering
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        if (artifacts.length > 0) {
            const uniqueCategories = Array.from(new Set(
                artifacts
                    .map(artifact => artifact.category)
                    .filter(category => category && category.trim())
            )).sort();
            setCategories(['All', ...uniqueCategories]);
        }
    }, [artifacts]);



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
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                    Discover insights created through conversation made by the community
                                </p>
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
                        {loading ? (
                            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                        ) : (
                            <p className="text-gray-600">
                                {artifacts.length} analytics found
                            </p>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <ArtifactCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && artifacts.length === 0 && (
                        <EmptyState
                            title={searchQuery || categoryFilter !== 'All' ? "No analytics found" : "No analytics yet"}
                            description={searchQuery || categoryFilter !== 'All' 
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "Be the first to create and share an analytics chart with the community."
                            }
                            showCreateButton={true}
                        />
                    )}

                    {/* Analytics Grid */}
                    {!loading && artifacts.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-8">
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
                                                        <p className="text-gray-600 text-sm">
                                                            {artifact.description}
                                                        </p>
                                                    </div>
                                                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-3 flex-shrink-0" />
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
        </>
    );
};

export default DiscoverContainer;