'use client';

import React, { useState, useEffect } from 'react';
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
    ExternalLink,
    Brain,
    Bot,
    Cloud,
    Zap,
    Activity,
    Database,
    Cpu,
    Globe,
    Shield
} from 'lucide-react';
import { MCPStatus, MCPServerInfo, serverConfigs } from '@/components/mcp/types';
import Footer from "@/components/Footer"
import Header from "@/components/V2/Landing/Header"

// AI Server interface
interface AIServerInfo {
    id: string;
    name: string;
    provider: string;
    model: string;
    status: 'online' | 'offline' | 'maintenance';
    region: string;
    endpoint?: string;
    capabilities: string[];
    latency?: number;
    uptime?: string;
    lastUsed?: string;
    description: string;
    icon: React.ComponentType<any>;
    statusColor: string;
    version?: string;
}

// Mock AI servers data
const aiServers: AIServerInfo[] = [
    {
        id: 'claude-sonnet-4',
        name: 'Claude Sonnet 4',
        provider: 'AWS Bedrock',
        model: 'claude-sonnet-4-20250514',
        status: 'online',
        region: 'ap-southeast-1',
        endpoint: 'bedrock.ap-southeast-1.amazonaws.com',
        capabilities: ['Text Generation', 'Code Analysis', 'Tool Usage', 'Reasoning', 'Math'],
        latency: 1240,
        uptime: '99.9%',
        lastUsed: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        description: 'This is the primary AI model running on AWS Bedrock. It ensures that your data remains private and is not used to train any public models.',
        icon: Zap,
        statusColor: 'text-green-600 bg-green-50',
        version: '2025-05-14'
    },
    {
        id: 'gpt-4-turbo',
        name: 'DeepSeek-R1',
        provider: 'AWS Bedrock',
        model: 'gpt-4-turbo-2024-04-09',
        status: 'offline',
        region: 'us-east-1',
        endpoint: 'asetta-openai.openai.azure.com',
        capabilities: ['Text Generation', 'Code Analysis', 'Tool Usage', 'Reasoning', 'Math'],
        latency: 980,
        uptime: 'N/A',
        lastUsed: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        description: 'This is an alternative model within the system, currently not available to public users.',
        icon: Globe,
        statusColor: 'text-yellow-600 bg-yellow-50',
        version: '2024-04-09'
    },
    {
        id: 'gpt-4-turbo',
        name: 'Meta Llama 4',
        provider: 'AWS Bedrock',
        model: 'gpt-4-turbo-2024-04-09',
        status: 'offline',
        region: 'us-east-1',
        endpoint: 'asetta-openai.openai.azure.com',
        capabilities: ['Text Generation', 'Code Analysis', 'Tool Usage', 'Reasoning', 'Math'],
        latency: 980,
        uptime: 'N/A',
        lastUsed: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        description: 'This is also an alternative model within the system, currently not available to public users.',
        icon: Database,
        statusColor: 'text-yellow-600 bg-yellow-50',
        version: '2024-04-09'
    }
];

