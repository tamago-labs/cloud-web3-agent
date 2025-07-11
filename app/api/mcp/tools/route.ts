import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const mcpClient = getMCPClient();
        
        // Get all tools from all connected servers
        const tools = await mcpClient.listTools();
        
        return NextResponse.json({
            success: true,
            tools
        });

    } catch (error) {
        console.error('MCP tools API error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get tools',
                tools: {}
            },
            { status: 500 }
        );
    }
}
