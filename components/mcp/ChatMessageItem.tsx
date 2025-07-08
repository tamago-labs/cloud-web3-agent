import React from 'react';
import { Activity } from 'lucide-react';
import { ChatMessage } from './types';

interface ChatMessageItemProps {
    message: ChatMessage;
    isLoading: boolean;
    isLast: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    message,
    isLoading,
    isLast
}) => {
    return (
        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-xl px-6 py-4 ${
                message.type === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 shadow-sm'
            }`}>
                {/* MCP Tool Usage Indicators */}
                {message.type === 'assistant' && message.mcpCalls && message.mcpCalls.length > 0 && (
                    <div className="mb-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1 mb-2">
                            <Activity className="w-3 h-3 text-blue-500" />
                            <span className="font-semibold">Tools Used:</span>
                        </div>
                        {message.mcpCalls.map((call, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1 ml-4">
                                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                <span className="font-mono text-blue-600">{call}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-wrap leading-relaxed">
                    {message.message}
                    {message.type === 'assistant' && isLoading && isLast && (
                        <span className="inline-block ml-1 w-2 h-5 bg-gray-400 animate-pulse"></span>
                    )}
                </div>

                {/* Charts (if any) */}
                {message.charts && message.charts.length > 0 && (
                    <div className="mt-4 flex gap-3">
                        {message.charts.map((chart, idx) => (
                            <div key={idx} className="w-36 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 flex items-center justify-center group hover:shadow-md transition-shadow">
                                <div className="text-center">
                                    <span className="text-xs text-blue-700 font-medium">
                                        {chart === 'tvl-chart' ? 'TVL Trend' : 'Liquidity Map'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <div className={`text-xs mt-3 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                    {message.timestamp}
                </div>
            </div>
        </div>
    );
};

export default ChatMessageItem;
