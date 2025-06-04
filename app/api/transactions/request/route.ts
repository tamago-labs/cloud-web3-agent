import { NextRequest, NextResponse } from 'next/server';
import { validateAccessKey } from '@/lib/api/auth';
import {
    runWithAmplifyServerContext,
    reqResBasedClient,
} from "@/utils/amplify-utils"

export async function POST(request: NextRequest, response: NextResponse<any>) {
    try {
        const { accessKey, chainId, toolName, params } = await request.json();

        const user = await validateAccessKey(request, response, accessKey);

        // Create pending transaction
        const transaction = await runWithAmplifyServerContext({
            nextServerContext: { request, response },
            operation: async (contextSpec: any) => {
                const { data: transaction } = await reqResBasedClient.models.PendingTransaction.create(
                    contextSpec,
                    {
                        userId: user.id,
                        chainId,
                        toolName,
                        params: JSON.stringify(params),
                        status: 'pending'
                    }
                );
                return transaction;
            },
        })

        return NextResponse.json({
            success: true,
            transactionId: transaction?.id,
            status: 'pending',
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/transactions/${transaction?.id}`
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}