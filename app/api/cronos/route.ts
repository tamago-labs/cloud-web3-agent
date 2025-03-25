import { NextResponse } from 'next/server'
import { CronosAgent, createCronosTools } from "../../../lib"
import { ChatOpenAI } from "@langchain/openai"
import { CronosZkEvm } from "@crypto.com/developer-platform-client"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { ChatAnthropic } from "@langchain/anthropic"

// const llm = new ChatOpenAI({
//     modelName: "gpt-4o-mini",
//     temperature: 0.7,
//     apiKey: process.env.OPENAI_API_KEY
// })

// const llm = new ChatAnthropic({
//     temperature: 0.7,
//     model: "claude-3-5-sonnet-latest",
//     apiKey: process.env.ANTHROPIC_API_KEY,
// })

export const POST = async function queryRoute(req: any) {

    const params = await req.json()
    const { messages } = params

    const res = new NextResponse()

    // const cronosAgent = new CronosAgent(
    //     process.env.EVM_TEST_KEY || "",
    //     CronosZkEvm.Testnet,
    //     process.env.CRONOS_ZKEVM_API_KEY || "",
    //     process.env.OPENAI_API_KEY || ""
    // )

    // const tools = createCronosTools(cronosAgent)

    // const reactAgent = createReactAgent({
    //     llm,
    //     tools,
    //     messageModifier: `
    //     You are a helpful AI agent that can interact on-chain with the Cronos blockchain. 
    //     You can perform various blockchain operations using your available tools. 
    //     If you ever need funds, you can request them from the faucet. If not, you can provide your wallet details and request funds from the user.
    //     If an internal (5XX) error occurs, inform the user and suggest trying again later. 
    //     If a requested action is not supported by your current tools, acknowledge the limitation and encourage the user to extend your capabilities. 
    //     Keep responses concise and useful. Avoid restating tool descriptions unless explicitly requested.
    //   `,
    // })

    // const output = await reactAgent.invoke(
    //     {
    //         messages
    //     }
    // )

    // // Override old messages
    // const finalized = parseLangchain(output.messages).map((msg: any) => {
    //     const message = messages.find((i: any) => i.id === msg.id)
    //     if (message) {
    //         msg = message
    //     }
    //     return msg
    // })

    // return NextResponse.json({ status: "ok", messages: finalized }, res)
    return NextResponse.json({ status: "ok" }, res)
}

const parseLangchain = (messages: any) => {
    let finalized: any = []

    messages.map((msg: any) => {
        const role = msg?.additional_kwargs && Object.keys(msg?.additional_kwargs).length === 0 ? "user" : "assistant"

        if (msg?.tool_call_id) {
            finalized.push({
                content: [
                    {
                        type: "tool_result",
                        tool_use_id: msg.tool_call_id,
                        content: msg.kwargs?.content || msg.content,
                    }
                ],
                role: "user",
                id: msg.kwargs?.id || msg.id
            })
        } else {
            finalized.push({
                role,
                content: msg.kwargs?.content || msg.content,
                id: msg.kwargs?.id || msg.id
            })
        }
    })
    return finalized
}