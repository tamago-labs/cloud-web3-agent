"use client"

import React, { useContext, useEffect, useState } from 'react';
import { LineChart, ImagePlus, Bitcoin, TerminalSquare, Star, Download, ExternalLink, Play, Copy, Check, GitBranch, Clock, Users, Shield, Zap, BarChart3, Code, Terminal, FileText, ChevronDown, ChevronUp, ArrowLeft, Heart, Share2, Flag } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"
import { ServerContext } from '@/contexts/server';

const ServerContainer = ({ serverId }: any) => {

    const { getServer } = useContext(ServerContext)

    const [loading, setLoading] = useState(true)
    const [isFavorited, setIsFavorited] = useState(false);
    const [ serverData, setServerData] = useState<any>(undefined)

    useEffect(() => {
        setLoading(true)
        getServer(serverId).then(
            (data:any) => {
                setServerData(data)
                setLoading(false)
            }
        )
    },[serverId])

    // Helper functions
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Analytics':
                return <LineChart className="w-6 h-6" />;
            case 'Tools':
            case 'Optimization':
                return <Zap className="w-6 h-6" />;
            case 'NFT':
                return <ImagePlus className="w-6 h-6" />;
            case 'Monitoring':
                return <Shield className="w-6 h-6" />;
            case 'Bitcoin':
                return <Bitcoin className="w-6 h-6" />;
            default:
                return <TerminalSquare className="w-6 h-6" />;
        }
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'Analytics':
                return 'from-blue-500 to-indigo-600';
            case 'Tools':
            case 'Optimization':
                return 'from-green-500 to-emerald-600';
            case 'NFT':
                return 'from-purple-500 to-pink-600';
            case 'Monitoring':
                return 'from-orange-500 to-red-600';
            case 'Bitcoin':
                return 'from-yellow-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };
 
    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">

                {loading && (
                    <div className="bg-white border-b min-h-screen border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                            <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
                                {/* Left: Server Info */}
                                <div className="flex-2">
                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Icon Placeholder */}
                                        <div className="w-16 h-16 rounded-xl bg-gray-300 flex-shrink-0" />

                                        {/* Info Block */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-48 bg-gray-300 rounded" /> 
                                            </div>

                                            <div className="h-4 w-full bg-gray-200 rounded" />
                                            <div className="h-4 w-5/6 bg-gray-200 rounded mb-4" />

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                                <div className="h-4 w-28 bg-gray-200 rounded" />
                                                <div className="h-5 w-20 bg-gray-100 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
                                        <div className="h-12 bg-gray-300 rounded-lg mb-3"></div>
                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            <div className="h-10 bg-gray-300 rounded-lg"></div>
                                            <div className="h-10 bg-gray-300 rounded-lg"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && serverData && (
                    <>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                                {/* Breadcrumb */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <Link href="/browse" className="hover:text-gray-700 flex items-center gap-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Browse All Servers
                                    </Link>
                                    <span>/</span>
                                    <span>{serverData.name}</span>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Left: Server Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getCategoryGradient(serverData.category)} flex items-center justify-center text-white flex-shrink-0`}>
                                                {getCategoryIcon(serverData.category)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h1 className="text-3xl font-bold text-gray-900">{serverData.name}</h1>
                                                    {serverData.isFeatured && (
                                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-4">{serverData.description}</p>
                                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                                    <span>by {serverData.author}</span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {serverData.category}
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
                                                    href="/client"
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Play className="w-5 h-5" />
                                                    Try Online Now
                                                </Link>
                                                {/* <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => setIsFavorited(!isFavorited)}
                                                        className={`px-3 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${isFavorited
                                                            ? 'border-red-300 bg-red-50 text-red-600'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600' : ''}`} />
                                                        <span className="text-sm">{isFavorited ? 'Saved' : 'Save'}</span>
                                                    </button>
                                                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                                        <Share2 className="w-4 h-4" />
                                                        <span className="text-sm">Share</span>
                                                    </button>
                                                </div> */}
                                            </div>

                                            {/* Quick Info - Real Data */}
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <h3 className="font-medium text-gray-900 mb-3">Quick Info</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Category</span>
                                                        <span className="font-medium">{serverData.category}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Author</span>
                                                        <span className="font-medium">{serverData.author}</span>
                                                    </div>
                                                    {serverData.supportedChains && serverData.supportedChains.length > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Chains</span>
                                                            <span className="font-medium">{serverData.supportedChains.length} supported</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Updated</span>
                                                        <span className="font-medium">{new Date(serverData.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Real Supported Chains */}
                                            {serverData.supportedChains && serverData.supportedChains.length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <h3 className="font-medium text-gray-900 mb-3">Supported Chains</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {serverData.supportedChains.map((chain: string, idx: number) => (
                                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                                                {chain.toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* External Links - Only if available */}
                                            {(serverData.repository || serverData.documentation || serverData.homepage) && (
                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <h3 className="font-medium text-gray-900 mb-3">Links</h3>
                                                    <div className="space-y-2">
                                                        {serverData.repository && (
                                                            <a href={serverData.repository} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                                <ExternalLink className="w-4 h-4" />
                                                                View Repository
                                                            </a>
                                                        )}
                                                        {serverData.documentation && (
                                                            <a href={serverData.documentation} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                                <FileText className="w-4 h-4" />
                                                                Documentation
                                                            </a>
                                                        )}
                                                        {serverData.homepage && (
                                                            <a href={serverData.homepage} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                                <ExternalLink className="w-4 h-4" />
                                                                Homepage
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simple About Section */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="bg-white rounded-xl border border-gray-200 p-8">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Server</h2>
                                        <p className="text-gray-600 leading-relaxed">{serverData.description}</p>
                                    </div>

                                    {serverData.features && serverData.features.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {serverData.features.map((feature: string, index: number) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Getting Started */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <p className="text-gray-600 mb-4">
                                                Ready to try {serverData.name}? Click the "Try Online Now" button above to start using this MCP server in our interactive chat interface.
                                            </p>
                                            <Link 
                                                href="/client"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Play className="w-4 h-4" />
                                                Try {serverData.name} Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!loading && !serverData && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Server Not Found</h2>
                            <p className="text-gray-600 mb-6">The requested MCP server could not be found.</p>
                            <Link 
                                href="/browse"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse All Servers
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ServerContainer;