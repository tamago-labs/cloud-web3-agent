"use client"

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeft, Eye, Calendar, User, Globe, Clock, Database, Zap, Brain, Server, Wrench, Coffee } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header";
import { useArtifact } from '@/hooks/useArtifact';
import ChartView from '../ChartView';

const ArtifactContainer = ({ artifactId }: { artifactId: string }) => {
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

    const getTimeliness = (artifact: any) => {
        if (!artifact?.dataFreshness) return 'Unknown';
        const now = new Date();
        const freshness = new Date(artifact.dataFreshness);
        const diffHours = Math.abs(now.getTime() - freshness.getTime()) / (1000 * 60 * 60);

        if (diffHours < 1) return 'Real-time';
        if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const getDataQualityColor = (artifact: any) => {
        const accuracy = artifact?.dataValidation?.accuracy || 'medium';
        switch (accuracy) {
            case 'high': return 'bg-green-100 text-green-700 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
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

                        <div className="flex items-start gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getCategoryGradient(artifact.category)} flex items-center justify-center text-white flex-shrink-0`}>
                                {getCategoryIcon(artifact.category)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{artifact.title}</h1>
                                    {artifact.isPublic && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            Public
                                        </span>
                                    )} 
                                </div>
                                <p className="text-gray-600 mb-4">{artifact.description}</p>

                                {/* Metadata Row */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        Community User
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(artifact.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {artifact.views || 0} views
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                        {artifact.category}
                                    </span>
                                    {/* {artifact.likes !== undefined && (
                                        <span className="flex items-center gap-1">
                                            ❤️ {artifact.likes} likes
                                        </span>
                                    )} */}
                                </div>

                                {/* Blockchain Networks */}
                                {artifact.blockchainNetwork && artifact.blockchainNetwork.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {artifact.blockchainNetwork.map((network: string) => (
                                            <span key={network} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize border border-blue-200 flex items-center gap-1">
                                                <Globe className="w-3 h-3" />
                                                {network}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Data Quality & Freshness */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {artifact.dataValidation?.accuracy && (
                                        <span className={`px-3 py-1 text-sm rounded-full border ${getDataQualityColor(artifact)} flex items-center gap-1`}>
                                            <Database className="w-3 h-3" />
                                            {artifact.dataValidation.accuracy} quality
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {getTimeliness(artifact)}
                                    </span>
                                    {artifact.dataValidation?.timeliness && (
                                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full border border-orange-200 flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            {artifact.dataValidation.timeliness}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Current Value */}
                        {artifact.totalValue && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Current Value</p>
                                        <div className="text-3xl font-bold text-gray-900">
                                            {artifact.totalValue}
                                        </div>
                                    </div>
                                    {artifact.change && (
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                            <span className="font-semibold">{artifact.change}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
                                <div className="text-sm text-gray-500">
                                    {artifact.chartType && (
                                        <span className="capitalize">{artifact.chartType.replace('_', ' ')} Chart</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-96">
                                <ChartView
                                    data={artifact.data}
                                    chartType={artifact.chartType}
                                    trend={trend}
                                    height="h-full"
                                />
                            </div>
                        </div>

                        {/* Detailed Information Table */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Artifact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Data Points</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{artifact.data?.length || artifact.metadata?.dataPoints || 0}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Chart Type</dt>
                                        <dd className="text-lg font-semibold text-gray-900 capitalize">{artifact.chartType?.replace('_', ' ')}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{artifact.category}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Views</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{artifact.views || 0}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Visibility</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{artifact.isPublic ? 'Public' : 'Private'}</dd>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{new Date(artifact.createdAt).toLocaleDateString()}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                        <dd className="text-lg font-semibold text-gray-900">{new Date(artifact.updatedAt).toLocaleDateString()}</dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Data Freshness</dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {artifact.dataFreshness ? new Date(artifact.dataFreshness).toLocaleDateString() : 'Unknown'}
                                        </dd>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Data Quality</dt>
                                        <dd className="text-lg font-semibold text-gray-900 capitalize">
                                            {artifact.dataValidation?.accuracy || 'Not Validated'}
                                        </dd>
                                    </div>

                                    <div className="border-b border-gray-100 pb-3">
                                        <dt className="text-sm font-medium text-gray-500">Networks</dt>
                                        <dd className="text-lg font-semibold text-gray-900">
                                            {artifact.blockchainNetwork && artifact.blockchainNetwork.length > 0
                                                ? artifact.blockchainNetwork.join(', ')
                                                : 'Not specified'
                                            }
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* AI Generation & Tools Used Section */}
                            {artifact.metadata && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">Generation Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {artifact.metadata.aiGenerated && (
                                            <div className="bg-purple-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Coffee className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-900">AI Generated</span>
                                                </div>
                                                <p className="text-sm text-purple-700">This artifact was generated using AI analysis</p>
                                                {artifact.metadata.version && (
                                                    <p className="text-xs text-purple-600 mt-1">Version: {artifact.metadata.version}</p>
                                                )}
                                            </div>
                                        )}

                                        {artifact.metadata.serverNames && artifact.metadata.serverNames.length > 0 && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Server className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-900">Data Sources</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {artifact.metadata.serverNames.slice(0, 3).map((server: string, index: number) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                            {server}
                                                        </span>
                                                    ))}
                                                    {artifact.metadata.serverNames.length > 3 && (
                                                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded font-medium">
                                                            +{artifact.metadata.serverNames.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {artifact.metadata.toolsUsed && artifact.metadata.toolsUsed.length > 0 && (
                                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wrench className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-900">Tools Used</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {artifact.metadata.toolsUsed.slice(0, 4).map((tool: string, index: number) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                                                        {tool}
                                                    </span>
                                                ))}
                                                {artifact.metadata.toolsUsed.length > 4 && (
                                                    <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded font-medium">
                                                        +{artifact.metadata.toolsUsed.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            {artifact.tags && artifact.tags.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500 mb-3">Tags</dt>
                                    <div className="flex flex-wrap gap-2">
                                        {artifact.tags.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Query Information */}
                            {artifact.queryParameters?.notes && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500 mb-3">Original Query</dt>
                                    <dd className="text-gray-700 bg-gray-50 rounded-lg p-4 text-sm">
                                        {artifact.queryParameters.notes}
                                    </dd>
                                </div>
                            )}

                            {/* Conversation Context */}
                            {artifact.queryParameters?.conversationContext && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <dt className="text-sm font-medium text-gray-500 mb-3">Conversation Context</dt>
                                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                        {artifact.queryParameters.conversationContext.map((msg: any, index: number) => (
                                            <div key={index} className="mb-4 last:mb-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${msg.role === 'user'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {msg.role === 'user' ? 'User' : 'AI-Assistant'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">Message {index + 1}</span>
                                                </div>
                                                <div className={`p-3 rounded-lg border-l-4 ${msg.role === 'user'
                                                    ? 'bg-blue-50 border-l-blue-300'
                                                    : 'bg-green-50 border-l-green-300'
                                                    }`}>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {msg.content.length > 500
                                                            ? `${msg.content.substring(0, 500)}...`
                                                            : msg.content
                                                        }{`...`}
                                                    </p>
                                                    {msg.content.length > 500 && (
                                                        <button
                                                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                                                            onClick={() => {
                                                                const element = document.getElementById(`full-content-${index}`);
                                                                if (element) {
                                                                    element.style.display = element.style.display === 'none' ? 'block' : 'none';
                                                                }
                                                            }}
                                                        >
                                                            Show full content
                                                        </button>
                                                    )}
                                                    {msg.content.length > 500 && (
                                                        <div id={`full-content-${index}`} style={{ display: 'none' }} className="mt-2 pt-2 border-t border-gray-200">
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                {msg.content}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {artifact.queryParameters.conversationContext.length} message(s) in conversation
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArtifactContainer;