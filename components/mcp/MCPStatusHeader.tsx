import React from 'react';
import { Loader2, CheckCircle, XCircle, AlertCircle, Server, Settings } from 'lucide-react';
import { MCPStatus } from './types';

interface MCPStatusHeaderProps {
    mcpEnabled: boolean;
    mcpStatus: MCPStatus | null;
    mcpStatusLoading: boolean;
    onMcpToggle: (enabled: boolean) => void;
    onOpenModal: () => void;
}

export const MCPStatusHeader: React.FC<MCPStatusHeaderProps> = ({
    mcpEnabled,
    mcpStatus,
    mcpStatusLoading,
    onMcpToggle,
    onOpenModal
}) => {
    const getMCPStatusColor = () => {
        if (!mcpStatus) return 'text-gray-500';
        if (mcpStatus.healthy && mcpStatus.connectedServers.length > 0) return 'text-green-600';
        if (mcpStatus.healthy) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getMCPStatusIcon = () => {
        if (mcpStatusLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
        if (!mcpStatus) return <XCircle className="w-4 h-4" />;
        if (mcpStatus.healthy && mcpStatus.connectedServers.length > 0) return <CheckCircle className="w-4 h-4" />;
        if (mcpStatus.healthy) return <AlertCircle className="w-4 h-4" />;
        return <XCircle className="w-4 h-4" />;
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900">Web3 AI Assistant</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Powered by Claude 4</span>
                        
                        {/* MCP Status Indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getMCPStatusColor()}`}>
                                {getMCPStatusIcon()}
                                <span className="font-medium">
                                    MCP {mcpEnabled ? (mcpStatus?.healthy ? 'Active' : 'Error') : 'Disabled'}
                                </span>
                            </div>
                            
                            {mcpStatus && mcpStatus.connectedServers.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <Server className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                        {mcpStatus.connectedServers.length} servers
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* MCP Toggle */}
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={mcpEnabled}
                            onChange={(e) => onMcpToggle(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Enable Tools</span>
                    </label>

                    {/* MCP Management Button */}
                    {mcpEnabled && (
                        <button
                            onClick={onOpenModal}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                            title="Manage MCP Servers"
                        >
                            <Settings className="w-4 h-4" />
                            Manage Servers
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MCPStatusHeader;
