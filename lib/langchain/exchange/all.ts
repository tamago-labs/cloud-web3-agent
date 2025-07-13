// import { Tool } from "@langchain/core/tools"
// import type { CronosAgent } from "../../agent"
// import { parseJson } from "../../utils"

// export class GetExchangeAllTickersTool extends Tool {

//     cronosAgent: CronosAgent

//     name = "cronos_exchange_all_tickers"
//     description = `Retrieves all available tickers from the Crypto.com Exchange.`

//     constructor(cronosAgent: CronosAgent) {
//         super();
//         this.cronosAgent = cronosAgent
//     }

//     async _call(_input: string): Promise<string> {
//         try {
//             const tickers = await this.cronosAgent.getExchangeAvailableTickers()
//             return JSON.stringify({
//                 ...tickers
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