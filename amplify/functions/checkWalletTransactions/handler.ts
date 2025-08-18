import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { Amplify } from 'aws-amplify';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import { env } from '$amplify/env/checkWalletTransactions';


const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// USDC Token Addresses for each chain
const USDC_ADDRESSES = {
    aptos: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b', // FA Asset
    sui: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
    ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    optimism: '0x0b2c639c533813f4aa9d7837caf62653d097ff85'
};

// Credit conversion rate: 1 USDC = 1 Credit
const USDC_TO_CREDITS_RATE = 1.0;

interface TransactionResult {
    txHash: string;
    blockNumber?: number;
    amount: string;
    formattedAmount: string;
    fromAddress: string;
    timestamp?: number;
}

export const handler: Schema["CheckWalletTransactions"]["functionHandler"] = async (event) => {
    const { userId, blockchainId }: any = event.arguments;

    try {
        console.log(`Checking transactions for user ${userId} on blockchain ${blockchainId}`);

        // Get user's wallets for the specified blockchain
        const { data: wallets } = await client.models.UserWallet.list({
            filter: {
                userId: { eq: userId },
                network: { eq: blockchainId },
                isActive: { eq: true },
                isMonitored: { eq: true }
            }
        });

        if (!wallets || wallets.length === 0) {
            console.log(`No monitored wallets found for user ${userId} on ${blockchainId}`);
            return {
                success: true,
                walletsChecked: 0,
                newTransactions: 0,
                creditsAdded: 0
            };
        }

        let totalNewTransactions = 0;
        let totalCreditsAdded = 0;

        // Check each wallet for new transactions
        for (const wallet of wallets) {
            console.log(`Checking wallet ${wallet.address} on ${blockchainId}`);
            
            const transactions = await getWalletTransactions(
                wallet.address, 
                blockchainId,
                wallet.lastChecked
            );

            // Process each new transaction
            for (const tx of transactions) {
                // Check if we already processed this transaction
                const { data: existingDeposit } = await client.models.CryptoDeposit.list({
                    filter: {
                        txHash: { eq: tx.txHash },
                        walletId: { eq: wallet.id }
                    }
                });

                if (existingDeposit && existingDeposit.length > 0) {
                    console.log(`Transaction ${tx.txHash} already processed`);
                    continue;
                }

                // Calculate credits to grant
                const usdValue = parseFloat(tx.formattedAmount); // Assuming USDC = 1 USD
                const creditsToGrant = usdValue * USDC_TO_CREDITS_RATE;

                // Create crypto deposit record
                await client.models.CryptoDeposit.create({
                    userId: userId,
                    walletId: wallet.id,
                    txHash: tx.txHash,
                    blockNumber: tx.blockNumber,
                    tokenAddress: getUSDCAddress(blockchainId),
                    tokenSymbol: 'USDC',
                    tokenDecimals: 6, // USDC has 6 decimals
                    rawAmount: tx.amount,
                    formattedAmount: tx.formattedAmount,
                    usdRate: 1.0, // USDC = 1 USD
                    usdValue: usdValue,
                    creditsGranted: creditsToGrant,
                    conversionRate: USDC_TO_CREDITS_RATE,
                    fromAddress: tx.fromAddress,
                    notes: `Automatic USDC deposit on ${blockchainId}`
                });

                // Update user credits
                const { data: user } = await client.models.User.get({ id: userId });
                if (user) {
                    const newCredits = (user.credits || 0) + creditsToGrant;
                    const newTotalCredits = (user.totalCredits || 0) + creditsToGrant;
                    
                    await client.models.User.update({
                        id: userId,
                        credits: newCredits,
                        totalCredits: newTotalCredits
                    });
                }

                totalNewTransactions++;
                totalCreditsAdded += creditsToGrant;

                console.log(`Processed deposit: ${tx.formattedAmount} USDC = ${creditsToGrant} credits`);
            }

            // Update wallet's lastChecked timestamp
            await client.models.UserWallet.update({
                id: wallet.id,
                lastChecked: new Date().toISOString()
            });
        }

        console.log(`Completed check: ${totalNewTransactions} new transactions, ${totalCreditsAdded} credits added`);

        // return {
        //     success: true,
        //     walletsChecked: wallets.length,
        //     newTransactions: totalNewTransactions,
        //     creditsAdded: totalCreditsAdded
        // };
        return true

    } catch (error) {
        console.error('Error checking wallet transactions:', error);
        return false
        // return {
        //     success: false,
        //     error: error instanceof Error ? error.message : 'Unknown error',
        //     walletsChecked: 0,
        //     newTransactions: 0,
        //     creditsAdded: 0
        // };
    }
};

// Helper function to get USDC contract address for each chain
function getUSDCAddress(blockchain: string): string {
    return USDC_ADDRESSES[blockchain as keyof typeof USDC_ADDRESSES] || '';
}

// Main function to get wallet transactions based on blockchain
async function getWalletTransactions(
    address: string, 
    blockchain: string, 
    lastChecked?: any
): Promise<TransactionResult[]> {
    const since = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24h ago
    
    switch (blockchain) {
        case 'aptos':
            return getAptosTransactions(address, since);
        case 'sui':
            return getSuiTransactions(address, since);
        case 'evm':
            // For EVM, we need to check all EVM chains
            const ethTxs = await getEVMTransactions(address, 'ethereum', since);
            const baseTxs = await getEVMTransactions(address, 'base', since);
            const opTxs = await getEVMTransactions(address, 'optimism', since);
            return [...ethTxs, ...baseTxs, ...opTxs];
        default:
            console.warn(`Unsupported blockchain: ${blockchain}`);
            return [];
    }
}

