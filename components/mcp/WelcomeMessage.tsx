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
        "Create a file with my portfolio analysis",
        "Check ETH balance for vitalik.eth",
        "Show me trending DeFi protocols",
        "List files in my workspace"
    ];

    const regularPrompts = [
        "Analyze my ETH portfolio",
        "What's the current gas price on Ethereum?",
        "Show me trending DeFi protocols",
        "Explain how Uniswap V3 works"
    ];

    const prompts = mcpEnabled && mcpStatus?.healthy ? mcpPrompts : regularPrompts;

    return (
        <div className="text-center text-gray-500 py-12">
            <div className="text-lg font-medium mb-2">AI Assistance with Online MCP Servers</div>
            <p className="text-sm mb-4">
                Ask anything about blockchain, DeFi, or portfolio analysis powered by real-time data.
                {/* {mcpEnabled && mcpStatus?.healthy && (
                    <span className="block mt-1 text-green-600">
                        🔧 Tools enabled - I can perform file operations and blockchain queries
                    </span>
                )} */}
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {prompts.map((prompt, index) => {
                    const icons = mcpEnabled && mcpStatus?.healthy
                        ? ['📁', '💰', '📈', '📂']
                        : ['💼', '⛽', '📈', '🦄'];

                    return (
                        <button
                            key={index}
                            onClick={() => onPromptClick(prompt)}
                            className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-sm"
                        >
                            {icons[index]} {prompt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default WelcomeMessage;
