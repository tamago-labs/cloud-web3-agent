// import { Tool } from "@langchain/core/tools"
// import type { CronosAgent } from "../../agent"
// import { parseJson } from "../../utils"

// export class GetAgentBalanceTool extends Tool {

//     cronosAgent: CronosAgent

//     name = "cronos_agent_balance"
//     description = `Get the balance of a Cronos account.

//   If you want to get the balance of your wallet, you don't need to provide the walletAddress.
//   If no walletAddress is provided, the agent address will be used.

//   Inputs ( input is a JSON string ):
//   walletAddress: string, eg "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (optional)`

//     constructor(cronosAgent: CronosAgent) {
//         super();
//         this.cronosAgent = cronosAgent
//     }

//     async _call(input: string): Promise<string> {
//         try {
//             const parsedInput = parseJson(input)
//             const walletAddress = parsedInput.tokenAddress || undefined
//             const agentAddress = await this.cronosAgent.getAgentAddress()
//             const balance = await this.cronosAgent.getWalletBalance(walletAddress || agentAddress)
//             return JSON.stringify({
//                 ...balance
//             })
//         } catch (error: any) {
//             return JSON.stringify({
//                 status: "error",
//                 message: error.message,
//                 code: error.code || "UNKNOWN_ERROR",
//             })
//         }

//     }

// }