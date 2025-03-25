// import assert from "assert"
// import { ChatOpenAI } from "@langchain/openai"
// import { Wallet, CronosZkEvm } from "@crypto.com/developer-platform-client"
// import { createReactAgent } from "@langchain/langgraph/prebuilt"
// import { CronosAgent, createCronosTools } from "../lib/js/index.mjs"
// import dotenv from 'dotenv'

// dotenv.config()

// describe('#Cronos Agent', function () {

//     let agent

//     before(async function () {
//         agent = await initializeAgent()
//     })

//     it('returns the agent address', async function () {

//         const userPrompt = {
//             role: 'user',
//             content: "What is the agent wallet address?"
//         }

//         const output = await agent.invoke(
//             {
//                 messages: [ userPrompt]
//             }
//         )

//         console.log("output: ", output)

//         assert.equal(true, true)
//     })



// })

// async function initializeAgent() {

//     try {

//         const llm = new ChatOpenAI({
//             modelName: "gpt-4o-mini",
//             temperature: 0.3,
//             apiKey: process.env.OPENAI_API_KEY
//         })

//         const wallet = await Wallet.create()
//         const walletPrivateKey = wallet.data.privateKey

//         const cronosAgent = new CronosAgent(
//             walletPrivateKey,
//             CronosZkEvm.Testnet,
//             process.env.CRONOS_ZKEVM_API_KEY,
//             process.env.OPENAI_API_KEY
//         )

//         const tools = createCronosTools(cronosAgent);

//         const reactAgent = createReactAgent({
//             llm,
//             tools,
//             messageModifier: `
//             You are a helpful AI agent that can interact on-chain with the Cronos blockchain. 
//             You can perform various blockchain operations using your available tools. 
//             If you need funds, you can request them from a faucet or provide your wallet details for manual funding.
//             If an internal (5XX) error occurs, inform the user and suggest trying again later. 
//             If a requested action is not supported by your current tools, acknowledge the limitation and encourage the user to extend your capabilities. 
//             Keep responses concise and useful. Avoid restating tool descriptions unless explicitly requested.
//           `,
//         })

//         // const userPrompt = {
//         //     role: 'user',
//         //     content: agent.promptInput
//         // }

//         // const output = await reactAgent.invoke(
//         //     {
//         //         messages: [...messages, userPrompt]
//         //     }
//         // )

//         return reactAgent
//     } catch (error) {
//         console.error("Failed to initialize agent:", error)
//         return null
//     }

// }