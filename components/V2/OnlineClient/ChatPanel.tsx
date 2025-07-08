import React, { useContext, useState, useRef, useEffect } from 'react';
import { Send, Activity, BarChart3, Loader2 } from 'lucide-react';
import { AccountContext } from '@/contexts/account';
import { conversationAPI, messageAPI } from '@/lib/api';
import Link from 'next/link';

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    message: string;
    timestamp: string;
    mcpCalls?: string[];
    charts?: string[];
}

interface ChatPanelProps {
    selectedConversation: string | null;
    onConversationCreated: (conversationId: string) => void;
    refreshTrigger: number;
}

const ChatPanel = ({ selectedConversation, onConversationCreated, refreshTrigger }: ChatPanelProps) => {
    const { profile } = useContext(AccountContext);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(selectedConversation);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle selectedConversation changes from parent
    useEffect(() => {
        if (selectedConversation !== currentConversationId) {
            setCurrentConversationId(selectedConversation);
            if (selectedConversation) {
                loadConversation(selectedConversation);
            } else {
                // Reset to new conversation
                setChatHistory([]);
            }
        }
    }, [selectedConversation, refreshTrigger]);

    // Update parent when conversation is created
    useEffect(() => {
        if (currentConversationId && currentConversationId !== selectedConversation) {
            onConversationCreated(currentConversationId);
        }
    }, [currentConversationId]);

    const loadConversation = async (conversationId: string) => {
        try {
            const data = await conversationAPI.getConversationWithMessages(conversationId);
            const messages = data.messages.map((msg: any) => ({
                id: msg.messageId || msg.id,
                type: msg.sender,
                message: msg.content,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setChatHistory(messages);
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [message]);

    const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const getCurrentTimestamp = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            type: 'user',
            message: message.trim(),
            timestamp: getCurrentTimestamp()
        };

        // Add user message to chat
        setChatHistory(prev => [...prev, userMessage]);
        const currentMessage = message.trim();
        setMessage('');
        setIsLoading(true);

        try {
            // Handle conversation creation if needed
            let activeConversationId = currentConversationId;
            if (!activeConversationId && profile?.username) {
                // Create new conversation with title from first part of message
                const title = currentMessage.substring(0, 50) + (currentMessage.length > 50 ? '...' : '');
                const newConversation = await conversationAPI.createConversation(profile.username, title);
                
                if (newConversation) {
                    activeConversationId = newConversation.id;
                    setCurrentConversationId(newConversation.id);
                }
            }

            // Save user message to database
            if (activeConversationId) {
                await messageAPI.createMessage({
                    conversationId: activeConversationId,
                    messageId: generateId(),
                    sender: 'user',
                    content: currentMessage,
                    timestamp: new Date().toISOString(),
                    position: chatHistory.length
                });
            }

            // Send request to chat API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: chatHistory,
                    currentMessage: currentMessage
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create assistant message
            const assistantMessage: ChatMessage = {
                id: generateId(),
                type: 'assistant',
                message: '',
                timestamp: getCurrentTimestamp(),
                mcpCalls: []
            };

            setChatHistory(prev => [...prev, assistantMessage]);

            // Read streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                let accumulatedMessage = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                if (data.error) {
                                    throw new Error(data.error);
                                }
                                
                                if (data.chunk) {
                                    accumulatedMessage += data.chunk;
                                    
                                    // Update the last assistant message
                                    setChatHistory(prev => {
                                        const newHistory = [...prev];
                                        const lastMessage = newHistory[newHistory.length - 1];
                                        if (lastMessage && lastMessage.type === 'assistant') {
                                            lastMessage.message = accumulatedMessage;
                                        }
                                        return newHistory;
                                    });
                                }
                                
                                if (data.done) {
                                    // Save assistant message to database
                                    if (activeConversationId && accumulatedMessage) {
                                        await messageAPI.createMessage({
                                            conversationId: activeConversationId,
                                            messageId: generateId(),
                                            sender: 'assistant',
                                            content: accumulatedMessage,
                                            timestamp: new Date().toISOString(),
                                            position: chatHistory.length + 1
                                        });
                                    }
                                    setIsLoading(false);
                                    break;
                                }
                            } catch (parseError) {
                                console.error('Error parsing SSE data:', parseError);
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Chat error:', error);
            
            // Add error message
            const errorMessage: ChatMessage = {
                id: generateId(),
                type: 'assistant',
                message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please try again.`,
                timestamp: getCurrentTimestamp()
            };

            setChatHistory(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!profile) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-900">
                <h2 className="text-xl font-semibold mb-2">You're not logged in</h2>
                <p className="mb-4 text-gray-600">Please log in to access this AI chat panel</p>
                <Link
                    href="/dashboard"
                    className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">Web3 AI Assistant</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">Powered by Claude 4</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">MCP Enabled</span>
                            {currentConversationId && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Saved</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <div className="text-lg font-medium mb-2">Welcome to Web3 AI Assistant</div>
                        <p className="text-sm">Ask me anything about blockchain, DeFi, portfolio analysis, or Web3 development!</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                            <button
                                onClick={() => setMessage("Analyze my ETH portfolio")}
                                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm"
                            >
                                💼 Analyze my ETH portfolio
                            </button>
                            <button
                                onClick={() => setMessage("What's the current gas price on Ethereum?")}
                                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm"
                            >
                                ⛽ Check current gas prices
                            </button>
                            <button
                                onClick={() => setMessage("Show me trending DeFi protocols")}
                                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm"
                            >
                                📈 Trending DeFi protocols
                            </button>
                            <button
                                onClick={() => setMessage("Explain how Uniswap V3 works")}
                                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm"
                            >
                                🦄 How Uniswap V3 works
                            </button>
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, index) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3xl rounded-xl px-6 py-4 ${
                            msg.type === 'user'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 shadow-sm'
                        }`}>
                            {msg.type === 'assistant' && msg.mcpCalls && msg.mcpCalls.length > 0 && (
                                <div className="mb-3 text-xs text-gray-500">
                                    {msg.mcpCalls.map((call, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-1">
                                            <Activity className="w-3 h-3 text-blue-500" />
                                            <span className="font-mono">{call}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                                {msg.type === 'assistant' && isLoading && index === chatHistory.length - 1 && (
                                    <span className="inline-block ml-1 w-2 h-5 bg-gray-400 animate-pulse"></span>
                                )}
                            </div>
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
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-gray-200 p-6">
                <div className="flex gap-4">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about DeFi protocols, yield opportunities, portfolio analysis..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium min-w-[80px]"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    Press Enter to send, Shift + Enter for new line
                </div>
            </div>
        </div>
    );
};

ChatPanel.defaultProps = {
    selectedConversation: null,
    onConversationCreated: () => {},
    refreshTrigger: 0
};

export default ChatPanel;