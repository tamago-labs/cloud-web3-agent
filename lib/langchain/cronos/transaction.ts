

import { Tool } from "@langchain/core/tools"
import type { CronosAgent } from "../../agent"
import { parseJson } from "../../utils"

export class GetTransactionTool extends Tool {

    cronosAgent: CronosAgent

    name = "cronos_transaction"
    description = `Get the transaction details from the transaction hash.

  You will need to provide a transaction hash as transactionHash.

  Inputs ( input is a JSON string ):
  transactionHash: string, eg "0x28f1553634870c849335c63b589b429d5e0d484cc584437da6b1ecfe29b73b11" (required)`

    constructor(cronosAgent: CronosAgent) {
        super();
        this.cronosAgent = cronosAgent
    }

    async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)
            const transactionHash = parsedInput.transactionHash || undefined

            if (!transactionHash) {
                throw new Error("Transaction hash is not provided")
            }

            const transaction = await this.cronosAgent.getTransactionByHash(transactionHash)
            const transactionStatus = await this.cronosAgent.getTransactionStatus(transactionHash)

            return JSON.stringify({
                status: "success",
                transaction,
                transactionStatus
            })

        } catch (error: any) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            })
        }
    }

}