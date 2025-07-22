import React from 'react';
import { X, MessageSquare, Server, Bot, Zap, CheckCircle, ArrowRight, TrendingUp, PieChart, Search } from 'lucide-react';

interface HowToUseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const features = [
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Smart Conversations",
            description: "Chat with AI about DeFi, portfolios, and Web3 data with context-aware responses",
            examples: ["Analyze my portfolio performance", "What are the best yield opportunities?", "Explain this DeFi protocol"]
        },
        {
            icon: <Server className="w-6 h-6" />,
            title: "MCP Tools Integration", 
            description: "Access blockchain data, APIs, and external services through MCP servers",
            examples: ["Check wallet balances", "Get token prices", "Analyze transaction history", "Create reports"]
        },
        {
            icon: <Bot className="w-6 h-6" />,
            title: "AI Model Selection",
            description: "Choose from different AI models optimized for various tasks",
            examples: ["Claude 4 Sonnet for complex analysis", "Switch models based on your needs"]
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-time Analysis",
            description: "Get live data and instant insights with streaming responses",
            examples: ["Live market data", "Real-time calculations", "Dynamic charts"]
        }
    ];

    const steps = [
        {
            step: 1,
            title: "Select Your Tools",
            description: "Choose MCP servers and AI model in the input area",
            icon: <Server className="w-5 h-5 text-blue-600" />
        },
        {
            step: 2,
            title: "Ask Questions",
            description: "Type your question about DeFi, portfolios, or market analysis",
            icon: <MessageSquare className="w-5 h-5 text-green-600" />
        },
        {
            step: 3,
            title: "Get Insights",
            description: "Receive AI-powered analysis with real blockchain data",
            icon: <TrendingUp className="w-5 h-5 text-purple-600" />
        },
        {
            step: 4,
            title: "Save & Share",
            description: "Convert insights to charts and save as artifacts",
            icon: <PieChart className="w-5 h-5 text-orange-600" />
        }
    ];

    const exampleQueries = [
        {
            category: "Portfolio Analysis",
            icon: <PieChart className="w-4 h-4 text-blue-600" />,
            queries: [
                "What's my current portfolio balance?",
                "Show me my token distribution",
                "Calculate my portfolio performance this month"
            ]
        },
        {
            category: "DeFi Research",
            icon: <TrendingUp className="w-4 h-4 text-green-600" />,
            queries: [
                "What are the highest APY pools right now?",
                "Compare yield farming opportunities",
                "Analyze this protocol's risk factors"
            ]
        },
        {
            category: "Market Analysis",
            icon: <Search className="w-4 h-4 text-purple-600" />,
            queries: [
                "What's the current ETH price trend?",
                "Show me trading volume for popular tokens",
                "Create a price chart for the last 7 days"
            ]
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">How to Use</h2>
                        <p className="text-gray-600 mt-1">Your intelligent assistant for DeFi and Web3 analysis</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Quick Start Steps */}
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {steps.map((step, index) => (
                                <div key={step.step} className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            {step.icon}
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="hidden md:block absolute top-6 -right-2 w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
 

                    {/* Example Queries */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Queries</h3>
                        <div className="space-y-6">
                            {exampleQueries.map((category, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {category.icon}
                                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {category.queries.map((query, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(query);
                                                }}
                                                title="Click to copy"
                                            >
                                                <p className="text-sm text-gray-700">&quot;{query}&quot;</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Be Specific</p>
                                        <p className="text-xs text-gray-600">Include wallet addresses, token symbols, or protocol names for better results</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Use Time Frames</p>
                                        <p className="text-xs text-gray-600">Specify periods like &quot;last 30 days&quot; or &quot;this week&quot; for time-based analysis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Enable Servers</p>
                                        <p className="text-xs text-gray-600">Select relevant MCP servers for data access before asking questions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Save Insights</p>
                                        <p className="text-xs text-gray-600">Convert analysis results to charts and save them as artifacts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowToUseModal;