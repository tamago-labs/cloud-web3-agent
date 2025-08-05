"use client"

import Link from 'next/link';
import { ArrowRight, Plus, MessageSquare, Zap } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
                <div className="absolute top-40 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-20 left-1/3 w-12 h-12 border border-white/20 rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className=" text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Join developers and analysts using MCP servers to unlock Web3 insights
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Primary CTA - Try Platform */}
                    <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Start Analyzing Now
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try our online client with curated MCP servers. No setup, no installation required.
                        </p>
                        <Link
                            href="/client"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full justify-center"
                        >
                            Launch Online Client
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Secondary CTA - Submit Server */}
                    <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8  text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Submit Your MCP Server
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Built an MCP server? Share it with the community and help expand our ecosystem.
                        </p>
                        <Link
                            href="/submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full justify-center"
                        >
                            Submit Server
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Additional Links */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 md:gap-6 text-xs md:text-base text-gray-600">
                        <Link href="/browse" className="hover:text-black transition-colors flex items-center gap-1">
                            Browse Servers
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span className="w-px h-4 bg-blue-300"></span>
                        <Link href="https://docs.tamagolabs.com" target="_blank" className="hover:text-black transition-colors flex items-center gap-1">
                            Documentation
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span className="w-px h-4 bg-blue-300"></span>
                        <Link href="/discover" className="hover:text-black transition-colors flex items-center gap-1">
                            Community Analytics
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;