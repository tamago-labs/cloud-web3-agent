import { NextRequest, NextResponse } from 'next/server'
import {
    runWithAmplifyServerContext,
    reqResBasedClient,
} from "@/utils/amplify-utils"

export async function validateAccessKey(request: NextRequest, response: NextResponse<any>, accessKey: string) {

    const apiKeyRecord = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec: any) => {
            const { data: apiKeyRecord } = await reqResBasedClient.models.ApiKey.get(
                contextSpec,
                {
                    id: accessKey
                }
            );
            return apiKeyRecord;
        },
    })

    if (!apiKeyRecord) {
        throw new Error('Invalid or inactive access key');
    }

    const user = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec: any) => {
            const { data: user } = await reqResBasedClient.models.User.get(
                contextSpec,
                {
                    id: apiKeyRecord.userId
                }
            );
            return user;
        },
    })

    return user
}

export async function getUserWallet(request: NextRequest, response: NextResponse<any>, userId: string, chainId: string) {

    const wallets = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec: any) => {
            const { data: wallets } = await reqResBasedClient.models.ConnectedWallet.list(
                contextSpec,
                {
                    filter: {
                        userId: { eq: userId },
                        chainId: { eq: chainId }
                    }
                }
            );
            return wallets;
        },
    })

    if (wallets.length > 0) {
        return wallets[0]
    } else {
        throw new Error('No wallet is linked to this account')
    }

}