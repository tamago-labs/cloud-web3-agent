import { Tool } from "@langchain/core/tools"
import type { CronosAgent } from "../../agent"
import { parseJson } from "../../utils"


export class TransferTokenTool extends Tool {

    cronosAgent: CronosAgent

    name = "cronos_transfer_token"
    description = `this tool can be used to transfer native CRO token or any ERC-20 token to a recipient address

  if you want to transfer token other than CRO, you need to provide the tokenAddress of that specific token

  Inputs ( input is a JSON string ):
  toAddress: string, eg "0x024c5e453E199A32D29aC61B9D5d28A9B2f76f88 (required)"
  amount: number, eg 1 or 0.01 (required)
  tokenAddress: string, eg "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" (optional)
`

    constructor(cronosAgent: CronosAgent) {
        super();
        this.cronosAgent = cronosAgent
    }

    async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)
            const {
                toAddress,
                amount,
                tokenAddress
            } = parsedInput;

            if (!toAddress) {
                throw new Error("Recipient address is not provided");
            }

            if (!amount || amount < 0.01) {
                throw new Error("Transfer amount is not provided");
            }

            const agentAddress = await this.cronosAgent.getAgentAddress()

            let txHash;

            if (tokenAddress) {
                txHash = await this.cronosAgent.transferERC20Tokens(tokenAddress, toAddress, amount)
            } else {
                txHash = await this.cronosAgent.transferNativeTokens(toAddress, amount)
            }

            return JSON.stringify({
                status: "success",
                transactionHash: txHash,
                from: agentAddress,
                to: toAddress,
                amount,
                tokenAddress: tokenAddress || "native"
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