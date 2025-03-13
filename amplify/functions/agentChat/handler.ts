import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/agentChat';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Account, SigningSchemeInput, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk"

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: Schema["AgentChat"]["functionHandler"] = async (event) => {
    console.log("event", JSON.stringify(event, null, 2))

    const messages: any = event.arguments.messages
    const agentId: any = event.arguments.agentId

    const { data }: any = await client.models.Agent.get({
        id: agentId
    })

    console.log("data:", data)

    const wallets = await data.wallets()  
    const wallet = wallets.data[0]

    console.log("walllet:", wallet)

    const account = Account.fromPrivateKey({ privateKey : wallet.key });
    console.log(account.accountAddress.toString())

    return messages
}