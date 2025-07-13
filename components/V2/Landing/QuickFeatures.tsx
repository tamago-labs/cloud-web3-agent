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

    const benefits = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Private by Design",
            description: "Your data never leaves AWS. Private AI processing with no model training."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-time Insights",
            description: "Live blockchain data from multiple chains updated every block."
        },
        {
            icon: <Blocks className="w-6 h-6" />,
            title: "Multi-chain Support",
            description: "Ethereum, Polygon, Arbitrum, Base, Optimism, and more chains supported."
        }
    ];

    return (
        <div className="bg-gray-50 py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* How it Works */}
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Transform your questions into powerful Web3 analytics in three simple steps
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
                                    {/* <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {feature.step}
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Benefits */}
                {/* <div className="grid md:grid-cols-3 gap-6">
                    {benefits.map((benefit: any, index: number) => (
                        <div key={index} className="text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mx-auto mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default QuickFeatures