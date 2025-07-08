import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const mcpClient = getMCPClient();
        const tools = await mcpClient.listTools();

        return NextResponse.json({
            success: true,
            tools,
            totalServers: Object.keys(tools).length,
            totalTools: Object.values(tools).reduce((sum, serverTools) => sum + serverTools.length, 0)
        });

    } catch (error) {
        console.error('MCP tools list error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to list tools' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { serverName, toolName, arguments: args }: any = await request.json();

        if (!serverName || !toolName) {
            return NextResponse.json(
                { error: 'Server name and tool name are required' },
                { status: 400 }
            );
        }

        const mcpClient = getMCPClient();
        const result = await mcpClient.callTool(serverName, toolName, args || {});

        return NextResponse.json({
            success: true,
            result,
            serverName,
            toolName,
            executedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('MCP tool call error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Tool execution failed',
            },
            { status: 500 }
        );
    }
}
