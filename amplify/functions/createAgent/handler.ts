import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { Account, SigningSchemeInput, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk"
import { Amplify } from 'aws-amplify';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import { env } from '$amplify/env/createAgent';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: Schema["CreateAgent"]["functionHandler"] = async (event) => {

    const { name, userId, blockchain, sdkType }: any = event.arguments

    try {
        // Generate a key for Aptos
        const { privateKey } = Account.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa });
        const key = new Secp256k1PrivateKey(privateKey.toAIP80String())
        const account = Account.fromPrivateKey({ privateKey: key });
        const walletAddress = account.accountAddress.toString()

        const { data }: any = await client.models.Agent.create({
            name,
            userId,
            blockchain,
            sdkType,
            walletAddresses: [walletAddress]
        })

        const agentId = data.id

        await client.models.Wallet.create({
            agentId,
            address: walletAddress,
            key,
            isDefault: true
        })

        return true
    } catch (e) {
        console.log(e)
        return false
    }
}