import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/agentChat';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { ChatAnthropic } from "@langchain/anthropic"
import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from "@langchain/core/messages"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"
import { Account, SigningSchemeInput, Aptos, AptosConfig, Ed25519PrivateKey, Secp256k1PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk"

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

const llm = new ChatAnthropic({
    temperature: 0.7,
    model: "claude-3-5-sonnet-latest",
    apiKey: process.env.ANTHROPIC_API_KEY,
})

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: Schema["AgentChat"]["functionHandler"] = async (event) => {
    console.log("event", JSON.stringify(event, null, 2))

    const messages: any = event.arguments.messages
    const agentId: any = event.arguments.agentId

    const { data }: any = await client.models.Agent.get({
        id: agentId
    })

    const wallets = await data.wallets()
    const wallet = wallets.data[0]

    // Initialize Aptos configuration
    const aptosConfig = new AptosConfig({
        network: Network.MAINNET,
    })

    const aptos = new Aptos(aptosConfig)

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
        privateKey: new Secp256k1PrivateKey(PrivateKey.formatPrivateKey(wallet.key, PrivateKeyVariants.Secp256k1)),
    })

    const signer = new LocalSigner(account, Network.MAINNET)
    const aptosAgent = new AgentRuntime(signer, aptos)
    const tools = createAptosTools(aptosAgent)

    // Create React agent
    const agent = createReactAgent({
        llm,
        tools,
        messageModifier: `
        You are a helpful agent that can interact onchain using the Aptos Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Aptos Agent Kit, recommend they go to https://www.aptosagentkit.xyz for more information. Be
        concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.

		The response also contains token/token[] which contains the name and address of the token and the decimals.
		WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
      `,
    })

    const output = await agent.invoke(
        {
            messages
        }
    )

    const finalized = output.messages.map((msg: any) => {
        const role = msg.additional_kwargs?.role || "user"

        console.log("message:", msg)

        if (msg?.tool_call_id) {
            return {
                content: [
                    {
                        type: "tool_result",
                        tool_use_id: msg.tool_call_id,
                        content: msg.kwargs?.content || msg.content,
                    }
                ],
                role,
                id: msg.kwargs?.id || msg.id
            }
        } else {
            return {
                role,
                content: msg.kwargs?.content || msg.content,
                id: msg.kwargs?.id || msg.id
            }
        }


    })

    return finalized
}