import React, { useState } from 'react';
import { Send, RefreshCw, Activity, BarChart3 } from 'lucide-react';

const ChatPanel = () => {
    const [message, setMessage] = useState('');

    const currentChat = [
        {
            type: 'user',
            message: 'Analyze the USDC/ETH pool on Uniswap V3',
            timestamp: '2:34 PM'
        },
        {
            type: 'assistant',
            message: 'I\'ll analyze the USDC/ETH pool on Uniswap V3 for you. Let me gather the latest data...',
            timestamp: '2:34 PM',
            mcpCalls: ['DeFi Analytics: getPoolData()', 'Price Oracle: getCurrentPrice()']
        },
        {
            type: 'assistant',
            message: '📊 **USDC/ETH Pool Analysis**\n\n**Current Metrics:**\n• TVL: $245.7M (+2.3% 24h)\n• Volume (24h): $89.2M\n• Fee Tier: 0.05%\n• Current Price: 1 ETH = 2,847 USDC\n\n**Liquidity Distribution:**\n• Most liquidity concentrated between $2,800-$2,900\n• Active positions: 1,247\n• Fee APR: 12.4%\n\n**Risk Assessment:**\n• Volatility: Medium-High\n• Impermanent Loss Risk: 8.2%\n• Liquidity Efficiency: 89%',
            timestamp: '2:35 PM',
            charts: ['tvl-chart', 'liquidity-distribution']
        }
    ];

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
             <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">Uniswap V3 Pool Analysis</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">Using:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">DeFi Analytics</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Price Oracle</span>
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {currentChat.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3xl rounded-xl px-6 py-4 ${
                            msg.type === 'user' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white border border-gray-200 shadow-sm'
                        }`}>
                            {msg.type === 'assistant' && msg.mcpCalls && (
                                <div className="mb-3 text-xs text-gray-500">
                                    {msg.mcpCalls.map((call, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-1">
                                            <Activity className="w-3 h-3 text-blue-500" />
                                            <span className="font-mono">{call}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                            {msg.charts && (
                                <div className="mt-4 flex gap-3">
                                    {msg.charts.map((chart, idx) => (
                                        <div key={idx} className="w-36 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 flex items-center justify-center group hover:shadow-md transition-shadow">
                                            <div className="text-center">
                                                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                                                <span className="text-xs text-blue-700 font-medium">
                                                    {chart === 'tvl-chart' ? 'TVL Trend' : 'Liquidity Map'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={`text-xs mt-3 ${
                                msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </div> 

            {/* Chat Input */}
            <div className="bg-white border-t border-gray-200 p-6">
                <div className="flex gap-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about DeFi protocols, yield opportunities, portfolio analysis..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
                        rows={1}
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    Press Enter to send, Shift + Enter for new line
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;