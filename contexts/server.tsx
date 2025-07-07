import { createContext, useCallback, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { serverAPI } from "@/lib/api"

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

    const loadServers = async () => {  
        return await serverAPI.getAllServers()
    }

    const serverContext: any = useMemo(
        () => ({
            servers,
            loadServers
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