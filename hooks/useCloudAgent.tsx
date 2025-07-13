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

    const query = async (agentId: string, messages: any) => {

        console.log("querying...", agentId, messages)

        // const result: any = await client.queries.AgentChat({
        //     agentId,
        //     messages: JSON.stringify(messages)
        // })

        // console.log("result:", result, (new Date().toLocaleString()))

        // return JSON.parse(result.data)
        return {}
    }

    const queryCronos = async (agentId: string, messages: any) => {
        // console.log("querying...", agentId, messages)

        // const result: any = await client.queries.AgentCronos({
        //     agentId,
        //     messages: JSON.stringify(messages)
        // })

        // console.log("result:", result, (new Date().toLocaleString()))

        // return JSON.parse(result.data)
        return {}
    }

    const cloudAgentContext: any = useMemo(
        () => ({
            profile,
            loadProfile,
            query,
            queryCronos
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
