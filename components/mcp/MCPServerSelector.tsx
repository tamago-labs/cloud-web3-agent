import React, { useState } from 'react';
import { ChevronDown, Server, CheckCircle, XCircle, Settings } from 'lucide-react';
import Link from 'next/link';

interface MCPServer {
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    enabled: boolean;
}

interface MCPServerSelectorProps {
    servers: MCPServer[];
    onServerToggle: (serverName: string, enabled: boolean) => void;
    disabled?: boolean;
}

export const MCPServerSelector: React.FC<MCPServerSelectorProps> = ({
    servers,
    onServerToggle,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const enabledServers = servers.filter(s => s.enabled);
    const connectedEnabledServers = enabledServers.filter(s => s.status === 'connected');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'disconnected':
                return <XCircle className="w-4 h-4 text-gray-400" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <XCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getSummaryText = () => {
        if (enabledServers.length === 0) {
            return 'No servers selected';
        }

        const connectedCount = connectedEnabledServers.length;
        const totalEnabled = enabledServers.length;

        if (connectedCount === 0) {
            return `${totalEnabled} selected (none connected)`;
        }

        if (connectedCount === totalEnabled) {
            return `${totalEnabled} server${totalEnabled === 1 ? '' : 's'} ready`;
        }

        return `${connectedCount}/${totalEnabled} servers ready`;
    };

    const getSummaryColor = () => {
        if (enabledServers.length === 0) {
            return 'text-gray-500';
        }

        const connectedCount = connectedEnabledServers.length;

        if (connectedCount === 0) {
            return 'text-red-600';
        }

        if (connectedCount === enabledServers.length) {
            return 'text-green-600';
        }

        return 'text-yellow-600';
    };

    return (
        <div className="relative">
            {/* Server Selector Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors min-w-[200px]"
                title="Select MCP servers to use"
            >
                <Server className="w-4 h-4 text-gray-600" />
                <div className="flex flex-col items-start flex-1">
                    <span className="text-sm font-medium text-gray-900">
                        MCP Servers
                    </span>
                    <span className={`text-xs ${getSummaryColor()}`}>
                        {getSummaryText()}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px]">
                    <div className="p-3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Select Servers</h3>
                                <p className="text-xs text-gray-500">Choose which tools to enable</p>
                            </div>
                            <Link
                                href="/mcp-server-status"
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                                onClick={() => setIsOpen(false)}
                            >
                                <Server className="w-3 h-3" />
                                Server Status
                            </Link>
                        </div>

                        {/* Server List */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {servers.map((server) => (
                                <label
                                    key={server.name}
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={server.enabled}
                                        onChange={(e) => onServerToggle(server.name, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    <div className="flex items-center gap-2 flex-1">
                                        {getStatusIcon(server.status)}

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {server.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {server.tools} tools
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                {server.description}
                                            </p>
                                        </div>

                                        {server.status !== 'connected' && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {server.status}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        servers.forEach(server => {
                                            if (!server.enabled) {
                                                onServerToggle(server.name, true);
                                            }
                                        });
                                    }}
                                    className="flex-1 text-xs text-blue-600 hover:text-blue-700 py-1"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => {
                                        servers.forEach(server => {
                                            if (server.enabled) {
                                                onServerToggle(server.name, false);
                                            }
                                        });
                                    }}
                                    className="flex-1 text-xs text-gray-600 hover:text-gray-700 py-1"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default MCPServerSelector;
