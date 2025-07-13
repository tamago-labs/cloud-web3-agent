// import type { Handler } from 'aws-lambda';
// import type { Schema } from "../../data/resource"
// import { env } from '$amplify/env/agentCronos';
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/data';
// import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
// import { ChatAnthropic } from "@langchain/anthropic"
// import { CronosAgent, createCronosTools } from "../../../lib"
// import { CronosZkEvm, CronosEvm } from '@crypto.com/developer-platform-client';
// import { createReactAgent } from "@langchain/langgraph/prebuilt"


// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

// const llm = new ChatAnthropic({
//     temperature: 0.7,
//     model: "claude-3-5-sonnet-latest",
//     apiKey: process.env.ANTHROPIC_API_KEY,
// })

// const CRONOS_ZKEVM_TESTNET_API_KEY = process.env.CRONOS_ZKEVM_TESTNET_API_KEY || ""
// const CRONOS_ZKEVM_API_KEY = process.env.CRONOS_ZKEVM_API_KEY || ""
// const CRONOS_EVM_TESTNET_API_KEY = process.env.CRONOS_EVM_TESTNET_API_KEY || ""
// const CRONOS_EVM_API_KEY = process.env.CRONOS_EVM_API_KEY || ""

// Amplify.configure(resourceConfig, libraryOptions);

// const client = generateClient<Schema>();

// export const handler: Schema["AgentCronos"]["functionHandler"] = async (event) => {
//     console.log("event", JSON.stringify(event, null, 2))

//     const { messages, agentId }: any = event.arguments

//     const { data }: any = await client.models.Agent.get({
//         id: agentId
//     })

//     const wallets = await data.wallets()
//     const wallet = wallets.data[0]

//     // Init Cronos config
//     const cronos = new CronosAgent(
//         wallet.key,
//         data.subnetwork === "evm" ? (data.isTestnet ? CronosEvm.Testnet : CronosEvm.Mainnet) : (data.isTestnet ? CronosZkEvm.Testnet : CronosZkEvm.Mainnet),
//         data.subnetwork === "evm" ? (data.isTestnet ? CRONOS_EVM_TESTNET_API_KEY : CRONOS_EVM_API_KEY) : (data.isTestnet ? CRONOS_ZKEVM_TESTNET_API_KEY : CRONOS_ZKEVM_API_KEY),
//         process.env.ANTHROPIC_API_KEY || ""
//     )

//     const tools = createCronosTools(cronos)

//     // Create React agent
//     const reactAgent = createReactAgent({
//         llm,
//         tools,
//         messageModifier: `
//         You are a helpful AI agent that can interact on-chain with the Cronos blockchain. 
//         You can perform various blockchain operations using your available tools. 
//         If you ever need funds, you can request them from the faucet. If not, you can provide your wallet details and request funds from the user.
//         If an internal (5XX) error occurs, inform the user and suggest trying again later. 
//         If a requested action is not supported by your current tools, acknowledge the limitation and encourage the user to extend your capabilities. 
//         Keep responses concise and useful. Avoid restating tool descriptions unless explicitly requested.
//       `,
//     })

//     const output = await reactAgent.invoke(
//         {
//             messages
//         }
//     )

//     // Override old messages
//     const finalized = parseLangchain(output.messages).map((msg: any) => {
//         const message = messages.find((i: any) => i.id === msg.id)
//         if (message) {
//             msg = message
//         }
//         return msg
//     })

//     console.log("final messages :", finalized)

//     await client.models.Agent.update({
//         id: agentId,
//         messages: JSON.stringify(finalized)
//     })
 
//     return finalized
// }


// const parseLangchain = (messages: any) => {
//     let finalized: any = []

//     messages.map((msg: any) => {
//         const role = msg?.additional_kwargs && Object.keys(msg?.additional_kwargs).length === 0 ? "user" : "assistant"

//         if (msg?.tool_call_id) {
//             finalized.push({
//                 content: [
//                     {
//                         type: "tool_result",
//                         tool_use_id: msg.tool_call_id,
//                         content: msg.kwargs?.content || msg.content,
//                     }
//                 ],
//                 role: "user",
//                 id: msg.kwargs?.id || msg.id
//             })
//         } else {
//             finalized.push({
//                 role,
//                 content: msg.kwargs?.content || msg.content,
//                 id: msg.kwargs?.id || msg.id
//             })
//         }
//     })
//     return finalized
// }