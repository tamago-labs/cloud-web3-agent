import { MessageSquare, User, Bot, Play, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

const SampleConversations = () => {
    const conversations = [
        {
            title: "Aave Utilization Analysis",
            icon: <BarChart3 className="w-5 h-5" />,
            gradient: "from-green-500 to-emerald-600",
            messages: [
                {
                    type: "user",
                    content: "What's the current utilization rate for USDC on Aave?"
                },
                {
                    type: "bot",
                    content: "USDC utilization on Aave is currently at 68.4%. This is considered healthy - not too low (inefficient) or too high (risky). The supply APY is 4.2% and borrow APY is 5.8%.",
                    chart: true
                }
            ]
        },
        {
            title: "Curve Pool Comparison",
            icon: <TrendingUp className="w-5 h-5" />,
            gradient: "from-blue-500 to-indigo-600",
            messages: [
                {
                    type: "user", 
                    content: "Show me the best yielding Curve pools for stablecoins"
                },
                {
                    type: "bot",
                    content: "Here are the top 3 stablecoin pools on Curve: 1) crvUSD/USDT: 8.2% APY, 2) FRAX/USDC: 6.8% APY, 3) 3Pool (USDC/USDT/DAI): 4.1% APY. All have low impermanent loss risk.",
                    chart: true
                }
            ]
        },
        {
            title: "Lido Staking Rewards",
            icon: <DollarSign className="w-5 h-5" />,
            gradient: "from-purple-500 to-pink-600",
            messages: [
                {
                    type: "user",
                    content: "How much would I earn staking 10 ETH with Lido?"
                },
                {
                    type: "bot",
                    content: "Staking 10 ETH with Lido at current 3.1% APR would earn ~0.31 ETH annually (~$1,240 at current prices). You'll receive stETH tokens that are liquid and can be used in other DeFi protocols.",
                    chart: false
                }
            ]
        }
    ];

    return (
        <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-70 text-gray-700 text-sm font-medium rounded-full mb-6 backdrop-blur-sm border border-white/20">
                        <MessageSquare className="w-4 h-4" />
                        AI Conversations
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        See AI in Action
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real examples of how our AI helps you get instant insights from complex DeFi data
                    </p>
                </div>

                {/* Conversations Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conversations.map((conversation, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-white/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${conversation.gradient} flex items-center justify-center text-white`}>
                                    {conversation.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{conversation.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Play className="w-3 h-3" />
                                        Try this conversation
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="space-y-4">
                                {conversation.messages.map((message: any, msgIndex) => (
                                    <div key={msgIndex} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {message.type === 'bot' && (
                                            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                            message.type === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                        }`}>
                                            <p>{message.content}</p>
                                            {message.chart && (
                                                <div className="mt-3 p-2 bg-white bg-opacity-50 rounded border text-center">
                                                    <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                                        <BarChart3 className="w-3 h-3" />
                                                        Interactive chart generated
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {message.type === 'user' && (
                                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                                                <User className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Try Button */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                    <Play className="w-4 h-4" />
                                    Try This Query
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                {/* <div className="text-center mt-12">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Ready to start your own conversation?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Ask anything about your favorite DeFi projects and get instant, accurate insights
                        </p>
                        <button className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                            Start Chatting
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default SampleConversations;