"use client"

import React, { useState } from 'react';
import { Search, MessageSquare, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState(0);

    const steps = [
        {
            id: 0,
            step: 1,
            title: "Browse & Connect",
            icon: <Search className="w-5 h-5" />,
            description: "Browse ready-to-use MCP servers for real-time Web3 data across multiple chains.",
            bullets: [
                "Choose from curated MCP servers covering 20+ DeFi protocols",
                "Each server provides specialized tools for real-time data access",
                "Filter by category: Lending, DEX, Staking, Multi-Chain protocols",
                "One-click connection with no setup or installation required"
            ]
        },
        {
            id: 1,
            step: 2,
            title: "Chat & Analyze",
            icon: <MessageSquare className="w-5 h-5" />,
            description: "Chat with AI hosted on AWS Bedrock, the data stays private and never trains public models.",
            bullets: [
                "Ask natural language questions about protocols and metrics",
                "AI powered by Claude Sonnet 4 with Web3 domain expertise",
                "Your data stays private and secure on AWS Bedrock infrastructure",
                "Get instant responses with detailed explanations and context"
            ]
        },
        {
            id: 2,
            step: 3,
            title: "Generate & Share",
            icon: <BarChart3 className="w-5 h-5" />,
            description: "Get results and generate artifacts like charts, tables, dashboards to share with the community.",
            bullets: [
                "Auto-generated interactive charts and visualizations",
                "Export data as tables, CSV files, or custom dashboards",
                "Share insights and analysis with your team or community",
                "Save and bookmark important queries for future reference"
            ]
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Generate real-time Web3 insights and dashboards by simply chatting with AI
                    </p>
                </div>

                {/* Top Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-xl p-2  shadow-sm border border-gray-200 inline-flex">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveTab(step.id)}
                                className={`flex items-center  gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${activeTab === step.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="font-medium whitespace-nowrap block md:hidden">
                                    Step
                                </span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${activeTab === step.id
                                    ? 'bg-white text-blue-600'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {step.step}
                                </div>
                                <span className="font-medium whitespace-nowrap hidden md:block">
                                    {step.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Content Body */}
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <div className="text-blue-600">
                                        {steps[activeTab].icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {steps[activeTab].title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                {steps[activeTab].description}
                            </p>

                            <div className="space-y-4">
                                {steps[activeTab].bullets.map((bullet, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{bullet}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default HowItWorks;