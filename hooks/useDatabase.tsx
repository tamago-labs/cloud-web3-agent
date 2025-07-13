import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>();

const useDatabase = () => {

    const getProfile = async (userId: string) => {

        // const user = await client.models.User.list({
        //     filter: {
        //         username: {
        //             eq: userId
        //         }
        //     }
        // })

        // if (user.data.length === 0) {
        //     const newUser = {
        //         username: userId
        //     }
        //     await client.models.User.create({
        //         ...newUser
        //     })
        //     return newUser
        // } else {
        //     return user.data[0]
        // }
        return undefined
    }

    const listAgents = async (userId: string) => {
        // const list = await client.models.Agent.list({
        //     filter: {
        //         userId: {
        //             eq: userId
        //         }
        //     }
        // })

        // return list.data.sort((a: any, b: any) => {
        //     const timeA = new Date(a.createdAt).getTime();
        //     const timeB = new Date(b.createdAt).getTime();
        //     return timeB - timeA; // Descending order
        // })
        return undefined
    }

    const listMarketplace = async () => {
        // const list = await client.models.Marketplace.list({
        //     filter: {
        //         isApproved: {
        //             eq: true
        //         }
        //     }
        // })

        // return list.data.sort((a: any, b: any) => {
        //     const timeA = new Date(a.createdAt).getTime();
        //     const timeB = new Date(b.createdAt).getTime();
        //     return timeB - timeA; // Descending order
        // })
        return undefined
    }

    const getAgent = async (agentId: string) => {
        // const result = await client.models.Agent.get({
        //     id: agentId
        // })
        // return result.data
        return undefined
    }

    const updateAgent = async (agentId: string, name: string, isTestnet: boolean, subnetwork: string) => {
        // await client.models.Agent.update({
        //     id: agentId,
        //     name,
        //     isTestnet,
        //     subnetwork
        // })
        return undefined
    }

    const clearMessages = async (agentId: string) => {
        // await client.models.Agent.update({
        //     id: agentId,
        //     messages: JSON.stringify([])
        // })
        return undefined
    }

    const setAgentActive = async (agentId: string, isActive: boolean) => {
        // await client.models.Agent.update({
        //     id: agentId,
        //     isActive
        // })
        return undefined
    }

    const saveAgentAutomation = async ({ agentId, promptInput, schedule, promptDecision, promptExecute }: { agentId: string, promptInput: string, schedule: number, promptDecision: string, promptExecute: string }) => {
        // await client.models.Agent.update({
        //     id: agentId,
        //     promptInput,
        //     schedule,
        //     promptDecision,
        //     promptExecute
        // })
    }

    const addToMarketplace = async ({ agentId, publicName, description, category, price, blockchain, sdkType }: { agentId: string, publicName: string, description: string, category: string, price: number, blockchain: string, sdkType: string }) => {
        // await client.models.Marketplace.create({
        //     agentId,
        //     publicName,
        //     description,
        //     isApproved: false,
        //     isHidden: false,
        //     category,
        //     price,
        //     blockchain,
        //     sdkType
        // })
        return undefined
    }

    const saveMarketplace = async ({ listingId, publicName, description, category, price, isHidden }: { listingId: string, publicName: string, description: string, category: string, price: number, isHidden: boolean }) => {
        // await client.models.Marketplace.update({
        //     id: listingId,
        //     publicName,
        //     description,
        //     category,
        //     price,
        //     isHidden
        // })
        return undefined
    }

    const getMessages = async (agentId: string) => {
        // const result = await client.models.Agent.get({
        //     id: agentId
        // })
        // return result?.data?.messages ? JSON.parse(String(result.data.messages)) : []
        return []
    }

    const saveMessages = async (agentId: string, messages: any) => {

        // await client.models.Agent.update({
        //     id: agentId,
        //     messages: JSON.stringify(messages)
        // })
        return []
    }

    return {
        getProfile,
        getMessages,
        listAgents,
        updateAgent,
        getAgent,
        saveMessages,
        clearMessages,
        setAgentActive,
        saveAgentAutomation,
        addToMarketplace,
        saveMarketplace,
        listMarketplace
    }
}

export default useDatabase