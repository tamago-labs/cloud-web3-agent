import React, { useState, useEffect } from 'react';
import { Server, CheckCircle, XCircle, X, Power, RefreshCw, Loader2 } from 'lucide-react';
import { MCPStatus, MCPServerInfo, serverConfigs } from './types';

interface MCPManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    mcpStatus: MCPStatus | null;
    onStatusUpdate: () => void;
}

export const MCPManagementModal: React.FC<MCPManagementModalProps> = ({ 
    isOpen, 
    onClose, 
    mcpStatus, 
    onStatusUpdate 
}) => {
    const [serverDetails, setServerDetails] = useState<MCPServerInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && mcpStatus) {
            loadServerDetails();
        }
    }, [isOpen, mcpStatus]);

    const loadServerDetails = () => {
        if (!mcpStatus) return;

        const servers: MCPServerInfo[] = mcpStatus.registeredServers.map(serverName => ({
            name: serverName,
            connected: mcpStatus.connectedServers.includes(serverName),
            registered: true,
            description: serverConfigs[serverName]?.description || 'Custom MCP server'
        }));

        setServerDetails(servers);
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
                await onStatusUpdate(); // Refresh parent status
                loadServerDetails(); // Refresh modal details
            } else {
                console.error(`Failed to ${action} ${serverName}:`, data.error);
            }
        } catch (error) {
            console.error(`Error ${action}ing ${serverName}:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    const initializeAllServers = async () => {
        setLoading(true);
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
                await onStatusUpdate();
                loadServerDetails();
            }
        } catch (error) {
            console.error('Failed to initialize servers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getServerIcon = (server: MCPServerInfo) => {
        if (actionLoading === server.name) {
            return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
        }
        
        if (server.connected) {
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        }
        
        return <XCircle className="w-4 h-4 text-gray-400" />;
    };

    const getServerStatusColor = (server: MCPServerInfo) => {
        if (server.connected) return 'border-green-200 bg-green-50';
        return 'border-gray-200 bg-gray-50';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-blue-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">MCP Server Management</h2>
                            <p className="text-sm text-gray-600">Manage your Model Context Protocol servers</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {/* Service Status */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Service Status</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {mcpStatus?.healthy ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="text-sm font-medium">
                                        Railway MCP Service
                                    </span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    mcpStatus?.healthy 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {mcpStatus?.healthy ? 'Healthy' : 'Unavailable'}
                                </span>
                            </div>
                            {mcpStatus?.serviceUrl && (
                                <div className="mt-2 text-xs text-gray-500">
                                    {mcpStatus.serviceUrl}
                                </div>
                            )}
                            {mcpStatus?.error && (
                                <div className="mt-2 text-xs text-red-600">
                                    Error: {mcpStatus.error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={initializeAllServers}
                                disabled={loading || !mcpStatus?.healthy}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Power className="w-4 h-4" />
                                )}
                                Initialize All Servers
                            </button>
                            <button
                                onClick={onStatusUpdate}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Status
                            </button>
                        </div>
                    </div>

                    {/* Server List */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Servers</h3>
                        <div className="space-y-3">
                            {serverDetails.map((server) => (
                                <div
                                    key={server.name}
                                    className={`border rounded-lg p-4 transition-colors ${getServerStatusColor(server)}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {getServerIcon(server)}
                                            <div>
                                                <h4 className="font-medium text-gray-900 capitalize">
                                                    {server.name.replace('-', ' ')}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {server.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                server.connected
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {server.connected ? 'Connected' : 'Disconnected'}
                                            </span>
                                            <button
                                                onClick={() => handleServerAction(
                                                    server.name,
                                                    server.connected ? 'disconnect' : 'connect'
                                                )}
                                                disabled={actionLoading === server.name || !mcpStatus?.healthy}
                                                className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    server.connected
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                }`}
                                            >
                                                {server.connected ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Server Features */}
                                    {serverConfigs[server.name]?.features && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-2">Features:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {serverConfigs[server.name].features.map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Usage Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Usage Tips</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• <strong>Filesystem:</strong> Use for creating files, reading data, managing documents</li>
                            <li>• <strong>Web3-MCP:</strong> Query token balances, transaction history, DeFi data</li>
                            <li>• <strong>Nodit:</strong> Access real-time blockchain analytics and metrics</li>
                            <li>• Enable only the servers you need to optimize performance</li>
                        </ul>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-xs text-gray-500">
                        Connected: {mcpStatus?.connectedServers.length || 0} / {mcpStatus?.registeredServers.length || 0} servers
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MCPManagementModal;
