"use client"

import React from 'react';
import {
    Database,
    Zap,
    Shield,
    Globe,
    BarChart3,
    Cpu,
    Cloud,
    Link2,
    ArrowUpRight,
    CheckCircle
} from 'lucide-react';

const TechnologiesSection = () => {
    const technologies = [
        {
            name: "MCP (Model Context Protocol)",
            description: "An open standard that allows AI agents to securely access real-world data sources and tools in a standardized way.",
            icon: <Link2 className="w-8 h-8" />,
            color: "from-blue-500 to-indigo-600",
            benefits: [
                "Standardized AI-tool integration",
                "Secure data access",
                "Extensible architecture"
            ],
            website: "https://modelcontextprotocol.org"
        },
        {
            name: "Pyth MCP",
            description: "Access high-frequency market data oracles providing real-time price feeds for 400+ assets across traditional and digital markets.",
            icon: <BarChart3 className="w-8 h-8" />,
            color: "from-purple-500 to-pink-600",
            benefits: [
                "Real-time price data",
                "Sub-second latency",
                "Cross-chain compatibility"
            ],
            website: "https://pyth.network"
        },
        {
            name: "Nodit MCP",
            description: "Official MCP server from Nodit, providing reliable node access, indexing, and analytics APIs across 15+ blockchains with 99.9% uptime.",
            icon: <Database className="w-8 h-8" />,
            color: "from-emerald-500 to-teal-600",
            benefits: [
                "15+ blockchain networks",
                "Enterprise reliability",
                "Advanced indexing"
            ],
            website: "https://nodit.io"
        },
        // {
        //     name: "AWS Bedrock",
        //     description: "Fully managed service for building generative AI applications with foundation models, providing security, privacy, and responsible AI governance.",
        //     icon: <Cloud className="w-8 h-8" />,
        //     color: "from-orange-500 to-red-600",
        //     benefits: [
        //         "Enterprise security",
        //         "Managed AI models",
        //         "Global scalability"
        //     ],
        //     website: "https://aws.amazon.com/bedrock"
        // },
        // {
        //     name: "Claude 4 (Anthropic)",
        //     description: "Advanced constitutional AI model designed for helpful, harmless, and honest interactions with superior reasoning and analysis capabilities.",
        //     icon: <Cpu className="w-8 h-8" />,
        //     color: "from-indigo-500 to-purple-600",
        //     benefits: [
        //         "Advanced reasoning",
        //         "Context understanding",
        //         "Safe AI interactions"
        //     ],
        //     website: "https://anthropic.com"
        // }
    ];

    return (
        <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Technologies
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Built on cutting-edge technologies that enable seamless Web3 analytics, leveraging community MCP on top of foundational MCPs.
                    </p>
                </div>

                {/* Technologies Grid */}
                <div className="space-y-8">
                    {/* First row - 3 cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {technologies.slice(0, 3).map((tech, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            {tech.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {tech.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {tech.description}
                                    </p>

                                    {/* Benefits */}
                                    <div className="space-y-2 mb-4">
                                        {tech.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Website Link */}
                                    <a
                                        href={tech.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:gap-2 transition-all"
                                    >
                                        Learn more
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second row - 2 cards centered */}
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                            {technologies.slice(3, 5).map((tech, index) => (
                                <div key={index + 3} className="group">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                {tech.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {tech.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                            {tech.description}
                                        </p>

                                        {/* Benefits */}
                                        <div className="space-y-2 mb-4">
                                            {tech.benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Website Link */}
                                        <a
                                            href={tech.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:gap-2 transition-all"
                                        >
                                            Learn more
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default TechnologiesSection;