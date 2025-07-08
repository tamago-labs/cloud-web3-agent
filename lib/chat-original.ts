import {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";

export interface AIResponse {
    content: string;
    isComplete: boolean;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    stopReason?: string;
}

export class ChatService {

    private client: BedrockRuntimeClient;

    constructor() {
        const awsConfig = this.getAwsConfig();

        this.client = new BedrockRuntimeClient({
            region: awsConfig.awsRegion,
            credentials: {
                accessKeyId: awsConfig.awsAccessKey,
                secretAccessKey: awsConfig.awsSecretKey,
            }
        });
    }

    private getAwsConfig(): { awsAccessKey: string; awsSecretKey: string; awsRegion: string } {
        // Use environment variables in production
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            return {
                awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
                awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
                awsRegion: process.env.AWS_REGION || 'ap-southeast-1'
            };
        }

        // Fallback to hardcoded values (for backward compatibility)
        return {
            awsAccessKey: atob("QUtJQVEyWEQ2UzQzVkxHVk5VREI="),
            awsSecretKey: atob("WnJxR1gxU0pmNEdMWXF3UkROcU02eU53bkpUMFVuQTl4SHlKQlNUcg=="),
            awsRegion: 'ap-southeast-1'
        };
    }

    async *streamChat(
        chatHistory: ChatMessage[],
        currentMessage: string
    ): AsyncGenerator<string, { stopReason?: string }, unknown> {
        let messages = this.buildConversationMessages(chatHistory, currentMessage);

        let finalStopReason: string | undefined;

        try {
            // Continue streaming until no more tools are needed
            while (true) {
                // Prepare the payload for the model
                const payload = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 4000,
                    messages: messages,
                };

                // Invoke Claude with streaming
                const command = new InvokeModelWithResponseStreamCommand({
                    contentType: "application/json",
                    body: JSON.stringify(payload),
                    modelId: "apac.anthropic.claude-sonnet-4-20250514-v1:0",
                });

                const apiResponse: any = await this.client.send(command);

                let currentResponseContent: any[] = [];
                let pendingToolUses: any[] = [];
                let hasToolUse = false;
                let streamedText = '';

                // Process the response stream
                for await (const item of apiResponse.body) {
                    if (item.chunk?.bytes) {
                        try {
                            const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
                            const chunkType = chunk.type;

                            if (chunkType === "message_delta" && chunk.delta?.stop_reason) {
                                finalStopReason = chunk.delta.stop_reason;
                                console.log('claude', `Stream ended with stop_reason: ${finalStopReason}`);
                            } else if (chunkType === "content_block_start") {
                                if (chunk.content_block?.type === 'tool_use') {
                                    hasToolUse = true;
                                    pendingToolUses.push({
                                        id: chunk.content_block.id,
                                        name: chunk.content_block.name,
                                        input: {},
                                        inputJson: ''
                                    });
                                    // Show brief tool usage indicator
                                    yield `\n\n🔧 Using ${chunk.content_block.name}...\n`;
                                }
                            } else if (chunkType === "content_block_delta") {
                                if (chunk.delta?.type === 'text_delta' && chunk.delta?.text) {
                                    // Stream text content to user
                                    yield chunk.delta.text;
                                    streamedText += chunk.delta.text;
                                } else if (chunk.delta?.type === 'input_json_delta' && chunk.delta?.partial_json) {
                                    // Accumulate tool input
                                    const lastTool = pendingToolUses[pendingToolUses.length - 1];
                                    if (lastTool) {
                                        lastTool.inputJson += chunk.delta.partial_json;
                                    }
                                }
                            } else if (chunkType === "content_block_stop") {
                                // Finalize tool input - always set input even if empty
                                const lastTool = pendingToolUses[pendingToolUses.length - 1];
                                if (lastTool) {
                                    if (lastTool.inputJson.trim()) {
                                        try {
                                            lastTool.input = JSON.parse(lastTool.inputJson);
                                            console.log("Parsed tool input:", lastTool.input);
                                        } catch (parseError) {
                                            console.error('claude', `Failed to parse tool input JSON: ${parseError}`);
                                            yield `\n❌ Tool input parsing failed\n`;
                                            lastTool.input = {}; // Default to empty object
                                        }
                                    } else {
                                        // No input provided - set to empty object
                                        lastTool.input = {};
                                        console.log("Tool requires no input, set to empty object:", lastTool.name);
                                    }
                                }
                            }
                        } catch (parseError) {
                            console.error('Failed to parse chunk:', parseError);
                        }
                    }
                }

                // If no tools were used, we're done
                if (!hasToolUse || pendingToolUses.length === 0) {
                    break;
                }

                // Build assistant message content
                const assistantContent: any[] = [];

                // Add text content if we have any
                if (streamedText.trim()) {
                    assistantContent.push({
                        type: 'text',
                        text: streamedText.trim()
                    });
                }

                // Only add messages if we have content
                if (assistantContent.length > 0) {
                    messages.push({
                        role: 'assistant',
                        content: assistantContent
                    });
                }

                // Clear tool indicator and continue
                yield `\n`;
            }

        } catch (error: any) {
            console.error('Claude Service: API error:', error);
            throw new Error(`Claude API error: ${error.message}`);
        }

        return { stopReason: finalStopReason };
    }

    private buildConversationMessages(chatHistory: ChatMessage[], currentMessage: string): any[] {
        const messages: any[] = [];

        // Add previous conversation history
        for (const msg of chatHistory) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: [{ type: 'text', text: msg.content }]
            });
        }

        // Add workspace context to current message if workspace is open
        let contextualMessage = currentMessage;

        // Add current message
        messages.push({
            role: 'user',
            content: [{ type: 'text', text: contextualMessage }]
        });

        return messages;
    }


}
