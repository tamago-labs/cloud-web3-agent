
// /components/Dashboard/Tools/ChainToolCard.tsx - Enhanced with better display
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Zap, Lock } from 'lucide-react';
import type { ChainTool } from './ToolSelector';

interface ChainToolCardProps {
    tool: ChainTool;
    chainName: string;
    chainType: 'evm' | 'sui' | 'aptos' | 'solana' | 'move';
    onToggle: () => void;
    className?: string;
}

const ChainToolCard: React.FC<ChainToolCardProps> = ({
    tool,
    chainName,
    chainType,
    onToggle,
    className = ""
}) => {
    const [showParameters, setShowParameters] = useState(false);

    const getUsageColor = (count: number) => {
        if (count === 0) return 'text-gray-400';
        if (count < 10) return 'text-yellow-400';
        if (count < 100) return 'text-green-400';
        return 'text-blue-400';
    };

    const getChainTypeColor = (type: string) => {
        switch (type) {
            case 'evm': return 'bg-purple-500/20 text-purple-400';
            case 'sui': return 'bg-blue-500/20 text-blue-400';
            case 'move': return 'bg-green-500/20 text-green-400';
            case 'solana': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className={`bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 ${tool.isEnabled ? 'ring-1 ring-teal-500/30' : ''
            } ${className}`}>
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChainTypeColor(chainType)}`}>
                            {chainType.toUpperCase()}
                        </span>
                        {tool.isRequired && (
                            <div className="flex items-center space-x-1">
                                <Lock className="w-3 h-3 text-blue-400" />
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                    Required
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-teal-200 leading-relaxed">{tool.description}</p>
                </div>

                {/* Toggle Switch */}
                <div className="ml-4">
                    <button
                        onClick={onToggle}
                        disabled={tool.isRequired}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tool.isEnabled
                                ? 'bg-teal-600'
                                : 'bg-teal-800'
                            } ${tool.isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tool.isEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Tool Status and Usage */}
            <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${tool.isEnabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {tool.isEnabled ? <Zap className="w-3 h-3" /> : null}
                        <span>{tool.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </span>
                </div>

                <div className={`${getUsageColor(tool.usageCount || 0)} text-sm`}>
                    {(tool.usageCount || 0).toLocaleString()} uses
                </div>
            </div>

            {/* Parameters Section */}
            <div className="border-t border-teal-800/50 pt-4">
                <button
                    onClick={() => setShowParameters(!showParameters)}
                    className="flex items-center justify-between w-full text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                    <span className="flex items-center space-x-2">
                        <span>Parameters</span>
                        <span className="px-1.5 py-0.5 bg-teal-800/30 text-teal-300 rounded text-xs">
                            {Object.keys(tool.parameters).length}
                        </span>
                    </span>
                    {showParameters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showParameters && (
                    <div className="mt-3 space-y-3">
                        {Object.entries(tool.parameters).map(([key, param]: [string, any]) => (
                            <div key={key} className="bg-teal-800/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <code className="text-sm font-mono text-teal-200">{key}</code>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${param.type === 'string' ? 'bg-blue-500/20 text-blue-400' :
                                                param.type === 'number' ? 'bg-green-500/20 text-green-400' :
                                                    param.type === 'boolean' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {param.type}
                                        </span>
                                        {param.required && (
                                            <span className="text-xs text-red-400 font-medium">required</span>
                                        )}
                                    </div>
                                </div>
                                {param.description && (
                                    <p className="text-xs text-teal-400 mt-1 leading-relaxed">{param.description}</p>
                                )}
                            </div>
                        ))}

                        {/* Example Usage */}
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                            <div className="text-xs text-gray-400 mb-2">Example usage in MCP:</div>
                            <code className="text-xs text-gray-300 block">
                                {generateExampleUsage(tool)}
                            </code>
                        </div>
                    </div>
                )}
            </div>

            {/* Documentation Link */}
            {tool.documentation && (
                <div className="mt-4 pt-3 border-t border-teal-800/50">
                    <a
                        href={tool.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                    >
                        <span>📖 Documentation</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}

            {/* Tool Status Message */}
            {tool.isEnabled && (
                <div className="mt-3 p-2 bg-green-900/30 border border-green-600/30 rounded-lg">
                    <p className="text-green-200 text-xs">
                        ✅ This tool will be available in your MCP client
                    </p>
                </div>
            )}
        </div>
    );
};

// Helper function to generate example usage
const generateExampleUsage = (tool: ChainTool): string => {
    const paramExamples: Record<string, any> = {
        'string': '"example_value"',
        'number': '1.5',
        'boolean': 'true'
    };

    const exampleParams = Object.entries(tool.parameters)
        .filter(([_, param]) => param.required)
        .map(([key, param]) => `${key}: ${paramExamples[param.type] || '"value"'}`)
        .join(', ');

    switch (tool.id) {
        case 'transfer_token':
            return `"Send 10 SUI to 0x123..."`;
        case 'stake_sui':
            return `"Stake 100 SUI with validator pool"`;
        case 'swap_tokens':
            return `"Swap 50 USDC to SUI"`;
        default:
            return `"Use ${tool.name.toLowerCase()}"`;
    }
};

export default ChainToolCard;