
"use client"


import { useEffect, useState, useContext } from 'react';
import { Clock, GitBranch, Star, Users, ArrowRight, Tag, TrendingUp, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers, Database, Globe, Cpu } from 'lucide-react';
import Link from "next/link";
import { ServerContext } from '@/contexts/server'

// Tags Section
const TagsSection = () => {

    const { loadServers } = useContext(ServerContext)

    const [categories, setCategories] = useState<any>([])

    useEffect(() => {

        loadServers().then(
            (data: any) => {

                // tally occurrences
                const counts = data.reduce((acc: any, { category }: any) => {
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});

                // turn the tally into the desired array shape
                const tags: any[] = Object.entries(counts).map(([name, count]) => ({ name, count }));

                setCategories(tags);        // e.g. [{ name: "Analytics", count: 5 }, …]
            }
        )

    }, [])

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore MCP servers by category to find the tools that suit your needs
                    </p>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((tag: any, index: number) => (
                        <Link
                            key={index}
                            href={`/browse?category=${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
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