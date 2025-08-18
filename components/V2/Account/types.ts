// Account component types and interfaces

export interface CreditInfo {
    current: number;
    used: number;
    total: number;
    remaining: number;
}

export interface UsageStats {
    totalExecutions: number;
    totalTokens: number;
    totalCpuMs: number;
    successRate: number;
    byDay: Record<string, { executions: number; tokens: number; cpuMs: number }>;
    timeframe: string;
}

export interface ConversationData {
    id: string;
    title: string;
    createdAt: string;
    messageCount?: number;
}

export interface WalletInfo {
    address: string;
    qrCode: string;
    balance?: string;
    network: string;
}

export interface BlockchainInfo {
    id: string;
    name: string;
    symbol: string;
    color: string;
    icon: string;
    description: string;
    chainType: 'evm' | 'aptos' | 'sui';
    depositToken: string;
    chainId?: number; // For EVM chains
}

export type TabType = 'overview' | 'credits' | 'wallets' | 'settings';

// Supported blockchains - 5 separate tabs but EVM chains share the same address
export const supportedBlockchains: BlockchainInfo[] = [
    {
        id: 'aptos',
        name: 'Aptos',
        symbol: 'APT',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
        description: 'Scalable, safe, and upgradeable Web3 infrastructure',
        chainType: 'aptos',
        depositToken: 'USDC'
    },
    {
        id: 'sui',
        name: 'Sui',
        symbol: 'SUI',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
        description: 'Fast, secure, and developer-friendly blockchain',
        chainType: 'sui',
        depositToken: 'USDC'
    }, 
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        description: 'The world\'s programmable blockchain',
        chainType: 'evm',
        depositToken: 'USDC',
        chainId: 1
    },
    {
        id: 'base',
        name: 'Base',
        symbol: 'ETH',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'https://images.blockscan.com/chain-logos/base.svg',
        description: 'Coinbase\'s secure, low-cost Ethereum L2',
        chainType: 'evm',
        depositToken: 'USDC',
        chainId: 8453
    },
    {
        id: 'optimism',
        name: 'Optimism',
        symbol: 'OP',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'https://optimistic.etherscan.io/assets/optimism/images/svg/logos/token-secondary-light.svg?v=25.7.5.2',
        description: 'Fast, stable, and scalable Ethereum L2',
        chainType: 'evm',
        depositToken: 'USDC',
        chainId: 10
    }
];

// Helper function to get EVM chains
export const getEVMChains = () => supportedBlockchains.filter(chain => chain.chainType === 'evm');

// Helper function to check if blockchain uses shared EVM address
export const isEVMChain = (blockchainId: string) => {
    const chain = supportedBlockchains.find(c => c.id === blockchainId);
    return chain?.chainType === 'evm';
};
