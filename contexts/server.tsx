import { createContext, useCallback, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { serverAPI } from "@/lib/api"
import { getCurrentUser  } from 'aws-amplify/auth';

export const ServerContext = createContext<any>({})

type Props = {
    children: ReactNode;
};

const Provider = ({ children }: Props) => {

    
    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }), {
        servers: []
    })

    const { servers } = values

    const checkLoggedIn = async () => {
        try {
            const { username, userId, signInDetails } = await getCurrentUser();
            return true
        } catch (e) {
            return false
        }
    }

    const loadServers = async () => {  
        const isLoggedIn = await checkLoggedIn()
        return await serverAPI.getAllServers(isLoggedIn)
    }

    const getServer = async (serverId: string) => {
        const isLoggedIn = await checkLoggedIn()
        return await serverAPI.getServer(isLoggedIn, serverId)
    }

    const serverContext: any = useMemo(
        () => ({
            servers,
            loadServers,
            getServer
        }),
        [
            servers
        ]
    )

    return (
        <ServerContext.Provider value={serverContext}>
            {children}
        </ServerContext.Provider>
    )
}

export default Provider