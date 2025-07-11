// MCP Types and Interfaces
export interface MCPStatus {
    healthy: boolean;
    connectedServers: string[];
    registeredServers: string[];
    serviceUrl: string;
    error?: string;
    timestamp?: string;
}

export interface MCPServerInfo {
    name: string;
    connected: boolean;
    registered: boolean;
    description: string;
    tools?: number;
    lastSeen?: string;
    error?: string;
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
        description: 'Provides access to local files on the server (always off, as file utilities are not available).',
        features: ['Read files', 'Write files', 'List directories', 'File management']
    },
    'agent-base': {
        description: 'Consists of cached API specs from Nodit MCP and provides base tools for other Web3 MCPs (always online).',
        features: ['Token balances', 'Transaction history', 'DeFi protocols', 'NFT data']
    },
    'nodit': {
        description: 'Nodit MCP server used as the base for accessing on-chain data (always online).',
        features: ['Multi-chain support', 'Real-time data', 'Historical analytics', 'Token metrics']
    }
};
