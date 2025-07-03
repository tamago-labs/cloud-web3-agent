import React from 'react';
import { Plus, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from "next/link"

const LeftPanel = ({ selectedConversation, setSelectedConversation }: any) => {
    const conversations = [
        {
            id: 1,
            title: "Uniswap V3 Pool Analysis",
            lastMessage: "The USDC/ETH pool shows high volatility...",
            timestamp: "2 minutes ago",
            mcpServers: ["DeFi Analytics", "Price Oracle"],
            status: "active"
        },
        {
            id: 2,
            title: "Portfolio Risk Assessment",
            lastMessage: "Your current portfolio has a risk score of...",
            timestamp: "1 hour ago",
            mcpServers: ["Risk Calculator", "Portfolio Tracker"],
            status: "completed"
        },
        {
            id: 3,
            title: "Yield Farming Opportunities",
            lastMessage: "Found 5 high-yield opportunities...",
            timestamp: "3 hours ago",
            mcpServers: ["Yield Scanner", "APY Calculator"],
            status: "completed"
        }
    ];

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Online Client</h2>
                    <Link href="/" className="text-xs text-gray-500">
                        Back to Home
                    </Link>
                   
                </div>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 group font-medium">
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    New Conversation
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4">
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                            <p className="text-gray-600 text-sm max-w-xs mx-auto">
                                Start your first conversation to analyze DeFi protocols, portfolios, or market trends
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group ${selectedConversation === conv.id
                                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`font-medium text-sm leading-5 line-clamp-2 ${selectedConversation === conv.id ? 'text-blue-900' : 'text-gray-900 group-hover:text-gray-700'
                                        }`}>
                                        {conv.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <span className={`w-2 h-2 rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></span>
                                        {selectedConversation === conv.id && (
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                    {conv.lastMessage}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {conv.mcpServers.slice(0, 2).map((server, idx) => (
                                            <span key={idx} className={`px-2 py-1 text-xs rounded-md font-medium ${selectedConversation === conv.id
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {server}
                                            </span>
                                        ))}
                                        {conv.mcpServers.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                +{conv.mcpServers.length - 2}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                                        {conv.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;