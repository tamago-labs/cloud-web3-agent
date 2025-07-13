// import { Tool } from "@langchain/core/tools"
// import type { CronosAgent } from "../../agent"
// import { parseJson } from "../../utils"


// export class GetContractAbiTool extends Tool {

//     cronosAgent: CronosAgent

//     name = "cronos_contract_abi"
//     description = `Get the contract ABI of a specific contract.

//   You will need to provide a contract address as contractAddress.

//   Inputs ( input is a JSON string ):
//   contractAddress: string, eg "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (required)`

//     constructor(cronosAgent: CronosAgent) {
//         super();
//         this.cronosAgent = cronosAgent
//     }

//     async _call(input: string): Promise<string> {
//         try {
//             const parsedInput = parseJson(input)
//             const contractAddress = parsedInput.contractAddress || undefined

//             if (!contractAddress) {
//                 throw new Error("Contract address is not provided")
//             }

//             const abi = await this.cronosAgent.getContractAbi(contractAddress)

//             return JSON.stringify({
//                 ...abi
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