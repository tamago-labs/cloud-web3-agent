"use client"

import React from 'react';
import { Bitcoin, Cloud, TrendingUp, Eye, Globe, Star, ArrowRight, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers } from 'lucide-react';
import Link from "next/link";

// Mini Features Section
const QuickFeatures = () => {
    const features = [
  {
    step: 1,
    text: "Browse ready-to-use MCP servers for real-time Web3 data across multiple chains.",
  },
  {
    step: 2,
    text: "Chat with AI hosted on AWS Bedrock, the data stays private and never trains public models.",
  },
  {
    step: 3,
    text: "Get results and generate artifacts like charts, tables, dashboards to share with the community.",
  },
];

    return (
        <div className="bg-gray-50 py-16 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature: any, index: number) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                {index+1}
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