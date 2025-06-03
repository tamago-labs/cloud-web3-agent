import { createContext, useCallback, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
import useDatabase from "./useDatabase";
import type { Schema } from "../amplify/data/resource"
import { generateClient } from "aws-amplify/api"

const client = generateClient<Schema>()

export const CloudAgentContext = createContext<any>({})

type Props = {
    children: ReactNode;
};

const Provider = ({ children }: Props) => {

    const { getProfile } = useDatabase()

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            profile: undefined
        }
    )

    const { profile } = values

    const loadProfile = useCallback((userId: string) => {

        getProfile(userId).then(
            (profile: any) => {
                dispatch({
                    profile
                })
            }
        )

    }, [])

    const generateApiKey = async (userId: string, name: string) => {
        const result: any = await client.queries.GenerateApiKey({
            userId,
            name
        })
        return JSON.parse(result.data)
    }

    const deleteApiKey = async (keyId: string) => {
        await client.models.ApiKey.delete({
            id: keyId
        })
    }

    const query = async (agentId: string, messages: any) => {

        console.log("querying...", agentId, messages)

        const result: any = await client.queries.AgentChat({
            agentId,
            messages: JSON.stringify(messages)
        })

        console.log("result:", result, (new Date().toLocaleString()))

        return JSON.parse(result.data)
    }

    const queryCronos = async (agentId: string, messages: any) => {
        console.log("querying...", agentId, messages)

        const result: any = await client.queries.AgentCronos({
            agentId,
            messages: JSON.stringify(messages)
        })

        console.log("result:", result, (new Date().toLocaleString()))

        return JSON.parse(result.data)
    }

    const cloudAgentContext: any = useMemo(
        () => ({
            profile,
            loadProfile,
            query,
            queryCronos,
            generateApiKey,
            deleteApiKey
        }),
        [
            profile
        ]
    )

    return (
        <CloudAgentContext.Provider value={cloudAgentContext}>
            {children}
        </CloudAgentContext.Provider>
    )
}

export default Provider
