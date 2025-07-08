// MCP Types and Interfaces
export interface MCPStatus {
    healthy: boolean;
    connectedServers: string[];
    registeredServers: string[];
    serviceUrl: string;
    error?: string;
}

export interface MCPServerInfo {
    name: string;
    connected: boolean;
    registered: boolean;
    description: string;
    status?: any;
}

export interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    message: string;
    timestamp: string;
    mcpCalls?: string[];
    charts?: string[];
}

// Server configurations
export const serverConfigs: Record<string, {description: string; features: string[]}> = {
    'filesystem': {
        description: 'File operations (read, write, list directories)',
        features: ['Read files', 'Write files', 'List directories', 'File management']
    },
    'web3-mcp': {
        description: 'Blockchain interactions and Web3 operations',
        features: ['Token balances', 'Transaction history', 'DeFi protocols', 'NFT data']
    },
    'nodit': {
        description: 'Blockchain data queries via Nodit API',
        features: ['Multi-chain support', 'Real-time data', 'Historical analytics', 'Token metrics']
    }
};
