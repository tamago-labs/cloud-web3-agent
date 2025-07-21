import { NextResponse } from 'next/server'
// import { Aptos, AptosConfig, Ed25519PrivateKey, Secp256k1PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk"
// import { ChatAnthropic } from "@langchain/anthropic"
// import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from "@langchain/core/messages"
// import { createReactAgent } from "@langchain/langgraph/prebuilt"
// import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"

// const llm = new ChatAnthropic({
//     temperature: 0.7,
//     model: "claude-3-5-sonnet-latest",
//     apiKey: process.env.ANTHROPIC_API_KEY,
// })

export const POST = async function queryRoute(req: any) {

    const params = await req.json()
    const { messages } = params

    const res = new NextResponse()

    // const agent: any = await setup()
    // const output = await agent.invoke(
    //     {
    //         messages
    //     }
    // )

    // const finalized = output.messages.map((msg: any) => {   
    //     const role = msg.additional_kwargs?.role || "user" 
    //     return {
    //         role,
    //         content: msg.kwargs?.content || msg.content,
    //         id: msg.kwargs?.id || msg.id
    //     }
    // })

    // return NextResponse.json({ status: "ok", messages: finalized }, res)

    return NextResponse.json({ status: "ok" }, res)
}


// const setup = async () => {
//     // Initialize Aptos configuration
//     const aptosConfig = new AptosConfig({
//         network: Network.MAINNET,
//     })

//     const aptos = new Aptos(aptosConfig)
//     const privateKeyStr = process.env.APTOS_TEST_KEY || ""

//     // Setup account and signer
//     const account = await aptos.deriveAccountFromPrivateKey({
//         privateKey: new Secp256k1PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Secp256k1)),
//     })

//     const signer = new LocalSigner(account, Network.MAINNET)
//     const aptosAgent = new AgentRuntime(signer, aptos)
//     const tools = createAptosTools(aptosAgent)

//     // Create React agent
//     const agent = createReactAgent({
//         llm,
//         tools,
//         messageModifier: `
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
//     })

//     return agent

// }