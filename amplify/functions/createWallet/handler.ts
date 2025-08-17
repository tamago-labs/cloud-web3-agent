import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { Account, SigningSchemeInput, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk"
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { Amplify } from 'aws-amplify';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import { env } from '$amplify/env/createWallet';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

// EVM Chain IDs
const EVM_CHAIN_IDS = {
    ethereum: 1,
    base: 8453,
    optimism: 10
};


export const handler: Schema["CreateWallet"]["functionHandler"] = async (event) => {

    const { userId, blockchain }: any = event.arguments

    try {

        if (blockchain === "aptos") {
            // Generate a key for Aptos
            const { privateKey } = Account.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa });
            const key = new Secp256k1PrivateKey(privateKey.toAIP80String())
            const account = Account.fromPrivateKey({ privateKey: key });
            const walletAddress = account.accountAddress.toString()

            await client.models.UserWallet.create({
                userId,
                address: walletAddress,
                privateKeyEncrypted: privateKey.toAIP80String(),
                walletIndex: 0,
                network: blockchain,
                chainIds: [0],
                isActive: true,
                isMonitored: true
            })

        } else if (blockchain === "sui") {
            
            // Generate a key for SUI
            const keypair = new Ed25519Keypair();
            const walletAddress = keypair.getPublicKey().toSuiAddress();
            const privateKeyBytes = keypair.getSecretKey();
            const privateKeyHex = Buffer.from(privateKeyBytes).toString('hex');

            await client.models.UserWallet.create({
                userId,
                address: walletAddress,
                privateKeyEncrypted: privateKeyHex,
                walletIndex: 0,
                network: blockchain,
                chainIds: [0], // SUI mainnet
                isActive: true,
                isMonitored: true
            })

        } else if (blockchain === "evm") {
            // Generate a private key for EVM
            const privateKey = generatePrivateKey();
            const account = privateKeyToAccount(privateKey);
            const walletAddress = account.address;

            await client.models.UserWallet.create({
                userId,
                address: walletAddress,
                privateKeyEncrypted: privateKey,
                walletIndex: 0,
                network: blockchain,
                chainIds: [
                    EVM_CHAIN_IDS.ethereum,
                    EVM_CHAIN_IDS.base,
                    EVM_CHAIN_IDS.optimism
                ],
                isActive: true,
                isMonitored: true
            })

        } else {
            throw new Error("Blockchain ID not support")
        }

        return true
    } catch (e) {
        console.log(e)
        return false
    }
}