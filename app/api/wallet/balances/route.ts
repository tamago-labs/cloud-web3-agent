
import { NextRequest, NextResponse } from 'next/server';
import { validateAccessKey, getUserWallet } from '@/lib/api/auth';


export async function POST(request: NextRequest, response: NextResponse<any>) {
    try {
        const { accessKey, chainId } = await request.json();

        const user = await validateAccessKey(request, response, accessKey);
        const wallet = await getUserWallet(request, response, user.id, chainId);

        // Get balances using chain-specific logic
        let balances;
        switch (chainId) {
            case 'sui':
                const { getSuiBalances } = await import('@/lib/chains/sui/client');
                balances = await getSuiBalances(wallet.address);
                break;
            case 'ethereum':
            case 'polygon':
            case 'base':
                const { getEVMBalances } = await import('@/lib/chains/evm/client');
                balances = await getEVMBalances(wallet.address, chainId);
                break;
            default:
                throw new Error(`Unsupported chain: ${chainId}`);
        }

        return NextResponse.json({
            success: true,
            balances,
            walletAddress: wallet.address
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}