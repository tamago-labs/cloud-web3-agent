
"use client"

import { useEffect, useState, useContext, useMemo } from 'react';
import { Database, Download, Globe, ArrowUpRight, ArrowRight, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers } from 'lucide-react';
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

    const categories = allServers.reduce((arr: any, { category }: any) => {
        if (!arr.includes(category)) arr.push(category);   // keep only first occurrence
        return arr;
    }, ["All"]);

    const filtered = useMemo(() => {
        if (filter === "All") {
            return allServers.filter((_: any, idx: number) => idx < 6);   // keep first 6
        }
        return allServers.filter((s: any) => s.category === filter);
    }, [filter, allServers]);

    return (
        <div className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Online Hosted Servers
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Try any MCP server right in your browser, no setup needed
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
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Server Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && filtered.map((server: any, index: number) => (
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
                    )

                    }
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


export default OnlineHostedServers