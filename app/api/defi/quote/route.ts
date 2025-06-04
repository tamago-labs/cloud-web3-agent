import { NextRequest, NextResponse } from 'next/server';
import { validateAccessKey } from '@/lib/api/auth';

export async function POST(request: NextRequest, response: NextResponse<any>) {
    try {
        const { accessKey, chainId, fromToken, toToken, amount } = await request.json();

        await validateAccessKey(request, response, accessKey);

        // Get quote using chain-specific logic
        let quote;
        switch (chainId) {
            case 'sui':
                const { getSuiSwapQuote } = await import('@/lib/chains/sui/client');
                quote = await getSuiSwapQuote(fromToken, toToken, amount);
                break;
            case 'ethereum':
            case 'polygon':
            case 'base':
                const { getEVMSwapQuote } = await import('@/lib/chains/evm/client');
                quote = await getEVMSwapQuote(fromToken, toToken, amount, chainId);
                break;
            default:
                throw new Error(`Unsupported chain: ${chainId}`);
        }

        return NextResponse.json({
            success: true,
            quote
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}