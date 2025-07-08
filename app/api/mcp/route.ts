import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const mcpClient = getMCPClient();
        const status = await mcpClient.getStatus();

        return NextResponse.json({
            success: true,
            status
        });

    } catch (error) {
        console.error('MCP status error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get MCP status' 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action, serverName } = await request.json();
        const mcpClient = getMCPClient();

        switch (action) {
            case 'connect':
                if (!serverName) {
                    return NextResponse.json(
                        { error: 'Server name is required for connect action' },
                        { status: 400 }
                    );
                }
                
                await mcpClient.connectServer(serverName);
                return NextResponse.json({
                    success: true,
                    message: `Connected to ${serverName}`,
                    serverName
                });

            case 'disconnect':
                if (!serverName) {
                    return NextResponse.json(
                        { error: 'Server name is required for disconnect action' },
                        { status: 400 }
                    );
                }
                
                await mcpClient.disconnectServer(serverName);
                return NextResponse.json({
                    success: true,
                    message: `Disconnected from ${serverName}`,
                    serverName
                });

            case 'health':
                const health = await mcpClient.healthCheck();
                return NextResponse.json({
                    success: true,
                    health
                });

            case 'initialize':
                const servers = Array.isArray(serverName) ? serverName : ['filesystem', 'web3-mcp'];
                await mcpClient.initializeServers(servers);
                return NextResponse.json({
                    success: true,
                    message: `Initialized servers: ${servers.join(', ')}`,
                    servers
                });

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('MCP action error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'MCP action failed' 
            },
            { status: 500 }
        );
    }
}
