// import { Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk"
// import { ChatAnthropic } from "@langchain/anthropic"
// import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from "@langchain/core/messages"
// import { MemorySaver } from "@langchain/langgraph"
// import { createReactAgent } from "@langchain/langgraph/prebuilt"
// import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"
// import { NextResponse } from "next/server"

import axios from "axios";

// const llm = new ChatAnthropic({
//     temperature: 0.7,
//     model: "claude-3-5-sonnet-latest",
//     apiKey: process.env.ANTHROPIC_API_KEY,
// })

// for Local test only


const useTest = () => {

    //     const setup = async () => {
    //         // Initialize Aptos configuration
    //         const aptosConfig = new AptosConfig({
    //             network: Network.MAINNET,
    //         })

    //         const aptos = new Aptos(aptosConfig)
    //         const privateKeyStr = process.env.APTOS_TEST_KEY || ""

    //         // Setup account and signer
    //         const account = await aptos.deriveAccountFromPrivateKey({
    //             privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)),
    //         })

    //         const signer = new LocalSigner(account, Network.MAINNET)
    //         const aptosAgent = new AgentRuntime(signer, aptos, {
    //             PANORA_API_KEY: process.env.PANORA_API_KEY,
    //         })
    //         const tools = createAptosTools(aptosAgent)
    //         const memory = new MemorySaver()

    //         // Create React agent
    //         const agent = createReactAgent({
    //             llm,
    //             tools,
    //             checkpointSaver: memory,
    //             messageModifier: `
    //         You are a helpful agent that can interact onchain using the Aptos Agent Kit. You are
    //         empowered to interact onchain using your tools. If you ever need funds, you can request them from the
    //         faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
    //         (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
    //         can't do with your currently available tools, you must say so, and encourage them to implement it
    //         themselves using the Aptos Agent Kit, recommend they go to https://www.aptosagentkit.xyz for more information. Be
    //         concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.

    // 		The response also contains token/token[] which contains the name and address of the token and the decimals.
    // 		WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
    //       `,
    //         })

    //         return agent

    //     }

    const query = async (messages: any) => {

        const { data } = await axios.post(`/api/query`, {
            messages
        })
 
        return data.messages
    }

    const cronos = async (messages: any) => {

        const { data } = await axios.post(`/api/cronos`, {
            messages
        })

        console.log("data:", data)
 
        return data.messages
    }

    return {
        query,
        cronos
    }
}

export default useTest