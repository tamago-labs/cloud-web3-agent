import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const mcpClient = getMCPClient();
        const status = await mcpClient.getStatus();

        // Also get the server list to include in status
        const servers = await mcpClient.listServers();

        // Enhance status with server list
        const enhancedStatus = {
            ...status,
            connectedServers: servers.connected || [],
            registeredServers: servers.registered || []
        };

        return NextResponse.json({
            success: true,
            status: enhancedStatus
        });

    } catch (error) {
        console.error('MCP status error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get MCP status',
                status: {
                    healthy: false,
                    connectedServers: [],
                    registeredServers: [],
                    error: error instanceof Error ? error.message : 'Service unavailable',
                    serviceUrl: process.env.MCP_SERVICE_URL || 'Service URL not configured'
                }
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

            case 'status':
                const status = await mcpClient.getStatus();
                const serverList = await mcpClient.listServers();
                
                return NextResponse.json({
                    success: true,
                    status: {
                        ...status,
                        connectedServers: serverList.connected || [],
                        registeredServers: serverList.registered || []
                    }
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
