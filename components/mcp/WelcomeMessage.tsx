import React from 'react';
import { MCPStatus } from './types';

interface WelcomeMessageProps {
    mcpEnabled: boolean;
    mcpStatus: MCPStatus | null;
    onPromptClick: (prompt: string) => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
    mcpEnabled,
    mcpStatus,
    onPromptClick
}) => {
    const mcpPrompts = [
        "Fetch latest 3 block information on Arbitrum",
        "Analyze my portfolio across multiple chains",
        "Show me NFT collection stats for Pudgy Penguins",
        "Get Uniswap V3 liquidity pool data for ETH/USDC"
    ];

    const regularPrompts = [
        "Fetch latest 3 block information on Arbitrum",
        "Analyze my portfolio across multiple chains", 
        "Show me NFT collection insights",
        "Get DeFi analytics for liquidity pools"
    ];

    const prompts = mcpEnabled && mcpStatus?.healthy ? mcpPrompts : regularPrompts;

    return (
        <div className="text-center text-gray-500 py-12">
            <div className="text-lg font-medium mb-2">AI-Powered Web3 Intelligence</div>
            <p className="text-sm mb-4">
                Ask anything about blockchain data, portfolio analysis, NFT insights, or DeFi analytics.
                {mcpEnabled && mcpStatus?.healthy && (
                    <span className="block mt-2 text-blue-600 font-medium">
                        🔧 MCP Servers Active - Ensure the servers you need are selected above
                    </span>
                )}
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {prompts.map((prompt, index) => {
                    const icons = [
                        '🔗', // Block data
                        '💼', // Portfolio 
                        '🖼️', // NFT
                        '🏊' // DeFi/Liquidity
                    ];

                    return (
                        <button
                            key={index}
                            onClick={() => onPromptClick(prompt)}
                            className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-sm group"
                        >
                            <span className="text-lg mr-2">{icons[index]}</span>
                            <span className="group-hover:text-blue-600 transition-colors">{prompt}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WelcomeMessage;
