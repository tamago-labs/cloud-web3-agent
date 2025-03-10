import { createContext, useCallback, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
import useDatabase from "./useDatabase";

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

    const cloudAgentContext: any = useMemo(
        () => ({
            profile,
            loadProfile
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
