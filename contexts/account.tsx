import { createContext, useCallback, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
// import { getCurrentUser, signIn } from 'aws-amplify/auth';
// import { useInterval } from 'usehooks-ts';
import { userProfileAPI } from "@/lib/api";



export const AccountContext = createContext<any>({})

type Props = {
    children: ReactNode;
};

const Provider = ({ children }: Props) => {

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }), {
        profile: undefined,
        tick: 1,
        interval: 3000
    })

    const { profile, tick, interval } = values
 
    const saveProfile = (profile: any) => {
        dispatch({
            profile
        })
    }

    const updateProfile = useCallback(async (userId: string, userData: any) => {

        try {
            const profile = await userProfileAPI.updateProfile(userId, userData)
            dispatch({
                profile
            })
        } catch (e) {

        }

    }, [])

    const accountContext: any = useMemo(
        () => ({
            profile,
            updateProfile,
            saveProfile
        }),
        [
            profile
        ]
    )

    return (
        <AccountContext.Provider value={accountContext}>
            {children}
        </AccountContext.Provider>
    )
}

export default Provider