// Aptos transaction fetching
async function getAptosTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {
        const aptosUrl = env.APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com/v1';
        
        // Get account transactions
        const response = await fetch(
            `${aptosUrl}/accounts/${address}/transactions?limit=100`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Aptos API error: ${response.status}`);
        }

        const transactions = await response.json();
        const results: TransactionResult[] = [];

        for (const tx of transactions) {
            // Check if transaction is after our 'since' timestamp
            const txTimestamp = parseInt(tx.timestamp);
            if (txTimestamp < since.getTime() * 1000) { // Aptos uses microseconds
                continue;
            }

            // Check for USDC FA transfers to our address
            if (tx.type === 'user_transaction' && tx.payload?.function) {
                const changes = tx.changes || [];
                
                for (const change of changes) {
                    if (change.type === 'write_resource' && 
                        change.data?.type?.includes('fungible_asset') &&
                        change.address === address) {
                        
                        // This is a simplified check - in production, you'd want more robust FA parsing
                        const amount = change.data?.value || '0';
                        if (amount !== '0') {
                            results.push({
                                txHash: tx.hash,
                                blockNumber: parseInt(tx.version),
                                amount: amount,
                                formattedAmount: (parseInt(amount) / 1000000).toString(), // USDC has 6 decimals
                                fromAddress: tx.sender || 'unknown',
                                timestamp: Math.floor(txTimestamp / 1000000) // Convert to seconds
                            });
                        }
                    }
                }
            }
        }

        return results;
    } catch (error) {
        console.error('Error fetching Aptos transactions:', error);
        return [];
    }
}

// Sui transaction fetching
async function getSuiTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {
        const suiUrl = env.SUI_RPC_URL || 'https://fullnode.mainnet.sui.io:443';
        
        // Get objects owned by address
        const response = await fetch(suiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'suix_queryTransactionBlocks',
                params: [
                    {
                        filter: {
                            ToAddress: address
                        },
                        options: {
                            showInput: true,
                            showEffects: true,
                            showEvents: true
                        }
                    },
                    null,
                    100,
                    'descending'
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Sui API error: ${response.status}`);
        }

        const data = await response.json();
        const results: TransactionResult[] = [];

        if (data.result?.data) {
            for (const tx of data.result.data) {
                // Check timestamp
                const txTime = new Date(parseInt(tx.timestampMs));
                if (txTime < since) {
                    continue;
                }

                // Check for USDC transfers in events
                const events = tx.events || [];
                for (const event of events) {
                    if (event.type?.includes('usdc') && 
                        event.parsedJson?.recipient === address) {
                        
                        const amount = event.parsedJson?.amount || '0';
                        results.push({
                            txHash: tx.digest,
                            amount: amount,
                            formattedAmount: (parseInt(amount) / 1000000).toString(), // USDC has 6 decimals
                            fromAddress: event.parsedJson?.sender || 'unknown',
                            timestamp: Math.floor(parseInt(tx.timestampMs) / 1000)
                        });
                    }
                }
            }
        }

        return results;
    } catch (error) {
        console.error('Error fetching Sui transactions:', error);
        return [];
    }
}

// EVM transaction fetching (Ethereum, Base, Optimism)
async function getEVMTransactions(address: string, chain: string, since: Date): Promise<TransactionResult[]> {
    try {
        // This is a simplified implementation - in production you'd use services like:
        // - Alchemy API
        // - Moralis API  
        // - The Graph Protocol
        // - Direct RPC calls with event filtering

        const alchemyKey = env.ALCHEMY_API_KEY;
        if (!alchemyKey) {
            console.warn('No Alchemy API key provided for EVM transactions');
            return [];
        }

        const chainUrls = {
            ethereum: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            base: `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            optimism: `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`
        };

        const rpcUrl = chainUrls[chain as keyof typeof chainUrls];
        if (!rpcUrl) {
            console.warn(`Unsupported EVM chain: ${chain}`);
            return [];
        }

        const usdcAddress = getUSDCAddress(chain);
        if (!usdcAddress) {
            console.warn(`No USDC address for chain: ${chain}`);
            return [];
        }

        // Get latest block number
        const latestBlockResponse = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            })
        });

        const latestBlockData = await latestBlockResponse.json();
        const latestBlock = parseInt(latestBlockData.result, 16);
        const fromBlock = Math.max(0, latestBlock - 1000); // Check last ~1000 blocks

        // Get USDC transfer events
        const logsResponse = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getLogs',
                params: [{
                    fromBlock: `0x${fromBlock.toString(16)}`,
                    toBlock: 'latest',
                    address: usdcAddress,
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event signature
                        null, // from (any address)
                        `0x000000000000000000000000${address.slice(2).toLowerCase()}` // to (our address)
                    ]
                }],
                id: 2
            })
        });

        const logsData = await logsResponse.json();
        const results: TransactionResult[] = [];

        if (logsData.result) {
            for (const log of logsData.result) {
                // Decode transfer amount (last 32 bytes of data)
                const amountHex = log.data.slice(-64);
                const amount = BigInt('0x' + amountHex).toString();
                const formattedAmount = (parseInt(amount) / 1000000).toString(); // USDC has 6 decimals

                // Get transaction details
                const txResponse = await fetch(rpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getTransactionByHash',
                        params: [log.transactionHash],
                        id: 3
                    })
                });

                const txData = await txResponse.json();
                if (txData.result) {
                    results.push({
                        txHash: log.transactionHash,
                        blockNumber: parseInt(log.blockNumber, 16),
                        amount: amount,
                        formattedAmount: formattedAmount,
                        fromAddress: txData.result.from || 'unknown'
                    });
                }
            }
        }

        return results;
    } catch (error) {
        console.error(`Error fetching ${chain} transactions:`, error);
        return [];
    }
}
