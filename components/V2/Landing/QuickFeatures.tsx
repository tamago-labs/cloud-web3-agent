

import React from 'react';
import { Database, Download, Globe, Star, ArrowRight, Zap, Code, BarChart3, Wallet, DollarSign, Shield, Layers } from 'lucide-react';
import Link from "next/link";

// Mini Features Section
const QuickFeatures = () => {
    const features = [
    	{
            icon: <Download className="w-5 h-5" />,
            text: "Try any MCP online, then download the available client tailored to your specialized tasks"
        },
        {
            icon: <Database className="w-5 h-5" />,
            text: "Access historical on-chain data via AWS Public Blockchain Datasets for trend analysis and more"
        }, 
        {
            icon: <Globe className="w-5 h-5" />,
            text: "Choose AI models like Claude & Llama, privately hosted that never shared to train public models"
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
                            <p className="text-gray-600 text-sm leading-relaxed">
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