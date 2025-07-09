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
    Wrench
} from 'lucide-react';

interface MCPServer {
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    lastSeen?: string;
    error?: string;
}

const MCPServerStatusPage = () => {
    
    const [servers, setServers] = useState<MCPServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock data - replace with actual API calls
    const mockServers: MCPServer[] = [
        {
            name: 'filesystem',
            description: 'File system operations in /tmp directory',
            status: 'connected',
            tools: 6,
            lastSeen: new Date().toISOString()
        },
        {
            name: 'web3-mcp',
            description: 'Web3 blockchain interactions',
            status: 'disconnected',
            tools: 12,
            lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
            name: 'nodit',
            description: 'Blockchain data queries via Nodit API',
            status: 'error',
            tools: 8,
            error: 'API key not configured',
            lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        }
    ];

    useEffect(() => {
        loadServerStatus();
    }, []);

    const loadServerStatus = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Replace with actual API call
            // const response = await fetch('/api/mcp/servers');
            // const data = await response.json();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setServers(mockServers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load server status');
        } finally {
            setLoading(false);
        }
    };

    const refreshStatus = async () => {
        setRefreshing(true);
        await loadServerStatus();
        setRefreshing(false);
    };

    const connectServer = async (serverName: string) => {
        try {
            // Replace with actual API call
            // await fetch('/api/mcp/connect', {
            //     method: 'POST',
            //     body: JSON.stringify({ serverName })
            // });
            
            // Update local state optimistically
            setServers(prev => prev.map(server => 
                server.name === serverName 
                    ? { ...server, status: 'connected' as const, lastSeen: new Date().toISOString() }
                    : server
            ));
        } catch (err) {
            console.error('Failed to connect server:', err);
        }
    };

    const disconnectServer = async (serverName: string) => {
        try {
            // Replace with actual API call
            // await fetch(`/api/mcp/disconnect/${serverName}`, {
            //     method: 'DELETE'
            // });
            
            // Update local state optimistically
            setServers(prev => prev.map(server => 
                server.name === serverName 
                    ? { ...server, status: 'disconnected' as const }
                    : server
            ));
        } catch (err) {
            console.error('Failed to disconnect server:', err);
        }
    };

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return 'text-green-600 bg-green-50';
            case 'disconnected':
                return 'text-gray-600 bg-gray-50';
            case 'error':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/chat"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Chat</span>
                            </Link>
                            
                            <div className="h-6 w-px bg-gray-300" />
                            
                            <div className="flex items-center space-x-2">
                                <Server className="w-5 h-5 text-gray-400" />
                                <h1 className="text-xl font-semibold text-gray-900">MCP Server Status</h1>
                            </div>
                        </div>

                        <button
                            onClick={refreshStatus}
                            disabled={refreshing}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {servers.filter(s => s.status === 'connected').length}
                                </div>
                                <div className="text-sm text-gray-600">Connected</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <XCircle className="w-8 h-8 text-gray-400" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {servers.filter(s => s.status === 'disconnected').length}
                                </div>
                                <div className="text-sm text-gray-600">Disconnected</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <Wrench className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {servers.reduce((sum, s) => sum + s.tools, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Tools</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Server List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Server Details</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your MCP server connections and monitor their status
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">Loading server status...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <span className="ml-2 text-red-600">{error}</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {servers.map((server) => (
                                <div key={server.name} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {getStatusIcon(server.status)}
                                            
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {server.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                                                        {server.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {server.description}
                                                </p>
                                                
                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                    <span>
                                                        <Wrench className="w-3 h-3 inline mr-1" />
                                                        {server.tools} tools
                                                    </span>
                                                    <span>Last seen: {formatLastSeen(server.lastSeen)}</span>
                                                    {server.error && (
                                                        <span className="text-red-600">
                                                            Error: {server.error}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {server.status === 'connected' ? (
                                                <button
                                                    onClick={() => disconnectServer(server.name)}
                                                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <Square size={14} />
                                                    <span>Disconnect</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => connectServer(server.name)}
                                                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                                                >
                                                    <Play size={14} />
                                                    <span>Connect</span>
                                                </button>
                                            )}
                                            
                                            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                                                <Settings size={14} />
                                                <span>Configure</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">About MCP Servers</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        MCP (Model Context Protocol) servers provide tools and capabilities to your AI assistant. 
                        Connect the servers you need to enable specific functionalities like file operations, 
                        blockchain interactions, and data analysis. Each server provides a set of tools that 
                        can be used during conversations.
                    </p>
                    
                    <div className="mt-4">
                        <Link
                            href="https://modelcontextprotocol.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                            Learn more about MCP →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MCPServerStatusPage;
