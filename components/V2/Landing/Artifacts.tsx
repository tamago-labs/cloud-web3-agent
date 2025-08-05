"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, ArrowUpRight } from 'lucide-react';
import Link from "next/link";
import { usePublicArtifacts } from '@/hooks/usePublicArtifacts';
import EmptyState from '@/components/UI/EmptyState';
import ChartView from '../ChartView';

const Artifacts = () => {
    const { artifacts, loading, error } = usePublicArtifacts({
        sortBy: 'popular',
        limit: 6
    });

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

    const getDataQualityColor = (artifact: any) => {
        const accuracy = artifact.dataValidation?.accuracy || 'medium';
        switch (accuracy) {
            case 'high': return 'bg-green-100 text-green-700 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Community Analytics
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover insights created through conversation made by the community
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">Failed to load analytics</p>
                        <p className="text-gray-500">Please try again later</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && artifacts.length === 0 && (
                    <EmptyState
                        title="No analytics yet"
                        description="Be the first to create and share an analytics chart with the community."
                        showCreateButton={true}
                    />
                )}

                {/* Analytics Grid */}
                {!loading && !error && artifacts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artifacts.slice(0, 6).map((artifact) => {
                            const trend = artifact.change?.startsWith('+') ? 'up' : 'down';

                            return (
                                <Link key={artifact.id} href={`/artifact/${artifact.id}`}>
                                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                                        {/* Chart */}
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
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
                                        <div className="p-6">
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
                                                    {artifact.blockchainNetwork.slice(0, 2).map((network: string) => (
                                                        <span key={network} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                                                            {network}
                                                        </span>
                                                    ))}
                                                    {artifact.blockchainNetwork.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                            +{artifact.blockchainNetwork.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Data Quality & Freshness */}
                                            <div className="flex items-center gap-2 mb-4">
                                                {artifact.dataValidation?.accuracy && (
                                                    <span className={`px-2 py-1 text-xs rounded-md border ${getDataQualityColor(artifact)}`}>
                                                        {artifact.dataValidation.accuracy} quality
                                                    </span>
                                                )}
                                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-200">
                                                    {getTimeliness(artifact)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-lg font-bold text-gray-900">
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
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {artifact.views || 0}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {artifact.category}
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

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        Discover All Analytics
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Artifacts;