// /components/Dashboard/Tools/ChainToolGrid.tsx - Fixed to properly display tools
import React from 'react';
import ChainToolCard from "./ChainToolCard"
import type { BlockchainNetwork } from './ToolSelector';

interface ChainToolGridProps {
    network: BlockchainNetwork;
    onToolToggle: (toolId: string) => void;
    className?: string;
}

const ChainToolGrid: React.FC<ChainToolGridProps> = ({
    network,
    onToolToggle,
    className = ""
}) => {
    // Show tools regardless of network status - let the cards handle disabled state
    if (!network.tools || network.tools.length === 0) {
        return (
            <div className="text-center py-12 bg-teal-900/50 backdrop-blur-sm border border-teal-800/50 rounded-xl">
                <div className="text-gray-400 mb-4">
                    <span className="text-4xl">{network.icon}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No Tools Available</h3>
                <p className="text-gray-400">
                    Tools for {network.name} are being developed
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                    Available Tools ({network.tools.length})
                </h3>
                <div className="text-sm text-teal-300">
                    {network.tools.filter(tool => tool.isEnabled).length} enabled
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {network.tools.map((tool) => (
                    <ChainToolCard
                        key={tool.id}
                        tool={tool}
                        chainName={network.name}
                        chainType={network.type}
                        onToggle={() => onToolToggle(tool.id)}
                    />
                ))}
            </div>

            {/* Tools Summary */}
            <div className="mt-6 p-4 bg-teal-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Tool Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <span className="text-teal-300">Total:</span>
                        <span className="text-white ml-1">{network.tools.length}</span>
                    </div>
                    <div>
                        <span className="text-teal-300">Enabled:</span>
                        <span className="text-green-400 ml-1">{network.tools.filter(t => t.isEnabled).length}</span>
                    </div>
                    <div>
                        <span className="text-teal-300">Required:</span>
                        <span className="text-blue-400 ml-1">{network.tools.filter(t => t.isRequired).length}</span>
                    </div>
                    <div>
                        <span className="text-teal-300">Optional:</span>
                        <span className="text-gray-400 ml-1">{network.tools.filter(t => !t.isRequired).length}</span>
                    </div>
                </div>

                {/* Quick Enable All Button */}
                <div className="mt-3 flex space-x-2">
                    <button
                        onClick={() => {
                            network.tools.forEach(tool => {
                                if (!tool.isEnabled && !tool.isRequired) {
                                    onToolToggle(tool.id);
                                }
                            });
                        }}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded transition-colors"
                    >
                        Enable All Optional
                    </button>
                    <button
                        onClick={() => {
                            network.tools.forEach(tool => {
                                if (tool.isEnabled && !tool.isRequired) {
                                    onToolToggle(tool.id);
                                }
                            });
                        }}
                        className="px-3 py-1 border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white text-xs rounded transition-colors"
                    >
                        Disable All Optional
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChainToolGrid;
