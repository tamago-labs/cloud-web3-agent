import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { Amplify } from 'aws-amplify';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import { env } from '$amplify/env/checkWalletTransactions';

// SDK Imports
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { createPublicClient, http, parseAbiItem, getAddress } from 'viem';
import { mainnet, base, optimism } from 'viem/chains';

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

export const handler: Schema["CheckTxs"]["functionHandler"] = async (event) => {
    
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
            return true
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
 
        return true

    } catch (error) {
        console.error('Error checking wallet transactions:', error);
        return false
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

// Aptos transaction fetching using @aptos-labs/ts-sdk
async function getAptosTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {
        const aptosConfig = new AptosConfig({ network: Network.MAINNET });
        const aptos = new Aptos(aptosConfig);
        
        const results: TransactionResult[] = [];
        
        // Get account transactions
        const accountTransactions = await aptos.getAccountTransactions({ 
            accountAddress: address,
            options: {
                offset: 0,
                limit: 100
            }
        });
        

        for (let tx of accountTransactions as any[]) {

            if (!tx.timestamp) {
                continue;
            }

            // Check if transaction is after our 'since' timestamp
            const txTimestamp = parseInt(tx.timestamp);
            if (txTimestamp < since.getTime() * 1000) { // Aptos uses microseconds
                continue;
            }

            // Check for fungible asset transfers (FA events)
            if (tx.type === 'user_transaction' && 'events' in tx) {
                for (const event of tx.events) {
                    // Check for deposit events to our address
                    if (event.type.includes('DepositEvent') && 
                        event.data && 
                        'account' in event.data && 
                        event.data.account === address) {
                        
                        const amount = event.data.amount || '0';
                        if (amount !== '0') {
                            results.push({
                                txHash: tx.hash,
                                blockNumber: parseInt(tx.version),
                                amount: amount,
                                formattedAmount: (parseInt(amount) / 1000000).toString(), // USDC has 6 decimals
                                fromAddress: 'sender' in tx ? tx.sender : 'unknown',
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

// Sui transaction fetching using @mysten/sui SDK
async function getSuiTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {
        const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
        const results: TransactionResult[] = [];

        // Query transaction blocks
        const txBlocks = await suiClient.queryTransactionBlocks({
            filter: {
                ToAddress: address
            },
            options: {
                showInput: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true
            },
            limit: 100,
            order: 'descending'
        });

        for (const txBlock of txBlocks.data) {
            // Check timestamp
            const txTime = new Date(parseInt(txBlock.timestampMs!));
            if (txTime < since) {
                continue;
            }

            // Check events for USDC transfers
            if (txBlock.events) {
                for (const event of txBlock.events as any[]) {
                    // Check if this is a USDC transfer event
                    if (event.type.includes('usdc') && 
                        event.parsedJson && 
                        typeof event.parsedJson === 'object' &&
                        'recipient' in event.parsedJson &&
                        event.parsedJson.recipient === address) {
                        
                        const amount = event.parsedJson.amount as string || '0';
                        results.push({
                            txHash: txBlock.digest,
                            amount: amount,
                            formattedAmount: (parseInt(amount) / 1000000).toString(), // USDC has 6 decimals
                            fromAddress: (event.parsedJson.sender as string) || 'unknown',
                            timestamp: Math.floor(parseInt(txBlock.timestampMs!) / 1000)
                        });
                    }
                }
            }

            // Also check object changes for coin balance changes
            if (txBlock.objectChanges) {
                for (const change of txBlock.objectChanges) {
                    if (change.type === 'created' && 
                        change.objectType.includes('Coin') &&
                        change.objectType.includes('USDC') &&
                        change.owner === address) {
                        
                        // This indicates a new USDC coin was created for this address
                        // You'd need to fetch the coin object to get the balance
                        try {
                            const coinObject = await suiClient.getObject({
                                id: change.objectId,
                                options: { showContent: true }
                            });
                            
                            if (coinObject.data?.content && 
                                'fields' in coinObject.data.content &&
                                coinObject.data.content.fields &&
                                typeof coinObject.data.content.fields === 'object' &&
                                'balance' in coinObject.data.content.fields) {
                                
                                const balance = coinObject.data.content.fields.balance as string;
                                results.push({
                                    txHash: txBlock.digest,
                                    amount: balance,
                                    formattedAmount: (parseInt(balance) / 1000000).toString(),
                                    fromAddress: 'unknown', // Would need to trace the transaction sender
                                    timestamp: Math.floor(parseInt(txBlock.timestampMs!) / 1000)
                                });
                            }
                        } catch (objError) {
                            console.warn('Error fetching coin object:', objError);
                        }
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

// EVM transaction fetching using Viem
async function getEVMTransactions(address: string, chain: string, since: Date): Promise<TransactionResult[]> {
    try {
        // Get the appropriate chain configuration and RPC URL
        let chainConfig;
        let rpcUrl: string;

        switch (chain) {
            case 'ethereum':
                chainConfig = mainnet;
                rpcUrl =  `https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
                break;
            case 'base':
                chainConfig = base;
                rpcUrl = `https://base-mainnet.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
                break;
            case 'optimism':
                chainConfig = optimism;
                rpcUrl = `https://opt-mainnet.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
                break;
            default:
                console.warn(`Unsupported EVM chain: ${chain}`);
                return [];
        }

        const publicClient = createPublicClient({
            chain: chainConfig,
            transport: http(rpcUrl)
        });

        const usdcAddress = getUSDCAddress(chain);
        if (!usdcAddress) {
            console.warn(`No USDC address for chain: ${chain}`);
            return [];
        }

        // Get current block number
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - BigInt(1000); // Check last ~1000 blocks

        // Get Transfer events
        const logs = await publicClient.getLogs({
            address: getAddress(usdcAddress),
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            args: {
                to: getAddress(address) // Filter for transfers TO our address
            },
            fromBlock: fromBlock,
            toBlock: 'latest'
        });

        const results: TransactionResult[] = [];

        for (const log of logs) {
            // Get transaction details
            const transaction = await publicClient.getTransaction({
                hash: log.transactionHash
            });

            // Get block for timestamp
            const block = await publicClient.getBlock({
                blockHash: log.blockHash
            });

            // Check if transaction is after our 'since' timestamp
            const txTime = new Date(Number(block.timestamp) * 1000);
            if (txTime < since) {
                continue;
            }

            const amount = log.args.value?.toString() || '0';
            const formattedAmount = (parseInt(amount) / 1000000).toString(); // USDC has 6 decimals

            results.push({
                txHash: log.transactionHash,
                blockNumber: Number(log.blockNumber),
                amount: amount,
                formattedAmount: formattedAmount,
                fromAddress: transaction.from,
                timestamp: Number(block.timestamp)
            });
        }

        return results;
    } catch (error) {
        console.error(`Error fetching ${chain} transactions:`, error);
        return [];
    }
}