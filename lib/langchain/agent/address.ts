import { Tool } from "@langchain/core/tools"
import type { CronosAgent } from "../../agent"

export class GetAgentAddressTool extends Tool {

    cronosAgent: CronosAgent

    name = "cronos_get_wallet_address";
    description = `Get the wallet address of the agent`;

    constructor(cronosAgent: CronosAgent) {
        super();
        this.cronosAgent = cronosAgent
    }

    async _call(_input: string): Promise<string> {
        return this.cronosAgent.getAgentAddress()
    }

}