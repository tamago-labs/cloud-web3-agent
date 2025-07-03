
import React from 'react';
import { Clock, GitBranch, Star, Users, ArrowRight, Tag, TrendingUp, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers, Database, Globe, Cpu } from 'lucide-react';
import Link from "next/link";
// Tags Section
const TagsSection = () => {
    const allTags = [
        { name: "TVL Tracking", count: 12 },
        { name: "Yield Calculation", count: 8 },
        { name: "Impermanent Loss Analysis", count: 6 },
        { name: "Balance Queries", count: 15 },
        { name: "Transaction History", count: 18 },
        { name: "Multi-Chain Support", count: 22 },
        { name: "Price Analysis", count: 14 },
        { name: "Signal Generation", count: 9 },
        { name: "Risk Assessment", count: 11 },
        { name: "Vulnerability Scan", count: 7 },
        { name: "Gas Optimization", count: 13 },
        { name: "Best Practices", count: 5 },
        { name: "Metadata Analysis", count: 10 },
        { name: "Rarity Scoring", count: 8 },
        { name: "Price History", count: 16 },
        { name: "Auto Deployment", count: 9 },
        { name: "Test Generation", count: 6 },
        { name: "CI/CD Integration", count: 4 }
    ];

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    {/*<div className="flex items-center justify-center mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Browse by Tags
                        </span>
                    </div>*/}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Tags
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore MCP servers by tags to match the tools and features you need
                    </p>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap justify-center gap-3">
                    {allTags.map((tag, index) => (
                        <Link
                            key={index}
                            href={`/browse?feature=${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors group"
                        >
                            <span className="font-medium">{tag.name}</span>
                            <span className="text-sm opacity-75">{tag.count}</span>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Can't find what you need?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Help grow the Web3 MCP ecosystem by contributing your own server or requesting new features that the community needs.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                                Submit Your Server
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/request" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                Request Feature
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TagsSection