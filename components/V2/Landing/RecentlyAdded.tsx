"use client"

import { useEffect, useState, useContext } from 'react';
import { Clock, GitBranch, Star, Users, ArrowRight, Tag, TrendingUp, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers, Database, Globe, Cpu } from 'lucide-react';
import Link from "next/link";
import ServerCard from "../ServerCard"
import { ServerContext } from '@/contexts/server';

// Recently Updated Section
const RecentlyAdded = ( ) => {

    

    const allServers: any = []

    return (
        <div className="py-20 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Recently Added
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Check out the latest MCP servers added to our platform
                    </p>
                </div>

                {/* Updates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allServers.map((server: any, index: number) => (
                        <div key={index} >
                            <ServerCard
                                server={server}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="text-center mt-8 md:hidden">
                    <Link href="/updates" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        View All Updates
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecentlyAdded