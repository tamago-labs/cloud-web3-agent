import React, { useContext, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AccountContext } from '@/contexts/account';
import { conversationAPI, messageAPI } from '@/lib/api';

// Import our MCP components
import { MCPManagementModal } from "../../mcp/MCPManagementModal"
import { MCPStatusHeader } from '../../mcp/MCPStatusHeader';
import { ChatMessageItem } from '../../mcp/ChatMessageItem';
import { WelcomeMessage } from '../../mcp/WelcomeMessage';
import { ChatInput } from '../../mcp/ChatInput';
import { ChatMessage, MCPStatus } from '../../mcp/types';

interface ChatPanelProps {
    selectedConversation: string | null;
    onConversationCreated: (conversationId: string) => void;
    refreshTrigger: number;
}

const ChatPanel = ({ selectedConversation, onConversationCreated, refreshTrigger }: ChatPanelProps) => {
    const { profile } = useContext(AccountContext);
    
    // Chat state
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(selectedConversation);
    
    // MCP state
    const [mcpEnabled, setMcpEnabled] = useState(true);
    const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
    const [mcpStatusLoading, setMcpStatusLoading] = useState(false);
    const [showMcpModal, setShowMcpModal] = useState(false);
    
    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load MCP status on component mount
    useEffect(() => {
        loadMCPStatus();
        // Refresh MCP status every 30 seconds
        const interval = setInterval(loadMCPStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadMCPStatus = async () => {
        if (!mcpEnabled) return;
        
        setMcpStatusLoading(true);
        try {
            const response = await fetch('/api/mcp');
            const data = await response.json();
            
            if (data.success) {
                setMcpStatus(data.status);
            } else {
                setMcpStatus({
                    healthy: false,
                    connectedServers: [],
                    registeredServers: [],
                    serviceUrl: '',
                    error: data.error
                });
            }
        } catch (error) {
            console.error('Failed to load MCP status:', error);
            setMcpStatus({
                healthy: false,
                connectedServers: [],
                registeredServers: [],
                serviceUrl: '',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setMcpStatusLoading(false);
        }
    };

    // Handle selectedConversation changes from parent
    useEffect(() => {
        if (selectedConversation !== currentConversationId) {
            setCurrentConversationId(selectedConversation);
            if (selectedConversation) {
                loadConversation(selectedConversation);
            } else {
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
    const getCurrentTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            type: 'user',
            message: message.trim(),
            timestamp: getCurrentTimestamp()
        };

        setChatHistory(prev => [...prev, userMessage]);
        const currentMessage = message.trim();
        setMessage('');
        setIsLoading(true);

        try {
            // Handle conversation creation if needed
            let activeConversationId = currentConversationId;
            if (!activeConversationId && profile?.username) {
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

            // Send request to chat API with MCP enabled
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatHistory,
                    currentMessage: currentMessage,
                    enableMCP: mcpEnabled
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
                let currentMcpCalls: string[] = [];

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
                                    const chunkText = data.chunk;
                                    accumulatedMessage += chunkText;
                                    
                                    // Detect MCP tool usage
                                    if (chunkText.includes('🔧 Using ') || chunkText.includes('🔄 Executing ')) {
                                        const match = chunkText.match(/(?:🔧 Using |🔄 Executing )([^.]+)/);
                                        if (match && !currentMcpCalls.includes(match[1])) {
                                            currentMcpCalls.push(match[1]);
                                        }
                                    }
                                    
                                    // Update the last assistant message
                                    setChatHistory(prev => {
                                        const newHistory = [...prev];
                                        const lastMessage = newHistory[newHistory.length - 1];
                                        if (lastMessage && lastMessage.type === 'assistant') {
                                            lastMessage.message = accumulatedMessage;
                                            lastMessage.mcpCalls = [...currentMcpCalls];
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
            {/* MCP Management Modal */}
            <MCPManagementModal
                isOpen={showMcpModal}
                onClose={() => setShowMcpModal(false)}
                mcpStatus={mcpStatus}
                onStatusUpdate={loadMCPStatus}
            />

            {/* Chat Header with MCP Status */}
            <MCPStatusHeader
                mcpEnabled={mcpEnabled}
                mcpStatus={mcpStatus}
                mcpStatusLoading={mcpStatusLoading}
                onMcpToggle={setMcpEnabled}
                onOpenModal={() => setShowMcpModal(true)}
            />

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {chatHistory.length === 0 ? (
                    <WelcomeMessage
                        mcpEnabled={mcpEnabled}
                        mcpStatus={mcpStatus}
                        onPromptClick={setMessage}
                    />
                ) : (
                    chatHistory.map((msg, index) => (
                        <ChatMessageItem
                            key={msg.id}
                            message={msg}
                            isLoading={isLoading}
                            isLast={index === chatHistory.length - 1}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
                message={message}
                isLoading={isLoading}
                mcpEnabled={mcpEnabled}
                mcpStatus={mcpStatus}
                textareaRef={textareaRef}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};

ChatPanel.defaultProps = {
    selectedConversation: null,
    onConversationCreated: () => {},
    refreshTrigger: 0
};

export default ChatPanel;
