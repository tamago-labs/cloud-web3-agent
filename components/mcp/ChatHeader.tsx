import React from 'react';
import Link from 'next/link';
import { Home, User, Square, Trash2, Settings, Server } from 'lucide-react';
import { MCPServerSelector } from './MCPServerSelector';

interface MCPServer {
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    enabled: boolean;
}

interface ChatHeaderProps {
    isStreaming?: boolean;
    hasMessages?: boolean;
    toolsEnabled: boolean;
    mcpServers?: MCPServer[];
    onToolsToggle: (enabled: boolean) => void;
    onServerToggle?: (serverName: string, enabled: boolean) => void;
    onStopStreaming?: () => void;
    onClearMessages?: () => void;
    onOpenServerModal?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    isStreaming = false,
    hasMessages = false,
    toolsEnabled,
    mcpServers = [],
    onToolsToggle,
    onServerToggle,
    onStopStreaming,
    onClearMessages,
    onOpenServerModal
}) => {
    const enabledServers = mcpServers.filter(s => s.enabled && s.status === 'connected');
    const connectedServers = mcpServers.filter(s => s.status === 'connected');

    return (
        <div className="border-b border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between">
                {/* Left Section - Title and Navigation */}
                <div className="flex items-center space-x-6">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Online Client</h1>
                    </div>
                    
                    {/* Navigation Links */}
                    <nav className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <Home size={16} />
                            <span>Home</span>
                        </Link>
                        
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <User size={16} />
                            <span>Dashboard</span>
                        </Link>
                    </nav>
                </div>

                {/* Right Section - Controls */}
                <div className="flex items-center space-x-3">
                    {/* MCP Server Summary & Management */}
                    {toolsEnabled && (
                        <div className="flex items-center gap-3">
                            {/* Quick Server Summary */}
                            {mcpServers.length > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                                    <div className={`w-2 h-2 rounded-full ${
                                        enabledServers.length > 2 ? 'bg-green-500' : 
                                        connectedServers.length > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                                    }`} />
                                    <span className="text-gray-700">
                                        {enabledServers.length > 2 
                                            ? `${enabledServers.length-2} servers active`
                                            : connectedServers.length > 0 
                                            ? `${connectedServers.length-2} available`
                                            : 'No servers connected'
                                        }
                                    </span>
                                </div>
                            )}

                            {/* Server Management Button */}
                            <button
                                onClick={onOpenServerModal}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                title="Manage MCP servers"
                            >
                                <Server size={16} />
                                <span>Manage Servers</span>
                            </button>
                        </div>
                    )}

                    {/* Legacy Server Selector (fallback) */}
                    {toolsEnabled && mcpServers.length > 0 && onServerToggle && !onOpenServerModal && (
                        <MCPServerSelector
                            servers={mcpServers}
                            onServerToggle={onServerToggle}
                            disabled={isStreaming}
                        />
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {/* Stop Streaming Button */}
                        {isStreaming && onStopStreaming && (
                            <button
                                onClick={onStopStreaming}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                title="Stop generating response"
                            >
                                <Square size={16} />
                                <span className="text-sm font-medium">Stop</span>
                            </button>
                        )}
                        
                        {/* Clear Chat Button */}
                        {hasMessages && onClearMessages && (
                            <button
                                onClick={onClearMessages}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                title="Clear all messages"
                            >
                                <Trash2 size={16} />
                                <span className="text-sm font-medium">Clear Chat</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
