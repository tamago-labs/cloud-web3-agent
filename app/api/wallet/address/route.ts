import { NextRequest, NextResponse } from 'next/server';
import { validateAccessKey, getUserWallet } from '@/lib/api/auth';

export async function POST(request: NextRequest, response: NextResponse<any>) {
    try {
        const { accessKey, chainId } = await request.json();

        // Validate access key and get user
        const user = await validateAccessKey(request, response, accessKey);

        // Get user's wallet for the chain
        const wallet = await getUserWallet(request, response, user.id, chainId);

        return NextResponse.json({
            success: true,
            address: wallet.address,
            chainId: wallet.chainId
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}