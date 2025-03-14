import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>();

const useDatabase = () => {

    const getProfile = async (userId: string) => {

        const user = await client.models.User.list({
            filter: {
                username: {
                    eq: userId
                }
            }
        })

        if (user.data.length === 0) {
            const newUser = {
                username: userId
            }
            await client.models.User.create({
                ...newUser
            })
            return newUser
        } else {
            return user.data[0]
        }
    }

    const listAgents = async (userId: string) => {
        const list = await client.models.Agent.list({
            filter: {
                userId: {
                    eq: userId
                }
            }
        })

        return list.data.sort((a: any, b: any) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeB - timeA; // Descending order
        })
    }

    const getAgent = async (agentId: string) => {
        const result = await client.models.Agent.get({
            id: agentId
        })
        return result.data
    }

    const updateAgent = async (agentId: string, name: string, isTestnet: boolean) => {
        await client.models.Agent.update({
            id: agentId,
            name,
            isTestnet
        })
    }

    const getMessages = async (agentId: string) => {
        const result = await client.models.Agent.get({
            id: agentId
        })
        return result?.data?.messages ? JSON.parse(String(result.data.messages)) : []
    }

    const saveMessages = async (agentId: string, messages: any) => {

        await client.models.Agent.update({
            id: agentId,
            messages: JSON.stringify(messages)
        })
    }

    return {
        getProfile,
        getMessages,
        listAgents,
        updateAgent,
        getAgent,
        saveMessages
    }
}

export default useDatabase