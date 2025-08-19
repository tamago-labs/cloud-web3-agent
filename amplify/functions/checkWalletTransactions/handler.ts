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

            console.log("transactions:", transactions)

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

    console.log("since :", since)

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

// Aptos transaction fetching using GraphQL
async function getAptosTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {

        console.log("check aptos tx :", address, since)

        const indexerUrl = 'https://indexer.mainnet.aptoslabs.com/v1/graphql';
        const usdcAssetType = USDC_ADDRESSES.aptos; // USDC FA asset address
        
        const query = `
            query GetIncomingUSDCTransfers($owner_address: String!, $asset_type: String!) {
                fungible_asset_activities(
                    where: {
                        owner_address: {_eq: $owner_address} 
                        asset_type: {_eq: $asset_type}
                        amount: {_gt: "0"}
                        is_transaction_success: {_eq: true}
                        type: {_ilike: "%deposit%"}
                    }
                    order_by: {transaction_timestamp: desc}
                    limit: 100
                ) {
                    transaction_version
                    transaction_timestamp
                    amount
                    asset_type
                    owner_address
                    type
                    storage_id
                    gas_fee_payer_address
                    entry_function_id_str
                    block_height
                    is_transaction_success
                }
            }
        `;

        const response = await fetch(indexerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    owner_address: address,
                    // since: since.toISOString(),
                    asset_type: usdcAssetType
                }
            })
        });

        if (!response.ok) {
            throw new Error(`GraphQL API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return [];
        }

        if (!data.data?.fungible_asset_activities) {
            console.log('No fungible asset activities found');
            return [];
        }

        const results: TransactionResult[] = [];
        
        for (const activity of data.data.fungible_asset_activities) {
            // Skip if not a successful transaction
            if (!activity.is_transaction_success) {
                continue;
            }

            // Convert amount (assuming USDC has 6 decimals)
            const rawAmount = activity.amount || '0';
            const formattedAmount = (parseInt(rawAmount) / 1000000).toString();

            // Determine the sender address
            // gas_fee_payer_address is usually the sender for transfers
            let fromAddress = activity.gas_fee_payer_address || 'unknown';
            
            // If gas fee payer is the same as owner, this might be a self-transaction
            // In that case, we might need to look at the transaction details
            if (fromAddress === address) {
                fromAddress = 'self-transfer';
            }

            results.push({
                txHash: activity.transaction_version.toString(), // Use version as hash for now
                blockNumber: parseInt(activity.block_height),
                amount: rawAmount,
                formattedAmount: formattedAmount,
                fromAddress: fromAddress,
                timestamp: Math.floor(new Date(activity.transaction_timestamp).getTime() / 1000)
            });
        }

        console.log(`Found ${results.length} incoming USDC transfers for ${address}`);
        return results;

    } catch (error) {
        console.error('Error fetching Aptos incoming transactions via GraphQL:', error);
        return [];
    }
}

// Sui transaction fetching using @mysten/sui SDK
async function getSuiTransactions(address: string, since: Date): Promise<TransactionResult[]> {
    try {
        const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
        const results: TransactionResult[] = [];

        console.log("since :", since)

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

        console.log("txBlocks :", txBlocks)

        for (const txBlock of txBlocks.data) {
            // Check timestamp
            // const txTime = new Date(parseInt(txBlock.timestampMs!));
            // if (txTime < since) {
            //     continue;
            // }

            // Check object changes for coin balance changes
            if (txBlock.objectChanges) {
                for (const change of txBlock.objectChanges as any[]) {
                    if (change.type === 'created' &&
                        change.objectType === "0x2::coin::Coin<0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC>" &&
                        change.owner.AddressOwner === address) {

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

        console.log("resultts: ", results)

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
                rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
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
            // const txTime = new Date(Number(block.timestamp) * 1000);
            // if (txTime < since) {
            //     continue;
            // }

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