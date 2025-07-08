import { ChatService } from '@/lib/chat-enhanced';
import { getMCPClient } from '@/lib/mcp/railway-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { messages, currentMessage, enableMCP = false } = await request.json();

        // Validate input
        if (!currentMessage || typeof currentMessage !== 'string') {
            return NextResponse.json(
                { error: 'Current message is required' },
                { status: 400 }
            );
        }

        // Initialize chat service
        const chatService = new ChatService();

        // Convert messages to ChatMessage format if needed
        const chatHistory = (messages || []).map((msg: any, index: number) => ({
            id: msg.id || `msg-${index}`,
            sender: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content || msg.message || '',
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            stopReason: msg.stopReason
        }));

        // Create a ReadableStream for streaming response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const chatGenerator = chatService.streamChat(
                        chatHistory, 
                        currentMessage,
                        enableMCP
                    );
                    
                    for await (const chunk of chatGenerator) {
                        // Send each chunk as server-sent event
                        const data = `data: ${JSON.stringify({ chunk })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(data));
                    }

                    // Send completion signal
                    const endData = `data: ${JSON.stringify({ done: true })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(endData));
                    
                } catch (error) {
                    console.error('Chat stream error:', error);
                    const errorData = `data: ${JSON.stringify({ 
                        error: error instanceof Error ? error.message : 'Unknown error occurred' 
                    })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(errorData));
                } finally {
                    controller.close();
                }
            }
        });

        // Return streaming response
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
