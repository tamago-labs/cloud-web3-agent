'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Server,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    RefreshCw,
    Play,
    Square,
    Settings,
    Wrench,
    Power,
    ExternalLink
} from 'lucide-react';
import { MCPStatus, MCPServerInfo, serverConfigs } from '@/components/mcp/types';
import Footer from "@/components/Footer"
import Header from "@/components/V2/Landing/Header"

const MCPServerStatusPage = () => {
    const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
    const [serverDetails, setServerDetails] = useState<MCPServerInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMCPStatus();
    }, []);

    const loadMCPStatus = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch MCP status
            const response = await fetch('/api/mcp');
            const data = await response.json();

            if (data.success) {

                setMcpStatus(data.status);

                // Build server details from status
                const servers: MCPServerInfo[] = data.status.registeredServers.map((serverName: string) => ({
                    name: serverName,
                    connected: data.status.connectedServers.includes(serverName),
                    registered: true,
                    description: serverConfigs[serverName]?.description || 'Custom MCP server',
                    tools: 0, // Will be updated when we fetch tools
                    lastSeen: data.status.connectedServers.includes(serverName)
                        ? new Date().toISOString()
                        : undefined
                }));

                setServerDetails(servers);
            } else {
                setError(data.error || 'Failed to load MCP status');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load server status');
            setMcpStatus(null);
        } finally {
            setLoading(false);
        }
    };


    const handleServerAction = async (serverName: string, action: 'connect' | 'disconnect') => {
        setActionLoading(serverName);
        try {
            const response = await fetch('/api/mcp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    serverName
                })
            });

            const data = await response.json();
            if (data.success) {
                // Refresh status after action
                await loadMCPStatus();
            } else {
                setError(`Failed to ${action} ${serverName}: ${data.error}`);
            }
        } catch (error) {
            setError(`Error ${action}ing ${serverName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const initializeAllServers = async () => {
        setActionLoading('all');
        try {
            const response = await fetch('/api/mcp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'initialize',
                    serverName: ['filesystem', 'web3-mcp', 'nodit']
                })
            });

            const data = await response.json();
            if (data.success) {
                await loadMCPStatus();
            } else {
                setError(`Failed to initialize servers: ${data.error}`);
            }
        } catch (error) {
            setError(`Error initializing servers: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusIcon = (connected: boolean) => {
        return connected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
            <XCircle className="w-5 h-5 text-gray-400" />
        );
    };

    const getServerIcon = (server: MCPServerInfo) => {
        if (actionLoading === server.name) {
            return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
        }

        return server.connected ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
        );
    };

    const getStatusColor = (connected: boolean) => {
        return connected ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
    };

    const formatLastSeen = (timestamp?: string) => {
        if (!timestamp) return 'Never';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const connectedCount = serverDetails.filter(s => s.connected).length;
    const totalServers = serverDetails.length;
    const totalTools = serverDetails.reduce((sum, s) => sum + (s.tools || 0), 0);

    const isLocalMode = process.env.NEXT_PUBLIC_MODE === "LOCAL"
 
    

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                bgColor="bg-gray-50"
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
                {/* Railway Service Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4"> MCP Server Status</h2>

                    {mcpStatus ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {mcpStatus.healthy ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {mcpStatus.healthy ? 'Service Healthy' : 'Service Unavailable'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {mcpStatus.serviceUrl}
                                    </div>
                                    {mcpStatus.error && (
                                        <div className="text-sm text-red-600">
                                            Error: {mcpStatus.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <a
                                href={mcpStatus.serviceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                                <span>View Service</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-600">Unable to connect to MCP service</span>
                        </div>
                    )}
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {connectedCount}
                                </div>
                                <div className="text-sm text-gray-600">Online</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <XCircle className="w-8 h-8 text-gray-400" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalServers - connectedCount}
                                </div>
                                <div className="text-sm text-gray-600">Offline</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <Wrench className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {/*{totalTools}*/}
                                    100+
                                </div>
                                <div className="text-sm text-gray-600">Available Tools</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Server List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Server Details</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Check out the MCP servers we've prepared that allow to chat with AI using tools with no setup needed
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">Loading server status...</span>
                        </div>
                    ) : serverDetails.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Server className="w-6 h-6 text-gray-400" />
                            <span className="ml-2 text-gray-600">No MCP servers registered</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {serverDetails.map((server) => (
                                <div key={server.name} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {getServerIcon(server)}

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                                                        {server.name.replace('-', ' ')}
                                                    </h3>
                                                    {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(server.connected)}`}>
                                                        {server.connected ? 'Connected' : 'Disconnected'}
                                                    </span> */}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {server.description}
                                                </p>

                                                {/* Server Features */}
                                                {/*{serverConfigs[server.name]?.features && (
                                                    <div className="mt-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {serverConfigs[server.name].features.slice(0, 4).map((feature, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                                                                >
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                            {serverConfigs[server.name].features.length > 4 && (
                                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                    +{serverConfigs[server.name].features.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}*/}

                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                    {/*  <span>
                                                        <Wrench className="w-3 h-3 inline mr-1" />
                                                        {server.tools || 0} tools
                                                    </span>*/}
                                                    <span>Last seen: {formatLastSeen(server.lastSeen)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {isLocalMode ? (
  <div className="flex items-center space-x-2">
    {server.connected ? (
      <button
        onClick={() => handleServerAction(server.name, 'disconnect')}
        disabled={actionLoading === server.name}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      >
        <Square size={14} />
        <span>Disconnect</span>
      </button>
    ) : (
      <button
        onClick={() => handleServerAction(server.name, 'connect')}
        disabled={actionLoading === server.name || !mcpStatus?.healthy}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
      >
        <Play size={14} />
        <span>Connect</span>
      </button>
    )}
  </div>
) : (
  <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full 
    ${
      server.connected
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-500'
    }`}
  >
    {server.connected ? 'Online' : 'Offline'}
  </div>
)}

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </div>
            <Footer />
        </div>
    );
};

export default MCPServerStatusPage;