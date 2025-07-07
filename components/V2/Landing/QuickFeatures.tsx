"use client"

import React from 'react';
import { Bitcoin, TrendingUp, Eye, Globe, Star, ArrowRight, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers } from 'lucide-react';
import Link from "next/link";

// Mini Features Section
const QuickFeatures = () => {
    const features = [
        {
            icon: <TrendingUp className="w-5 h-5" />,
            text: "Get instant portfolio insights and cross-chain balance analysis without manual tracking"
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            text: "Track whale activity and large token movements for market intelligence and alpha"
        }, 
        {
            icon: <Bitcoin className="w-5 h-5" />,
            text: "Monitor network health, mining trends, and real-time analytics across Bitcoin and EVM chains"
        }
    ];

    return (
        <div className="bg-gray-50 py-16 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                {feature.icon}
                            </div>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                {feature.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default QuickFeatures