import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { streamifyResponse, ResponseStream } from "lambda-stream";

// Main streaming handler function
async function chatStreamHandler(
  event: APIGatewayProxyEventV2,
  responseStream: ResponseStream
): Promise<void> {
  console.log("Chat API Lambda Streaming - Event:", JSON.stringify(event, null, 2));

  try {
    // Set response metadata with proper headers for SSE
    const metadata = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "X-Accel-Buffering": "no",
      },
    };

    responseStream.setContentType(metadata.headers["Content-Type"]);

    // Parse the request body
    let body: any;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      const errorData = `data: ${JSON.stringify({ error: "Invalid JSON in request body" })}\n\n`;
      responseStream.write(errorData);
      responseStream.end();
      return;
    }

    const { messages, currentMessage, mcpConfig } = body;

    // Validate input
    if (!currentMessage || typeof currentMessage !== "string") {
      const errorData = `data: ${JSON.stringify({ error: "Current message is required" })}\n\n`;
      responseStream.write(errorData);
      responseStream.end();
      return;
    }

    // Import ChatService dynamically
    const { ChatService } = await import("../../../lib/chat");

    // Initialize chat service
    const chatService = new ChatService();

    // Convert messages to ChatMessage format if needed
    const chatHistory = (messages || []).map((msg: any, index: number) => ({
      id: msg.id || `msg-${index}`,
      sender: msg.sender === "user" ? "user" : "assistant",
      content: msg.content || msg.message || "",
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      stopReason: msg.stopReason,
    }));

    console.log("Starting chat stream with config:", mcpConfig);
    console.log("Chat history length:", chatHistory.length);
    console.log("Current message:", currentMessage);

    try {
      const chatGenerator = chatService.streamChat(
        chatHistory,
        currentMessage,
        mcpConfig
      );

      for await (const chunk of chatGenerator) {
        console.log("Received chunk:", chunk);

        // Handle different chunk types from enhanced streaming
        if (typeof chunk === 'string') {
          // Legacy string chunk support
          const data = `data: ${JSON.stringify({ chunk })}\n\n`;
          responseStream.write(data);
        } else if (chunk && typeof chunk === 'object' && 'type' in chunk) {
          // Enhanced chunk with type and tool information
          const data = `data: ${JSON.stringify({ chunk })}\n\n`;
          responseStream.write(data);
        } else {
          console.log('Unknown chunk type:', chunk);
        }
      }

      // Send completion signal
      const endData = `data: ${JSON.stringify({ done: true })}\n\n`;
      responseStream.write(endData);

      console.log("Chat stream completed successfully");
    } catch (chatError) {
      console.error("Chat processing error:", chatError);
      const errorData = `data: ${JSON.stringify({
        error: chatError instanceof Error ? chatError.message : 'Unknown error occurred'
      })}\n\n`;
      responseStream.write(errorData);
    } finally {
      responseStream.end();
    }

  } catch (error) {
    console.error("Lambda streaming handler error:", error);

    try {
      const errorData = `data: ${JSON.stringify({
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"
          }`
      })}\n\n`;

      responseStream.write(errorData);
      responseStream.end();
    } catch (streamError) {
      console.error("Error writing to response stream:", streamError);
      responseStream.end();
    }
  }
}

// Export the handler wrapped with streamifyResponse
export const handler = streamifyResponse(chatStreamHandler);