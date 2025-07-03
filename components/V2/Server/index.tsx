"use client"


import React, { useState } from 'react';
import { Star, Download, ExternalLink, Play, Copy, Check, GitBranch, Clock, Users, Shield, Zap, BarChart3, Code, Terminal, FileText, ChevronDown, ChevronUp, ArrowLeft, Heart, Share2, Flag } from 'lucide-react';
import Link from "next/link";
import Header from "../Landing/Header"

const ServerContainer = ({ serverId }: any) => {

    const [activeTab, setActiveTab] = useState('overview');
    const [showInstallCode, setShowInstallCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Mock server data - would come from props/API in real implementation
    const server = {
        name: "DeFi Analytics Pro",
        author: "DeFi Labs",
        description: "Comprehensive DeFi protocol analysis with real-time TVL tracking, yield calculations, and risk assessment across 50+ protocols",
        longDescription: "DeFi Analytics Pro is a powerful Model Context Protocol server designed specifically for DeFi developers and analysts. It provides comprehensive analytics capabilities across major DeFi protocols, offering real-time data insights, yield calculations, and risk assessments. The server integrates with leading protocols like Uniswap, Aave, Compound, and many others to deliver actionable intelligence for your Web3 applications.",
        version: "v2.1.0",
        lastUpdated: "2 hours ago",
        stars: 342,
        downloads: "12.5k",
        category: "Analytics",
        blockchain: "Ethereum",
        license: "MIT",
        repository: "https://github.com/defi-labs/defi-analytics-mcp",
        documentation: "https://docs.defi-labs.com/analytics-mcp",
        homepage: "https://defi-labs.com/analytics",
        icon: <BarChart3 className="w-8 h-8" />,
        color: "from-blue-500 to-cyan-500",
        isFeatured: true,
        features: [
            "Real-time TVL tracking across 50+ protocols",
            "Advanced yield farming calculations",
            "Impermanent loss analysis",
            "Portfolio risk assessment",
            "Historical data analysis",
            "Multi-protocol comparison",
            "Custom alert system",
            "Export capabilities"
        ],
        requirements: {
            node: ">=16.0.0",
            python: ">=3.8",
            dependencies: ["web3", "ethers", "pandas"]
        },
        installation: {
            npm: "npm install @defi-labs/analytics-mcp",
            pip: "pip install defi-analytics-mcp",
            docker: "docker pull defilabs/analytics-mcp:latest"
        },
        examples: [
            {
                title: "Get Protocol TVL",
                code: `// Get total value locked for a specific protocol
const tvl = await mcpClient.getProtocolTVL('uniswap-v3');
console.log(\`Uniswap V3 TVL: $\${tvl.formatted}\`);`
            },
            {
                title: "Calculate Yield",
                code: `// Calculate yield for a liquidity position
const yield = await mcpClient.calculateYield({
  protocol: 'aave',
  asset: 'USDC',
  amount: 10000,
  period: '30d'
});
console.log(\`Estimated 30-day yield: \${yield.apy}%\`);`
            }
        ],
        changelog: [
            {
                version: "v2.1.0",
                date: "2 hours ago",
                changes: [
                    "Added support for Arbitrum and Optimism",
                    "Improved yield calculation accuracy",
                    "New risk assessment metrics",
                    "Performance optimizations"
                ]
            },
            {
                version: "v2.0.5",
                date: "3 days ago",
                changes: [
                    "Fixed TVL calculation for Curve pools",
                    "Updated protocol ABIs",
                    "Enhanced error handling"
                ]
            }
        ],
        reviews: [
            {
                author: "alice_dev",
                rating: 5,
                date: "1 day ago",
                comment: "Excellent MCP server! The DeFi analytics are spot-on and the documentation is comprehensive. Saved me weeks of development time."
            },
            {
                author: "bob_trader",
                rating: 4,
                date: "3 days ago",
                comment: "Great for portfolio analysis. The yield calculations are accurate and the real-time data is reliable. Would love to see more L2 support."
            }
        ]
    };

    const copyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
        { id: 'installation', label: 'Installation', icon: <Download className="w-4 h-4" /> },
        { id: 'examples', label: 'Examples', icon: <Code className="w-4 h-4" /> },
        { id: 'changelog', label: 'Changelog', icon: <GitBranch className="w-4 h-4" /> },
        { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> }
    ];

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-50">
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
                            <span>{server.name}</span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left: Server Info */}
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${server.color} flex items-center justify-center text-white flex-shrink-0`}>
                                        {server.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold text-gray-900">{server.name}</h1>
                                            {server.isFeatured && (
                                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-4">{server.description}</p>
                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                            <span>by {server.author}</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span>{server.stars} stars</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                <span>{server.downloads} downloads</span>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                {server.category}
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
                                            Try Online Now
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
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
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-3">Quick Info</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Version</span>
                                                <span className="font-medium">{server.version}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Updated</span>
                                                <span className="font-medium">{server.lastUpdated}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Blockchain</span>
                                                <span className="font-medium">{server.blockchain}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">License</span>
                                                <span className="font-medium">{server.license}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-medium text-gray-900 mb-3">Links</h3>
                                        <div className="space-y-2">
                                            <a href={server.repository} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                <ExternalLink className="w-4 h-4" />
                                                View Repository
                                            </a>
                                            <a href={server.documentation} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                <FileText className="w-4 h-4" />
                                                Documentation
                                            </a>
                                            <a href={server.homepage} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                                <ExternalLink className="w-4 h-4" />
                                                Homepage
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Server</h2>
                                    <p className="text-gray-600 leading-relaxed">{server.longDescription}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {server.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-900">Node.js:</span>
                                                <span className="ml-2 text-gray-600">{server.requirements.node}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">Python:</span>
                                                <span className="ml-2 text-gray-600">{server.requirements.python}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">Dependencies:</span>
                                                <span className="ml-2 text-gray-600">{server.requirements.dependencies.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'installation' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
                                    <p className="text-gray-600 mb-6">Choose your preferred installation method:</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">NPM</h3>
                                        <div className="bg-gray-900 rounded-lg p-4 relative">
                                            <code className="text-green-400 font-mono text-sm">{server.installation.npm}</code>
                                            <button
                                                onClick={() => copyToClipboard(server.installation.npm)}
                                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Python</h3>
                                        <div className="bg-gray-900 rounded-lg p-4 relative">
                                            <code className="text-green-400 font-mono text-sm">{server.installation.pip}</code>
                                            <button
                                                onClick={() => copyToClipboard(server.installation.pip)}
                                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Docker</h3>
                                        <div className="bg-gray-900 rounded-lg p-4 relative">
                                            <code className="text-green-400 font-mono text-sm">{server.installation.docker}</code>
                                            <button
                                                onClick={() => copyToClipboard(server.installation.docker)}
                                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'examples' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
                                    <p className="text-gray-600 mb-6">Here are some common usage examples to get you started:</p>
                                </div>

                                <div className="space-y-6">
                                    {server.examples.map((example, index) => (
                                        <div key={index}>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{example.title}</h3>
                                            <div className="bg-gray-900 rounded-lg p-4 relative">
                                                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                                                    <code>{example.code}</code>
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(example.code)}
                                                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'changelog' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Changelog</h2>
                                    <p className="text-gray-600 mb-6">Recent updates and version history:</p>
                                </div>

                                <div className="space-y-4">
                                    {server.changelog.map((version, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{version.version}</h3>
                                                <span className="text-sm text-gray-500">{version.date}</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {version.changes.map((change, changeIndex) => (
                                                    <li key={changeIndex} className="flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                                        <span className="text-gray-600">{change}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">4.8 out of 5</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {server.reviews.map((review, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-gray-900">{review.author}</span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">{review.date}</span>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center">
                                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Load More Reviews
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServerContainer;