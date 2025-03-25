import { Tool } from "@langchain/core/tools"
import type { CronosAgent } from "../../agent"
import { parseJson } from "../../utils"

export class GetTokenBalanceTool extends Tool {

    cronosAgent: CronosAgent

    name = "cronos_token_balance"
    description = `Get the balance of a specific token.

  If you want to get the balance of your wallet, you don't need to provide the tokenAddress.
  If no tokenAddress is provided, the balance will be in CRO.

  Inputs ( input is a JSON string ):
  tokenAddress: string, eg "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (optional)`

    constructor(cronosAgent: CronosAgent) {
        super();
        this.cronosAgent = cronosAgent
    }

    async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)
            const tokenAddress = parsedInput.tokenAddress || undefined
            const agentAddress = await this.cronosAgent.getAgentAddress()

            if (tokenAddress) {
                const balance = await this.cronosAgent.getERC20TokenBalance(agentAddress, tokenAddress)
                return JSON.stringify({
                    status: "success",
                    balance
                })
            } else {
                const balance = await this.cronosAgent.getNativeTokenBalance(agentAddress)
                return JSON.stringify({
                    status: "success",
                    balance
                })
            }

        } catch (error: any) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            })
        }
    }

}