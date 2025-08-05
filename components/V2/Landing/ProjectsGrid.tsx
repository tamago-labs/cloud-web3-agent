"use client"

import { useState, useMemo } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, MessageSquare, BarChart3, DollarSign, Zap, Star, Users, Activity } from 'lucide-react';
import Link from "next/link";

// Mock MCP server data
const mockProjects = [
    {
        id: 'aave',
        name: 'Aave Agent',
        logo: '🏦',
        category: 'Lending',
        description: 'MCP server for Aave protocol with lending analytics, liquidation monitoring, and yield optimization',
        tvl: '$12.4B',
        tvlChange: '+2.3%',
        apy: '4.2%',
        volume24h: '$890M',
        chains: ['ethereum', 'polygon', 'arbitrum', 'avalanche'],
        isFeatured: true,
        trending: true,
        tools: 15,
        projects: ['Aave V2', 'Aave V3'],
        metrics: {
            borrowRate: '5.8%',
            utilization: '68%',
            totalBorrowed: '$8.4B'
        }
    },
    {
        id: 'uniswap',
        name: 'Uniswap Agent',
        logo: '🦄',
        category: 'DEX',
        description: 'MCP server for Uniswap with pool analytics, fee tracking, and LP position management',
        tvl: '$4.8B',
        tvlChange: '+1.8%',
        apy: '0.3%',
        volume24h: '$1.2B',
        chains: ['ethereum', 'polygon', 'arbitrum', 'base'],
        isFeatured: true,
        trending: true,
        tools: 12,
        projects: ['Uniswap V2', 'Uniswap V3'],
        metrics: {
            fees24h: '$3.6M',
            pools: '4,200+',
            activeLP: '156K'
        }
    },
    {
        id: 'cronos',
        name: 'Cronos Agent',
        logo: '⭐',
        category: 'Multi-Chain',
        description: 'MCP server for Cronos EVM, zkEVM with 20+ MCP tools covering balance analytics, transaction analysis and DeFi like VVS Finance',
        tvl: '$2.1B',
        tvlChange: '+4.2%',
        apy: '8.5%',
        volume24h: '$156M',
        chains: ['cronos', 'cronos-zkevm'],
        isFeatured: true,
        trending: true,
        tools: 20,
        projects: ['VVS Finance', 'Cronos Bridge', 'MMF'],
        metrics: {
            protocols: '15+',
            dailyTx: '45K',
            tvlGrowth: '+4.2%'
        }
    },
    {
        id: 'aptos-index',
        name: 'Aptos Index Node',
        logo: '🔗',
        category: 'Infrastructure',
        description: 'Provides structured Aptos blockchain data by indexing coin activity, liquidity pools, and DeFi protocol interactions for analytics use',
        tvl: 'N/A',
        tvlChange: 'N/A',
        apy: 'N/A',
        volume24h: '$45M',
        chains: ['aptos'],
        isFeatured: false,
        trending: false,
        tools: 8,
        projects: ['Aptos Ecosystem'],
        metrics: {
            indexed: '2.8M+',
            dailyTx: '150K',
            nodes: '120+'
        }
    },
    {
        id: 'aptos-defi',
        name: 'Aptos DeFi Agent',
        logo: '🌊',
        category: 'DeFi',
        description: 'For DeFi token operations, swaps, liquidity management, staking, and lending across protocols like Liquidswap, Joule, and Thala',
        tvl: '$890M',
        tvlChange: '+2.8%',
        apy: '6.2%',
        volume24h: '$78M',
        chains: ['aptos'],
        isFeatured: false,
        trending: true,
        tools: 18,
        projects: ['Liquidswap', 'Joule', 'Thala', 'Pancake'],
        metrics: {
            protocols: '4',
            pools: '280+',
            users: '25K+'
        }
    },
    {
        id: 'lido',
        name: 'Lido Agent',
        logo: '⚡',
        category: 'Staking',
        description: 'MCP server for liquid staking with validator monitoring, rewards tracking, and stETH analytics',
        tvl: '$25.1B',
        tvlChange: '+0.9%',
        apy: '3.1%',
        volume24h: '$45M',
        chains: ['ethereum'],
        isFeatured: false,
        trending: false,
        tools: 10,
        projects: ['Lido'],
        metrics: {
            staked: '8.9M ETH',
            validators: '280K+',
            apr: '3.1%'
        }
    }
];

