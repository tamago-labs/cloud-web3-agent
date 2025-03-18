"use client"


import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Settings, Download, Copy, Trash, ChevronDown, PlayCircle } from "react-feather"

const Chat = () => {

    const [message, setMessage] = useState('');
    const [conversations, setConversations] = useState([
        { id: 'conv1', name: 'Solana NFT Agent', timestamp: 'Today', active: true },
        { id: 'conv2', name: 'Token Tracker', timestamp: 'Yesterday', active: false },
        { id: 'conv3', name: 'Wallet Analyzer', timestamp: '3 days ago', active: false },
    ]);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'agent',
            content: "Hello! I'm your Solana NFT Agent. I can help you track NFT collections, analyze floor prices, or execute trades. What would you like to do today?",
            timestamp: '10:30 AM'
        },
        {
            id: 2,
            sender: 'user',
            content: "Show me the top 3 trending NFT collections on Solana",
            timestamp: '10:31 AM'
        },
        {
            id: 3,
            sender: 'agent',
            content: "Based on current blockchain data, the top 3 trending Solana NFT collections are:\n\n1. DeGods - 24h volume: 15,432 SOL\n2. Okay Bears - 24h volume: 9,876 SOL\n3. Solana Monkey Business - 24h volume: 7,654 SOL\n\nWould you like me to provide more details on any of these collections?",
            timestamp: '10:31 AM',
            hasBlockchainData: true,
            blockchainSource: 'Magic Eden, Jupiter Aggregator'
        },
    ]);

    const [agentCapabilities, setAgentCapabilities] = useState([
        'Track NFT collections and floor prices',
        'Execute NFT purchases within budget limits',
        'Set up alerts for price movements',
        'Generate reports on portfolio performance'
    ]);

    // const messagesEndRef = useRef(null);

    // // Scroll to bottom of messages on new message
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // Add user message
        const newUserMessage = {
            id: messages.length + 1,
            sender: 'user',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMessage]);
        setMessage('');

        // Simulate agent response
        setTimeout(() => {
            const newAgentMessage = {
                id: messages.length + 2,
                sender: 'agent',
                content: "I'll fetch that information for you. Let me check the blockchain data...",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                loading: true
            };

            setMessages(prev => [...prev, newAgentMessage]);

            // Simulate blockchain data retrieval
            setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === newAgentMessage.id ? {
                        ...msg,
                        content: "I've analyzed your request and here's what I found on-chain:\n\nThe Okay Bears collection has a floor price of 45.5 SOL, which is up 3.2% in the last 24 hours. There are currently 23 listings below 50 SOL.\n\nWould you like me to set up an alert for when the floor price drops below a certain threshold?",
                        loading: false,
                        hasBlockchainData: true,
                        blockchainSource: 'Solana RPC, Magic Eden API'
                    } : msg
                ));
            }, 3000);
        }, 1000);
    };

    const switchConversation = (id: any) => {
        setConversations(prev =>
            prev.map(conv => ({ ...conv, active: conv.id === id }))
        );
    };


    return (
        <div className="flex h-screen relative">
            {/* Sidebar */}
            <div className="w-64  border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <Plus size={16} className="mr-2" />
                        New Conversation
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => switchConversation(conv.id)}
                            className={`p-3 border-b border-gray-100 cursor-pointer ${conv.active ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <PlayCircle size={16} className={`mr-2 ${conv.active ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className={`font-medium ${conv.active ? 'text-blue-600' : ''}`}>{conv.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{conv.timestamp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="  p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                            <PlayCircle size={18} />
                        </div>
                        <div>
                            <h2 className="font-medium">Solana NFT Agent</h2>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-xs text-gray-500">Online • Solana Agent Kit</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Copy size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Download size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4  ">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {messages.map((msg: any) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3xl p-4 rounded-lg ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-200'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.content}</div>

                                    {msg.loading && (
                                        <div className="mt-2 flex items-center">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                                        </div>
                                    )}

                                    {msg.hasBlockchainData && (
                                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                                            <span className="mr-1">Data from:</span>
                                            <span className="font-medium">{msg.blockchainSource}</span>
                                        </div>
                                    )}

                                    <div className="mt-1 text-xs text-right opacity-70">
                                        {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* <div ref={messagesEndRef} /> */}
                    </div>
                </div>

                {/* Input Area */}
                <div className="  border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 py-3 pl-4 pr-16 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ask your agent something..."
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className={`absolute right-2 p-2 rounded-full ${message.trim() ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                                    }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>

                        {/* Agent Capabilities */}
                        <div className="mt-4">
                            <div className="flex items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Agent Capabilities</h3>
                                <ChevronDown size={16} className="ml-1 text-gray-500" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {agentCapabilities.map((capability, index) => (
                                    <button
                                        key={index}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                                        onClick={() => setMessage(capability)}
                                    >
                                        {capability}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Chat