const EnhancedServerStatusPage = () => {
    const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
    const [serverDetails, setServerDetails] = useState<MCPServerInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'mcp' | 'ai'>('overview');
    const [aiServersData, setAiServersData] = useState<AIServerInfo[]>(aiServers);

    useEffect(() => {
        loadMCPStatus();
        // Simulate AI server status updates
        const interval = setInterval(() => {
            updateAIServerStatus();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const updateAIServerStatus = () => {
        setAiServersData(prev => prev.map(server => ({
            ...server,
            latency: server.status === 'online' ?
                Math.floor(Math.random() * 1000) + 800 : server.latency,
            lastUsed: server.status === 'online' ?
                new Date().toISOString() : server.lastUsed
        })));
    };

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
                    tools: 0,
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'maintenance':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'offline':
                return <XCircle className="w-5 h-5 text-gray-400" />;
            default:
                return <XCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const formatLastUsed = (timestamp?: string) => {
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

    const connectedMcpCount = serverDetails.filter(s => s.connected).length;
    const totalMcpServers = serverDetails.length;
    const onlineAiCount = aiServersData.filter(s => s.status === 'online').length;
    const totalAiServers = aiServersData.length;

    const isLocalMode = process.env.NEXT_PUBLIC_MODE === "LOCAL";

    return (
        <div className="min-h-screen bg-gray-50">
            <Header bgColor="bg-gray-50" />

            {/* Content */}
            <div className="max-w-7xl min-h-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Status Dashboard</h1>
                    <p className="text-gray-600">Monitor the health and status of MCP servers and AI models</p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Activity className="w-4 h-4 inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('mcp')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'mcp'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Server className="w-4 h-4 inline mr-2" />
                            MCP Servers ({totalMcpServers})
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'ai'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Cloud className="w-4 h-4 inline mr-2" />
                            AI Models ({totalAiServers})
                        </button>
                    </nav>
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

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Status Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <Server className="w-8 h-8 text-blue-600" />
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {connectedMcpCount}/{totalMcpServers}
                                        </div>
                                        <div className="text-sm text-gray-600">MCP Servers</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <Cloud className="w-8 h-8 text-purple-600" />
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {onlineAiCount}/{totalAiServers}
                                        </div>
                                        <div className="text-sm text-gray-600">AI Models</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <Wrench className="w-8 h-8 text-green-600" />
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">50+</div>
                                        <div className="text-sm text-gray-600">Available Tools</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center">
                                    <Shield className="w-8 h-8 text-indigo-600" />
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-gray-900">99.9%</div>
                                        <div className="text-sm text-gray-600">Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Status Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* MCP Summary */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">MCP Server Status</h3>
                                <div className="space-y-3">
                                    {serverDetails.slice(0, 3).map((server) => (
                                        <div key={server.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {server.connected ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className="text-sm font-medium text-gray-900 capitalize">
                                                    {server.name.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${server.connected
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {server.connected ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Models Summary */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">AI Model Status</h3>
                                <div className="space-y-3">
                                    {aiServersData.slice(0, 3).map((server) => (
                                        <div key={server.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(server.status)}
                                                <span className="text-sm font-medium text-gray-900">
                                                    {server.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {server.status === 'online' && server.latency && (
                                                    <span className="text-xs text-gray-500">
                                                        {server.latency}ms
                                                    </span>
                                                )}
                                                <span className={`text-xs px-2 py-1 rounded-full ${server.status === 'online'
                                                    ? 'bg-green-100 text-green-800'
                                                    : server.status === 'maintenance'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {server.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MCP Servers Tab */}
                {activeTab === 'mcp' && (
                    <div className="space-y-6">
                        {/* MCP Service Status */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">MCP Service Status</h2>
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

                        {/* MCP Servers List */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Server Details</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    MCP servers provide tools and capabilities for AI chat interactions
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
                                                    {server.connected ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-gray-400" />
                                                    )}

                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <h4 className="text-lg font-medium text-gray-900 capitalize">
                                                                {server.name.replace('-', ' ')}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {server.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Last seen: {formatLastUsed(server.lastSeen)}</span>
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
                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${server.connected
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {server.connected ? 'Online' : 'Offline'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* AI Models Tab */}
                {activeTab === 'ai' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">AI Model Status</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Available AI models for chat interactions and reasoning tasks
                                </p>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {aiServersData.map((server: any, index: number) => {
                                    const IconComponent = server.icon;
                                    return (
                                        <div key={server.id} className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <IconComponent className="w-8 h-8 text-blue-600" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="text-lg font-medium text-gray-900">
                                                                {server.name}
                                                            </h4>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${server.statusColor}`}>
                                                                {server.status}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3  ">
                                                            {server.description}
                                                        </p>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-500">Provider:</span>
                                                                <div className="font-medium text-gray-900">{server.provider}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Region:</span>
                                                                <div className="font-medium text-gray-900">{server.region}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Latency:</span>
                                                                <div className="font-medium text-gray-900">
                                                                    {server.status === 'online' ? `${server.latency}ms` : 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Last Used:</span>
                                                                <div className="font-medium text-gray-900">
                                                                    {formatLastUsed(server.lastUsed)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Capabilities */}
                                                        <div className="mt-4">
                                                            <span className="text-sm text-gray-500 block mb-2">Capabilities:</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {server.capabilities.map((capability: any, idx: number) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                                                                    >
                                                                        {capability}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {index === 0 && (
                                                            <div className="mt-3">
                                                                <span className="text-sm text-gray-500">Pricing (per 1M tokens):</span>
                                                                <div className="text-xs grid grid-cols-4  text-gray-700 bg-gray-50 px-3 py-2 rounded mt-1 space-y-1 font-mono">
                                                                    <div>Input: $3.00</div>
                                                                    <div>Output: $15.00</div>
                                                                    <div>Cache Write: $3.75</div>
                                                                    <div>Cache Read: $0.30</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {index === 1 && (
                                                            <div className="mt-3">
                                                                <span className="text-sm text-gray-500">Pricing (per 1M tokens):</span>
                                                                <div className="text-xs grid grid-cols-2  text-gray-700 bg-gray-50 px-3 py-2 rounded mt-1 space-y-1 font-mono">
                                                                    <div>Input: $1.35</div>
                                                                    <div>Output: $5.40</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {index === 2 && (
                                                            <div className="mt-3">
                                                                <span className="text-sm text-gray-500">Pricing (per 1M tokens):</span>
                                                                <div className="text-xs grid grid-cols-2  text-gray-700 bg-gray-50 px-3 py-2 rounded mt-1 space-y-1 font-mono">
                                                                    <div>Input: $0.24</div>
                                                                    <div>Output: $0.97</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end space-y-2">
                                                    {getStatusIcon(server.status)}
                                                    {server.uptime && (
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500">Uptime</div>
                                                            <div className="text-sm font-medium text-gray-900">{server.uptime}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}

                {/* Refresh Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => {
                            loadMCPStatus();
                            updateAIServerStatus();
                        }}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Status</span>
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EnhancedServerStatusPage;