const categories = ['All', 'Lending', 'DEX', 'Staking', 'Multi-Chain', 'Infrastructure', 'DeFi'];

const ProjectsGrid = () => {
    const [filter, setFilter] = useState('All');

    const filteredProjects = useMemo(() => {
        if (filter === 'All') {
            return mockProjects.slice(0, 6);
        }
        return mockProjects.filter(project => project.category === filter).slice(0, 6);
    }, [filter]);

    const getCategoryStyle = (category: any) => {
        const styles: any = {
            Lending: 'bg-green-100 text-green-700',
            DEX: 'bg-blue-100 text-blue-700',
            Staking: 'bg-purple-100 text-purple-700',
            'Multi-Chain': 'bg-yellow-100 text-yellow-700',
            Infrastructure: 'bg-gray-100 text-gray-700',
            DeFi: 'bg-cyan-100 text-cyan-700'
        };
        return styles[category] || 'bg-gray-100 text-gray-700';
    };

    const getChainStyle = (chain: any) => {
        const styles: any = {
            ethereum: 'bg-indigo-50 text-indigo-700',
            polygon: 'bg-purple-50 text-purple-700',
            arbitrum: 'bg-blue-50 text-blue-700',
            base: 'bg-cyan-50 text-cyan-700',
            avalanche: 'bg-red-50 text-red-700',
            cronos: 'bg-emerald-50 text-emerald-700',
            'cronos-zkevm': 'bg-teal-50 text-teal-700',
            aptos: 'bg-orange-50 text-orange-700'
        };
        return styles[chain] || 'bg-gray-50 text-gray-700';
    };

    const getChainDisplay = (chain: any) => {
        const displays: any = {
            ethereum: 'ETH',
            polygon: 'MATIC',
            arbitrum: 'ARB',
            base: 'BASE',
            avalanche: 'AVAX',
            cronos: 'CRO',
            'cronos-zkevm': 'zkCRO',
            aptos: 'APT'
        };
        return displays[chain] || chain.toUpperCase();
    };

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16"> 
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Curated MCP Servers
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        MCP (Model Context Protocol) servers help AI access real-time on-chain data. Each server provides specialized tools for specific projects or ecosystems, enabling deep analytics and insights.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                category === filter
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative group">
                            {/* Status Badges */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {project.isFeatured && (
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                )}
                                {project.trending && (
                                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        Hot
                                    </div>
                                )}
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-2xl">{project.logo}</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryStyle(project.category)}`}>
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="text-xs text-gray-500">MCP Tools</div>
                                    <div className="text-sm font-semibold text-gray-900">{project.tools}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Projects</div>
                                    <div className="text-sm font-semibold text-blue-600">{project.projects.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Chains</div>
                                    <div className="text-sm font-semibold text-gray-900">{project.chains.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Status</div>
                                    <div className="text-sm font-semibold text-green-600">Active</div>
                                </div>
                            </div>

                            {/* Supported Projects */}
                            <div className="mb-4">
                                <div className="text-xs font-medium text-gray-500 mb-2">Supported Projects:</div>
                                <div className="flex flex-wrap gap-1">
                                    {project.projects.slice(0, 2).map((proj, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                            {proj}
                                        </span>
                                    ))}
                                    {project.projects.length > 2 && (
                                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                            +{project.projects.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Supported Chains */}
                            <div className="mb-4">
                                <div className="text-xs font-medium text-gray-500 mb-2">Networks:</div>
                                <div className="flex flex-wrap gap-1">
                                    {project.chains.slice(0, 3).map((chain, idx) => (
                                        <span key={idx} className={`px-2 py-1 text-xs rounded ${getChainStyle(chain)}`}>
                                            {getChainDisplay(chain)}
                                        </span>
                                    ))}
                                    {project.chains.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                            +{project.chains.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link 
                                    href={`/chat/${project.id}`} 
                                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Chat</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                                <Link 
                                    href={`/projects/${project.id}`} 
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        View All MCP Servers
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectsGrid;