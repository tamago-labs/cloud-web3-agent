import { ChatService } from '@/lib/chat'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { messages, currentMessage, mcpConfig } = await request.json();

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
                    console.log('Starting chat stream with config:', mcpConfig);

                    const chatGenerator = chatService.streamChat(
                        chatHistory,
                        currentMessage,
                        mcpConfig
                    );

                    for await (const chunk of chatGenerator) {
                        // Handle different chunk types from enhanced streaming
                        if (typeof chunk === 'string') {
                            // Legacy string chunk support
                            const data = `data: ${JSON.stringify({ chunk })}\n\n`;
                            controller.enqueue(new TextEncoder().encode(data));
                        } else if (chunk && typeof chunk === 'object' && 'type' in chunk) {
                            // Enhanced chunk with type and tool information
                            const data = `data: ${JSON.stringify({ chunk })}\n\n`;
                            controller.enqueue(new TextEncoder().encode(data));
                        } else {
                            console.log('Unknown chunk type:', chunk);
                        }
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

        // Return streaming response with Amplify/CloudFront specific headers
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'X-Accel-Buffering': 'no',
                'X-Content-Type-Options': 'nosniff',
                'Pragma': 'no-cache',
                'CloudFront-Is-SmartTV-Viewer': 'false', // Prevent CloudFront buffering
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}