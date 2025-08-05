"use client"

import { useEffect, useState, useContext, useMemo } from 'react';
import { Database, Globe, ArrowUpRight, Zap, BarChart3, Shield, Layers, Link as LinkIcon } from 'lucide-react';
import Link from "next/link";
import ServerCard, { ServerCardSkeleton } from "../ServerCard"
import { ServerContext } from '@/contexts/server';
 
// Online Hosted Servers Section
const OnlineHostedServers = () => {

    const { loadServers } = useContext(ServerContext)

    const [allServers, setServers] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("All")

    useEffect(() => {
        setLoading(true)
        loadServers().then(
            (data: any) => {
                const sorted = data.sort((a: any, b: any) => {
                    return (b.isFeatured ? 1000 : 0) + b.likeCount - ((a.isFeatured ? 1000 : 0) + a.likeCount);
                })
                setServers(sorted)
                setLoading(false)
            }
        )
    }, []);

    const categories = allServers.reduce((acc: any, { category }: any) => {
        if (!acc.includes(category)) acc.push(category);
        return acc;
    }, ["All"]);

    const filtered = useMemo(() => {
        if (filter === "All") {
            return allServers.filter((_: any, idx: number) => idx < 6);
        }
        return allServers.filter((s: any) => s.category === filter);
    }, [filter, allServers]);

    return (
        <div className="py-20   relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Curated MCP Servers
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        We curate MCP servers that allow AI to access both blockchain data and project-specific information. 
                        Try any server directly in your browser with no setup required.
                    </p>
                     
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category: any) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === filter
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Server Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && filtered.map((server: any, index: number) => (
                        <div key={index}>
                            <ServerCard server={server} />
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

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link 
                        href="/browse" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                    >
                        Explore All MCP Servers
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OnlineHostedServers