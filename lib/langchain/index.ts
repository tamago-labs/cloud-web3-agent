// import {
//     GetAgentAddressTool,
//     GetAgentBalanceTool,
//     TransferTokenTool
// } from "./agent"

// import {
//     GetTokenBalanceTool,
//     GetContractAbiTool,
//     GetTransactionTool
// } from "./cronos"

// import {
//     GetExchangeAllTickersTool,
//     GetExchangeTickerTool
// } from "./exchange"

// import type { CronosAgent } from "../agent"


// export function createCronosTools(cronosAgent: CronosAgent) {
//     return [
//         new GetAgentAddressTool(cronosAgent),
//         new GetAgentBalanceTool(cronosAgent),
//         new TransferTokenTool(cronosAgent),
//         new GetTokenBalanceTool(cronosAgent),
//         new GetContractAbiTool(cronosAgent),
//         new GetTransactionTool(cronosAgent),
//         new GetExchangeAllTickersTool(cronosAgent),
//         new GetExchangeTickerTool(cronosAgent)
//     ]
// }