

import React, { useContext, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AccountContext } from '@/contexts/account';
import { conversationAPI, messageAPI } from '@/lib/api';
import { X, Square, Trash2 } from 'lucide-react';

// Import our MCP components
import { MCPManagementModal } from "../../mcp/MCPManagementModal"
import { ChatHeader } from '../../mcp/ChatHeader';
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

    // Streaming control state
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamController, setStreamController] = useState<AbortController | null>(null);

    // Message deletion state
    const [deletingMessages, setDeletingMessages] = useState<Set<string>>(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // AI Model state
    const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');

    // MCP state
    const [mcpEnabled, setMcpEnabled] = useState(true);
    const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
    const [mcpStatusLoading, setMcpStatusLoading] = useState(false);
    const [showMcpModal, setShowMcpModal] = useState(false);

    // MCP Server selection state
    const [mcpServers, setMcpServers] = useState([
        {
            name: 'filesystem',
            description: 'File system operations in /tmp directory',
            status: 'connected' as const,
            tools: 6,
            enabled: true
        },
        {
            name: 'web3-mcp',
            description: 'Web3 blockchain interactions',
            status: 'disconnected' as const,
            tools: 12,
            enabled: false
        },
        {
            name: 'nodit',
            description: 'Blockchain data queries via Nodit API',
            status: 'error' as const,
            tools: 8,
            enabled: false
        }
    ]);

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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamController) {
                streamController.abort();
            }
        };
    }, [streamController]);

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

    // Handle MCP server selection
    const handleServerToggle = (serverName: string, enabled: boolean) => {
        setMcpServers(prev => prev.map(server =>
            server.name === serverName
                ? { ...server, enabled }
                : server
        ));
    };

    // Get enabled server names for API call
    const getEnabledServers = () => {
        return mcpServers
            .filter(server => server.enabled && server.status === 'connected')
            .map(server => server.name);
    };

    // Stop streaming function
    const handleStopStreaming = () => {
        if (streamController) {
            streamController.abort();
            setStreamController(null);
        }
        setIsStreaming(false);
        setIsLoading(false);

        // Update the last message to indicate it was stopped
        setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage && lastMessage.type === 'assistant' && lastMessage.message) {
                lastMessage.message += '\n\n*[Response stopped by user]*';
            }
            return newHistory;
        });
    };

    // Delete single message function
    const handleDeleteMessage = async (messageId: string) => {
        setDeletingMessages(prev => new Set(prev).add(messageId));

        try {
            // Remove from UI immediately for better UX
            setChatHistory(prev => prev.filter(msg => msg.id !== messageId));

            // Call API to delete from database if needed
            // await messageAPI.deleteMessage(messageId);

            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            // Revert the UI change if API call failed
            if (currentConversationId) {
                loadConversation(currentConversationId);
            }
        } finally {
            setDeletingMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(messageId);
                return newSet;
            });
        }
    };

    // Clear all messages function
    const handleClearAllMessages = async () => {
        if (!currentConversationId) return;

        const confirmClear = window.confirm('Are you sure you want to clear all messages in this conversation?');
        if (!confirmClear) return;

        try {
            setChatHistory([]);
            // await conversationAPI.clearMessages(currentConversationId);
        } catch (error) {
            console.error('Error clearing messages:', error);
            // Reload conversation if clear failed
            loadConversation(currentConversationId);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading || isStreaming) return;

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
        setIsStreaming(true);

        // Create abort controller for this request
        const controller = new AbortController();
        setStreamController(controller);

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

            console.log("enabledServers :", getEnabledServers())

            // Send request to chat API with MCP enabled
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatHistory,
                    currentMessage: currentMessage,
                    selectedModel: selectedModel,
                    mcpConfig: {
                        // enabledServers: mcpEnabled ? getEnabledServers() : []
                        enabledServers: getEnabledServers()
                    }
                }),
                signal: controller.signal // Add abort signal
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

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        // Check if streaming was cancelled
                        if (controller.signal.aborted) {
                            break;
                        }

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
                                        break;
                                    }
                                } catch (parseError) {
                                    console.error('Error parsing SSE data:', parseError);
                                }
                            }
                        }
                    }
                } catch (readError) {
                    if (!controller.signal.aborted) {
                        console.error('Error reading stream:', readError);
                        throw readError;
                    }
                } finally {
                    reader.releaseLock();
                }
            }

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Streaming was cancelled, this is expected
                console.log('Streaming cancelled by user');
            } else {
                console.error('Chat error:', error);

                const errorMessage: ChatMessage = {
                    id: generateId(),
                    type: 'assistant',
                    message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please try again.`,
                    timestamp: getCurrentTimestamp()
                };

                setChatHistory(prev => [...prev, errorMessage]);
            }
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
            setStreamController(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isStreaming) {
                handleSendMessage();
            }
        }
    };

    // if (!profile) {
    //     return (
    //         <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-900">
    //             <h2 className="text-xl font-semibold mb-2">You're not logged in</h2>
    //             <p className="mb-4 text-gray-600">Please log in to access this AI chat panel</p>
    //             <Link
    //                 href="/dashboard"
    //                 className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
    //             >
    //                 Go to Login
    //             </Link>
    //         </div>
    //     );
    // }

    return (
        <div className="flex-1 flex flex-col">
            {/* MCP Management Modal */}
            <MCPManagementModal
                isOpen={showMcpModal}
                onClose={() => setShowMcpModal(false)}
                mcpStatus={mcpStatus}
                onStatusUpdate={loadMCPStatus}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete this message? This action cannot be undone.</p>
                        <div className="flex space-x-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Header with Clean Design */}
            <ChatHeader
                isStreaming={isStreaming}
                hasMessages={chatHistory.length > 0}
                toolsEnabled={mcpEnabled}
                mcpServers={mcpServers}
                onToolsToggle={setMcpEnabled}
                onServerToggle={handleServerToggle}
                onStopStreaming={handleStopStreaming}
                onClearMessages={handleClearAllMessages}
            />

            {!profile && (
                <>
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
                </>
            )

            }

            {
                profile && (
                    <>
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
                                    <div key={msg.id} className="relative group">
                                        <ChatMessageItem
                                            message={msg}
                                            isLoading={isLoading && index === chatHistory.length - 1}
                                            isLast={index === chatHistory.length - 1}
                                        />

                                        {/* Delete Message Button */}
                                        <button
                                            onClick={() => setShowDeleteConfirm(msg.id)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
                                            title="Delete this message"
                                            disabled={deletingMessages.has(msg.id)}
                                        >
                                            {deletingMessages.has(msg.id) ? (
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                            ) : (
                                                <X size={16} className="text-gray-400 hover:text-red-600" />
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <ChatInput
                            message={message}
                            isLoading={isLoading}
                            isStreaming={isStreaming}
                            mcpEnabled={mcpEnabled}
                            mcpStatus={mcpStatus}
                            selectedModel={selectedModel}
                            textareaRef={textareaRef}
                            onMessageChange={setMessage}
                            onSendMessage={handleSendMessage}
                            onKeyPress={handleKeyPress}
                            onStopStreaming={handleStopStreaming}
                            onModelChange={setSelectedModel}
                        />
                    </>
                )
            }


        </div >
    );
};

ChatPanel.defaultProps = {
    selectedConversation: null,
    onConversationCreated: () => { },
    refreshTrigger: 0
};

export default ChatPanel;
