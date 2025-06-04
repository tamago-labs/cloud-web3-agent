import { createPublicClient, http, formatEther } from 'viem';
import { mainnet, polygon, base } from 'viem/chains';

const chainMap = {
    ethereum: mainnet,
    polygon: polygon,
    base: base
};

export async function getEVMBalances(address: string, chainId: string) {
    const chain = chainMap[chainId as keyof typeof chainMap];
    const client = createPublicClient({
        chain,
        transport: http()
    });

    const balance = await client.getBalance({ address: address as `0x${string}` });
    
    return [
        {
            address: 'native',
            name: chain.nativeCurrency.name,
            symbol: chain.nativeCurrency.symbol,
            decimals: chain.nativeCurrency.decimals,
            balance: formatEther(balance)
        }
        // Add ERC20 tokens here
    ];
}

export async function getEVMSwapQuote(fromToken: string, toToken: string, amount: number, chainId: string) {
    // Integrate with 1inch, Uniswap API, or other aggregators
    return {
        fromToken,
        toToken,
        inputAmount: amount,
        estimatedOutput: 0, // Calculate based on DEX
        priceImpact: 0,
        route: []
    };
}