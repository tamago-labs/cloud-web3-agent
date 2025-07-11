import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const mcpClient = getMCPClient();
        
        // Get detailed server status with tool counts
        const detailedStatus = await mcpClient.getDetailedServerStatus();
        
        // Also get tools for each server
        const tools = await mcpClient.listTools();
        
        return NextResponse.json({
            success: true,
            servers: detailedStatus,
            tools
        });

    } catch (error) {
        console.error('MCP servers API error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get server data',
                servers: [],
                tools: {}
            },
            { status: 500 }
        );
    }
}

// Connect to a specific server
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

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('MCP servers action error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : 'MCP action failed' 
            },
            { status: 500 }
        );
    }
}
