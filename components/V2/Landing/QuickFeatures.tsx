"use client"

import React from 'react';
import { Search, MessageSquare, BarChart3, Shield, Zap, Blocks } from 'lucide-react';

const QuickFeatures = () => {
    const features = [
        {
            step: 1,
            icon: <Search className="w-5 h-5" />,
            title: "Browse & Connect",
            text: "Browse ready-to-use MCP servers for real-time Web3 data across multiple chains.",
        },
        {
            step: 2,
            icon: <MessageSquare className="w-5 h-5" />,
            title: "Chat & Analyze",
            text: "Chat with AI hosted on AWS Bedrock, the data stays private and never trains public models.",
        },
        {
            step: 3,
            icon: <BarChart3 className="w-5 h-5" />,
            title: "Generate & Share",
            text: "Get results and generate artifacts like charts, tables, dashboards to share with the community.",
        },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Ask AI to get charts, metrics and analysis across your favorite blockchain apps
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature: any, index: number) => (
                            <div key={index} className="relative">

                                <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-700   hover:bg-blue-100 rounded-lg flex items-center justify-center  ">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {feature.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuickFeatures