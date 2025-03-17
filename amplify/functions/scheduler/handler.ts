import type { Handler } from 'aws-lambda';
import type { EventBridgeHandler } from "aws-lambda";
import type { Schema } from '../../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/scheduler';
import { ChatAnthropic } from "@langchain/anthropic"
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"
import { Account, SigningSchemeInput, Aptos, AptosConfig, Ed25519PrivateKey, Secp256k1PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk"
import { createReactAgent } from "@langchain/langgraph/prebuilt"

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

const llm = new ChatAnthropic({
    temperature: 0.7,
    model: "claude-3-5-sonnet-latest",
    apiKey: process.env.ANTHROPIC_API_KEY
})

const client = generateClient<Schema>()

Amplify.configure(resourceConfig, libraryOptions);

export const handler: EventBridgeHandler<"Scheduled Event", null, void> = async (event) => {
    console.log("event", JSON.stringify(event, null, 2))

    // Get all agents

    const agents = await client.models.Agent.list({
        filter: {
            isActive: {
                eq: true
            }
        }
    })

    for (let agent of agents.data) {
        console.log(`Checking agent: ${agent.id}`);

        // Ensure agent has all necessary properties before proceeding
        if (agent && agent.schedule && agent.promptInput && agent.promptDecision && agent.promptExecute) {
            let need_update = false;

            // Determine if the agent needs an update based on last run time
            if (agent.lastRanAt === undefined) {
                console.log(`Agent ${agent.id} has never run. Marking for update.`);
                need_update = true;
            } else {
                const timeSinceLastRun = (new Date().valueOf() / 1000) - Number(agent.lastRanAt);
                if (timeSinceLastRun > agent.schedule) {
                    console.log(`Agent ${agent.id} exceeded schedule by ${timeSinceLastRun - agent.schedule} seconds. Marking for update.`);
                    need_update = true;
                }
            }

            if (need_update) {
                console.log(`Processing agent: ${agent.id}...`);
                await runAgent(agent);
            } else {
                console.log(`No update needed for agent: ${agent.id}.`);
            }
        } else {
            console.warn(`Skipping agent ${agent.id} due to missing required properties.`);
        }
    }


}

const runAgent = async (agent: Schema["Agent"]["type"]) => {

    const wallets = await agent.wallets()
    const wallet: any = wallets.data[0]

    // Initialize Aptos configuration
    const aptosConfig = new AptosConfig({
        network: agent.isTestnet ? Network.TESTNET : Network.MAINNET,
    })

    const aptos = new Aptos(aptosConfig)

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
        privateKey: new Secp256k1PrivateKey(PrivateKey.formatPrivateKey(wallet.key, PrivateKeyVariants.Secp256k1)),
    })

    const signer = new LocalSigner(account, agent.isTestnet ? Network.TESTNET : Network.MAINNET)
    const aptosAgent = new AgentRuntime(signer, aptos)
    const tools = createAptosTools(aptosAgent)

    // Create React agent
    const reactAgent = createReactAgent({
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

        You also can't answer anything related to automation, as it should be done in another panel. 
        If asked, direct them to the panel on the right-hand side.
      `,
    })

    let messages: any = agent?.messages ? JSON.parse(String(agent.messages)) : []

    console.log("Existing messages : ", messages)

    const userPrompt = {
        role: 'user',
        content: agent.promptInput
    }

    const output = await reactAgent.invoke(
        {
            messages: [...messages, userPrompt]
        }
    )

    const dataResultMessage: any = extractOnlyLastMessage(output)

    if (dataResultMessage && dataResultMessage.role === "assistant" && dataResultMessage.content) {

        const executePrompt = {
            role: 'user',
            content: [
                "Based on the following condition:",
                `${agent.promptDecision}`,
                "Execute the following if the condition is met:",
                `${agent.promptExecute}`,
            ].join("\n")
        }

        const finalOutput = await reactAgent.invoke(
            {
                messages: [...messages, userPrompt, dataResultMessage, executePrompt]
            }
        )

        const finalized = parseLangChainToGeneric(finalOutput.messages)

        // let finalized: any = []

        // finalOutput.messages.map((msg: any) => {
        //     const role = msg.additional_kwargs?.role || "user"

        //     if (msg?.tool_call_id) {
        //         finalized.push({
        //             content: [
        //                 {
        //                     type: "tool_result",
        //                     tool_use_id: msg.tool_call_id,
        //                     content: msg.kwargs?.content || msg.content,
        //                 }
        //             ],
        //             role: role,
        //             id: msg.kwargs?.id || msg.id
        //         })
        //     } else {

        //     } 
        // })

        console.log("saving messages :", finalized)
        await client.models.Agent.update({
            id: agent.id,
            messages: JSON.stringify(finalized),
            lastRanAt: Math.floor(new Date().valueOf() / 1000)
        })

    }

}

const extractOnlyLastMessage = (output: any) => {

    let last

    output.messages.map((msg: any) => {
        // const role = msg.additional_kwargs?.role || (msg.role || "user")
        if (msg?.tool_call_id) {

        } else {
            last = {
                role: "assistant",
                content: msg.kwargs?.content || msg.content,
                id: msg.kwargs?.id || msg.id
            }
        }
    })

    return last

}

function parseLangChainToGeneric(langchainMessages: any) {
    return langchainMessages.map((message: any) => {
        // Determine message type based on message structure instead of constructor name
        let role = 'system'; // Default role

        // Check if it's a HumanMessage
        if (message.hasOwnProperty('content') && !message.hasOwnProperty('tool_calls')) {
            if (!message.hasOwnProperty('name')) {
                role = 'user';
            }
        }

        // Check if it's an AIMessage
        if (message.hasOwnProperty('content') &&
            (message.hasOwnProperty('tool_calls') ||
                (message.additional_kwargs && message.additional_kwargs.role === 'assistant'))) {
            role = 'assistant';
        }

        // Check if it's a ToolMessage
        if (message.hasOwnProperty('name') && message.hasOwnProperty('content') &&
            message.hasOwnProperty('tool_call_id')) {
            role = 'assistant'; // Map tool messages to assistant role in target format
        }

        // Extract ID
        let id = message.id ||
            (message.additional_kwargs && message.additional_kwargs.id) ||
            null;

        // Use the content as is
        let content = message.content;

        // Create the generic message object
        return {
            role,
            id,
            content
        };
    });
}
