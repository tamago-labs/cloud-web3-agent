// import { Tool } from "@langchain/core/tools"
// import type { CronosAgent } from "../../agent"
// import { parseJson } from "../../utils"

// export class GetExchangeTickerTool extends Tool {

//     cronosAgent: CronosAgent

//     name = "cronos_exchange_get_ticker"
//     description = `Retrieves ticker information for a specific ticker from the Crypto.com Exchange.
    
//     Inputs ( input is a JSON string ):
//     ticker: string, eg "BTC_USDT" (required)
//     `

//     constructor(cronosAgent: CronosAgent) {
//         super();
//         this.cronosAgent = cronosAgent
//     }

//     async _call(input: string): Promise<string> {
//         try {
//             const parsedInput = parseJson(input)
//             const tickerName = parsedInput.ticker || undefined

//             if (!tickerName) {
//                 throw new Error("Ticker name is not provided");
//             }

//             const ticker = await this.cronosAgent.getExchangeTicker(tickerName)
//             return JSON.stringify({
//                 ...ticker
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