import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle, XCircle, AlertCircle, RefreshCw, Lock } from 'lucide-react';

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

interface MCPTool {
    name: string;
    description: string;
    inputSchema?: any;
}

interface MCPServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    servers: MCPServer[];
    onServerToggle: (serverName: string, enabled: boolean) => void;
    onRefresh?: () => void;
}

// Define default/always-enabled servers
const DEFAULT_SERVERS = ['nodit', 'agent-base'];

export const MCPServerModal: React.FC<MCPServerModalProps> = ({
    isOpen,
    onClose,
    servers,
    onServerToggle,
    onRefresh
}) => {
    const [loading, setLoading] = useState(false);
    const [serverTools, setServerTools] = useState<Record<string, MCPTool[]>>({});

    // Load tools for each server
    useEffect(() => {
        if (isOpen) {
            loadAllTools();
        }
    }, [isOpen]);

    const loadAllTools = async () => {
        try {
            const response = await fetch('/api/mcp/tools');
            const data = await response.json();
            if (data.success) {
                setServerTools(data.tools || {});
            }
        } catch (error) {
            console.error('Failed to load tools:', error);
        }
    };
  
    const isDefaultServer = (serverName: string) => {
        return DEFAULT_SERVERS.includes(serverName);
    };

    // Handle Enable All
    const handleEnableAll = () => {
        servers.forEach(server => {
            if (server.status === 'connected' && !server.enabled && !isDefaultServer(server.name)) {
                onServerToggle(server.name, true);
            }
        });
    };

    // Handle Disable All (exclude defaults)
    const handleDisableAll = () => {
        servers.forEach(server => {
            if (server.enabled && !isDefaultServer(server.name)) {
                onServerToggle(server.name, false);
            }
        });
    };

    if (!isOpen) return null;

    const nonDefaultServers = servers.filter(s => !isDefaultServer(s.name));
    const availableNonDefaultServers = nonDefaultServers.filter(s => s.status === 'connected');
    const enabledNonDefaultServers = availableNonDefaultServers.filter(s => s.enabled);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Server className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Select MCP Servers</h2>
                            <p className="text-sm text-gray-600">
                                Choose which servers to enable for your chat conversations
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/*{onRefresh && (
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    onRefresh();
                                    loadAllTools().finally(() => setLoading(false));
                                }}
                                disabled={loading}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh server status"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        )}*/}
                        
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Server Grid - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {servers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {servers.map((server: any, index: number) => {

                                    if (index < 3) {
                                        return
                                    }

                                    return (
                                        <ServerCard
                                        key={server.name}
                                        server={server}
                                        tools={serverTools[server.name] || []}
                                        isDefault={isDefaultServer(server.name)}
                                        onToggle={() => onServerToggle(server.name, !server.enabled)}
                                    />
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No MCP Servers Found</h3>
                                <p className="text-gray-600">
                                    Make sure your Railway MCP service is running and accessible.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Selected servers will be available for use in your chat conversations
                        </div>
                        
                        <div className="flex gap-3">
                            {/* Enable All Button */}
                            <button
                                onClick={handleEnableAll}
                                disabled={availableNonDefaultServers.length === 0 || enabledNonDefaultServers.length === availableNonDefaultServers.length}
                                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Enable All
                            </button>

                            {/* Disable All Button */}
                            <button
                                onClick={handleDisableAll}
                                disabled={enabledNonDefaultServers.length === 0}
                                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Disable All
                            </button>
                            
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simplified Server Card Component
const ServerCard: React.FC<{
    server: MCPServer;
    tools: MCPTool[];
    isDefault: boolean;
    onToggle: () => void;
}> = ({ server, tools, isDefault, onToggle }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'disconnected':
                return <XCircle className="w-5 h-5 text-gray-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'connected': return 'bg-green-100 text-green-700 border-green-200';
            case 'disconnected': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'error': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const canBeToggled = server.status === 'connected' && !isDefault;
    const isEnabledOrDefault = server.enabled || isDefault;

    return (
        <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
            isEnabledOrDefault 
                ? 'border-blue-500 bg-blue-50' 
                : server.status === 'connected' 
                ? 'border-gray-200 bg-white hover:border-gray-300' 
                : 'border-gray-200 bg-gray-50'
        }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {/* {getStatusIcon(server.status)} */}
                    <h3 className="font-semibold text-gray-900">{server.name}</h3>
                    {/* {isDefault && (
                        <Lock className="w-4 h-4 text-blue-600" title="Always enabled" />
                    )} */}
                </div>
                
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(server.status)}`}>
                        {server.status}
                    </span>
                    {isDefault && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border-blue-200">
                            default
                        </span>
                    )}
                </div>
            </div>
 
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {tools.length} tool{tools.length !== 1 ? 's' : ''} available
                </div>

                {isDefault ? (
                    <span className="text-sm text-blue-600 font-medium">
                        Always enabled
                    </span>
                ) : canBeToggled ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={server.enabled}
                            onChange={onToggle}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {server.enabled ? 'Enabled' : 'Enable'}
                        </span>
                    </label>
                ) : (
                    <span className="text-xs text-gray-400">
                        {server.status === 'error' ? 'Error' : 'Not available'}
                    </span>
                )}
            </div>

            {server.error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    {server.error}
                </div>
            )}
        </div>
    );
};

export default MCPServerModal;
