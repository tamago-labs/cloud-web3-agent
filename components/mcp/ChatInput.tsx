import React, { useState } from 'react';
import { Send, Loader2, Square, ChevronDown, Bot, Server, Settings } from 'lucide-react';
import { MCPStatus } from './types';

// Define available AI models
export interface AIModel {
    id: string;
    name: string;
    description: string;
    maxTokens: number;
    provider: string;
}

export const availableModels: AIModel[] = [
    {
        id: 'claude-sonnet-4',
        name: 'Claude 4 Sonnet',
        description: 'Most capable model for complex tasks',
        maxTokens: 4096,
        provider: 'Anthropic'
    },
    // Future models can be added here
    // {
    //     id: 'claude-opus-4',
    //     name: 'Claude 4 Opus',
    //     description: 'Most powerful model for demanding tasks',
    //     maxTokens: 4096,
    //     provider: 'Anthropic'
    // },
    // {
    //     id: 'gpt-4',
    //     name: 'GPT-4',
    //     description: 'OpenAI\'s most advanced model',
    //     maxTokens: 8192,
    //     provider: 'OpenAI'
    // }
];

interface MCPServer {
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    enabled: boolean;
    registered: boolean;
    lastSeen?: string;
    error?: string;
}

interface ChatInputProps {
    message: string;
    isLoading: boolean;
    isStreaming?: boolean;
    mcpEnabled: boolean;
    mcpStatus: MCPStatus | null;
    mcpServers?: MCPServer[];
    selectedModel?: string;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onMessageChange: (message: string) => void;
    onSendMessage: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onStopStreaming?: () => void;
    onModelChange?: (modelId: string) => void;
    onServerToggle?: (serverName: string, enabled: boolean) => void;
    onOpenServerModal?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    message,
    isLoading,
    isStreaming = false,
    mcpEnabled,
    mcpStatus,
    mcpServers = [],
    selectedModel = 'claude-sonnet-4',
    textareaRef,
    onMessageChange,
    onSendMessage,
    onKeyPress,
    onStopStreaming,
    onModelChange,
    onServerToggle,
    onOpenServerModal
}) => {
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [showServerSelector, setShowServerSelector] = useState(false);
    
    const currentModel = availableModels.find(model => model.id === selectedModel) || availableModels[0];
    const enabledServers = mcpServers.filter(s => s.enabled && s.status === 'connected');
    const connectedServers = mcpServers.filter(s => s.status === 'connected');
    const isDefaultServer = (serverName: string) => ['nodit', 'agent-base'].includes(serverName);
    
    const placeholder = mcpEnabled && mcpStatus?.healthy ? 
        "Ask me to create files, check balances, analyze data..." : 
        "Ask about DeFi protocols, yield opportunities, portfolio analysis...";

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // Allow stopping with Escape key
        if (e.key === 'Escape' && isStreaming && onStopStreaming) {
            e.preventDefault();
            onStopStreaming();
            return;
        }
        
        // Close selectors with Escape
        if (e.key === 'Escape' && (showModelSelector || showServerSelector)) {
            e.preventDefault();
            setShowModelSelector(false);
            setShowServerSelector(false);
            return;
        }
        
        // Prevent sending new messages while streaming
        if (isStreaming && e.key === 'Enter') {
            e.preventDefault();
            return;
        }
        
        onKeyPress(e);
    };

    const handleModelSelect = (modelId: string) => {
        if (onModelChange) {
            onModelChange(modelId);
        }
        setShowModelSelector(false);
    };

    const handleServerToggle = (serverName: string, enabled: boolean) => {
        if (onServerToggle) {
            onServerToggle(serverName, enabled);
        }
    };

    const getServerStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'text-green-600';
            case 'error': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const getServerStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3 items-end">




                {/* AI Model Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowModelSelector(!showModelSelector)}
                        disabled={isLoading || isStreaming}
                        className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors min-w-[140px]"
                        title={`Current model: ${currentModel.name}`}
                    >
                        <Bot className="w-4 h-4 text-gray-600" />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[80px]">
                                {currentModel.name}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Model Dropdown */}
                    {showModelSelector && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
                            <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                                    Select AI Model
                                </div>
                                {availableModels.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => handleModelSelect(model.id)}
                                        className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                                            selectedModel === model.id ? 'bg-blue-50 border border-blue-200' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{model.name}</span>
                                                    {selectedModel === model.id && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs text-gray-500">{model.provider}</span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-gray-500">{model.maxTokens.toLocaleString()} tokens</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                {/* MCP Server Selector */}
                {mcpEnabled && mcpServers.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowServerSelector(!showServerSelector)}
                            disabled={isLoading || isStreaming}
                            className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors min-w-[160px]"
                            title={`${enabledServers.length} servers enabled`}
                        >
                            <Server className="w-4 h-4 text-gray-600" />
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-900">
                                    {enabledServers.length > 2 ? `${enabledServers.length-2} Active` : '0 Active'}
                                </span>
                                {/* <span className="text-xs text-gray-500">
                                    {enabledServers.length > 2 ? 'Active' : connectedServers.length > 0 ? 'Available' : 'None'}
                                </span> */}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showServerSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Server Dropdown */}
                        {showServerSelector && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px] max-h-[400px] overflow-y-auto">
                                <div className="p-2">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-2">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            MCP Servers
                                        </span>
                                        {/* {onOpenServerModal && (
                                            <button
                                                onClick={() => {
                                                    onOpenServerModal();
                                                    setShowServerSelector(false);
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                            >
                                                <Settings className="w-3 h-3" />
                                                Manage
                                            </button>
                                        )} */}
                                    </div>
                                    
                                    {mcpServers.map((server) => (
                                        <div
                                            key={server.name}
                                            className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getServerStatusIcon(server.status)}`}></div>
                                                    <span className="font-medium text-gray-900 text-sm">{server.name}</span>
                                                    {isDefaultServer(server.name) && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Default</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{server.description}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`text-xs capitalize ${getServerStatusColor(server.status)}`}>
                                                        {server.status}
                                                    </span>
                                                    {server.tools > 0 && (
                                                        <>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">{server.tools} tools</span>
                                                        </>
                                                    )}
                                                </div>
                                                {server.error && (
                                                    <p className="text-xs text-red-600 mt-1">{server.error}</p>
                                                )}
                                            </div>
                                            
                                            <div className="ml-3">
                                                {!isDefaultServer(server.name) && server.status === 'connected' ? (
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={server.enabled}
                                                            onChange={(e) => handleServerToggle(server.name, e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                ) : isDefaultServer(server.name) && server.status === 'connected' ? (
                                                    <span className="text-xs text-green-600 font-medium">Always On</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {mcpServers.length === 0 && (
                                        <div className="px-3 py-6 text-center text-gray-500">
                                            <Server className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm">No MCP servers available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Message Input */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isStreaming ? "Response is being generated..." : placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] disabled:bg-gray-50 disabled:text-gray-500"
                    rows={1}
                    disabled={isLoading || isStreaming}
                />
                
                {/* Send/Stop Button */}
                {isStreaming ? (
                    <button
                        onClick={onStopStreaming}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2 font-medium min-w-[80px]"
                        title="Stop generating response (or press Escape)"
                    >
                        <Square className="w-4 h-4" />
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={onSendMessage}
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
                )}
            </div>
            
            {/* Status and Help Text */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                    {isStreaming ? (
                        <span className="text-blue-600 flex items-center gap-1">  
                            <div className="animate-spin rounded-full h-2.5 w-2.5 border-2 border-blue-600 border-t-transparent"></div>
                            Generating response... (Press Escape or click Stop to cancel)
                        </span>
                    ) : (
                        <span>Press Enter to send, Shift + Enter for new line</span>
                    )}
                </div>
                
                <div className="flex items-center space-x-3">
                    {/* Model Info */}
                    <span className="text-gray-400">
                        {currentModel.name} • {currentModel.maxTokens.toLocaleString()} tokens
                    </span>
                    
                    {/* MCP Status */}
                    {mcpEnabled && mcpStatus?.healthy && (
                        <span className="text-green-600 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            MCP Tools Ready
                        </span>
                    )}
                    
                    {mcpEnabled && mcpStatus && !mcpStatus.healthy && (
                        <span className="text-red-600 flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            MCP Unavailable
                        </span>
                    )}
                </div>
            </div> 

            {/* Click outside to close selectors */}
            {(showModelSelector || showServerSelector) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowModelSelector(false);
                        setShowServerSelector(false);
                    }}
                />
            )}
        </div>
    );
};

export default ChatInput;