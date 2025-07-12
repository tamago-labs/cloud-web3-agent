"use client"

import React, { useContext, useEffect, useState } from 'react';
import { Search, Filter, Star, ArrowRight, BarChart3, Wallet, DollarSign, Shield, Layers, Code, Database, Zap, Globe, Users, Clock, GitBranch } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"

import ServerCard, { ServerCardSkeleton } from "../ServerCard"
import { ServerContext } from '@/contexts/server';

const BrowseAllContainer = () => {

    const { loadServers } = useContext(ServerContext)
    const [loading, setLoading] = useState(false)

    const [servers, setServers] = useState([])

    useEffect(() => {
        setLoading(true)
        loadServers().then(
            (data: any) => {
                setServers(data)
                setLoading(false)
            }
        )
    }, [])

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBlockchain, setSelectedBlockchain] = useState('All');
    const [sortBy, setSortBy] = useState('Popular');

    const filteredServers = servers.filter((server: any) => {
        const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            server.features.some((feature: any) => feature.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || server.category === selectedCategory;
        const matchesBlockchain = selectedBlockchain === 'All' || server.blockchain === selectedBlockchain || server.blockchain === 'Multi-Chain';

        return matchesSearch && matchesCategory && matchesBlockchain;
    });

    const sortedServers = [...filteredServers].sort((a: any, b: any) => {
        switch (sortBy) {
            case 'Most Stars':
                return b.stars - a.stars;
            case 'Name A-Z':
                return a.name.localeCompare(b.name);
            default: // Popular
                return (b.isFeatured ? 1000 : 0) + b.likeCount - ((a.isFeatured ? 1000 : 0) + a.likeCount);
        }
    });

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Browse All MCP Servers
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover and try powerful Model Context Protocol servers for your Web3 development workflow
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search MCP servers, features, or descriptions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto   px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col  gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-600">
                                    Showing {sortedServers.length} of {servers.length} MCP servers
                                </p>
                                <div className="text-sm text-gray-500">
                                    {searchQuery && `Results for "${searchQuery}"`}
                                </div>
                            </div>

                            {/* Server Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {!loading && sortedServers.map((server, index) => (
                                    <div key={index} >
                                        <ServerCard
                                            server={server}
                                        />
                                    </div>
                                ))}
                                {loading && (
                                    <>
                                        <ServerCardSkeleton />
                                        <ServerCardSkeleton />
                                        <ServerCardSkeleton />
                                    </>
                                )}
                            </div>

                            {/* No Results */}
                            {/* {sortedServers.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Database className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No servers found</h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your filters or search terms to find what you're looking for.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('All');
                                            setSelectedBlockchain('All');
                                            setSortBy('Popular');
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )} */}

                            {/* Load More */}
                            {/*{sortedServers.length > 0 && (
                                <div className="text-center mt-12">
                                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                        Load More Servers
                                    </button>
                                </div>
                            )}*/}
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default BrowseAllContainer;