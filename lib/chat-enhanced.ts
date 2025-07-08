import {
    BedrockRuntimeClient,
    InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { getMCPClient } from './mcp/railway-client';

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
        currentMessage: string,
        enableMCP: boolean = false
    ): AsyncGenerator<string, { stopReason?: string }, unknown> {
        
        if (enableMCP) {
            return yield* this.streamChatWithMCP(chatHistory, currentMessage);
        }

        // Original implementation without MCP
        let messages = this.buildConversationMessages(chatHistory, currentMessage);
        let finalStopReason: string | undefined;

        try {
            while (true) {
                const payload = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 4000,
                    messages: messages,
                };

                const command = new InvokeModelWithResponseStreamCommand({
                    contentType: "application/json",
                    body: JSON.stringify(payload),
                    modelId: "apac.anthropic.claude-sonnet-4-20250514-v1:0",
                });

                const apiResponse: any = await this.client.send(command);
                let streamedText = '';

                for await (const item of apiResponse.body) {
                    if (item.chunk?.bytes) {
                        try {
                            const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
                            const chunkType = chunk.type;

                            if (chunkType === "message_delta" && chunk.delta?.stop_reason) {
                                finalStopReason = chunk.delta.stop_reason;
                            } else if (chunkType === "content_block_delta") {
                                if (chunk.delta?.type === 'text_delta' && chunk.delta?.text) {
                                    yield chunk.delta.text;
                                    streamedText += chunk.delta.text;
                                }
                            }
                        } catch (parseError) {
                            console.error('Failed to parse chunk:', parseError);
                        }
                    }
                }

                break; // No tools, so we're done
            }
        } catch (error: any) {
            console.error('Claude Service: API error:', error);
            throw new Error(`Claude API error: ${error.message}`);
        }

        return { stopReason: finalStopReason };
    }

    async *streamChatWithMCP(
        chatHistory: ChatMessage[],
        currentMessage: string
    ): AsyncGenerator<string, { stopReason?: string }, unknown> {
        
        const mcpClient = getMCPClient();
        
        // Initialize MCP servers
        try {
            yield `🔧 Initializing MCP services...\n`;
            await mcpClient.initializeServers(['filesystem', 'web3-mcp', 'nodit']);
            yield `✅ MCP services ready\n\n`;
        } catch (error) {
            console.error('MCP initialization failed:', error);
            yield `⚠️  MCP services unavailable, continuing without tools\n\n`;
            // Continue without MCP if it fails
            return yield* this.streamChat(chatHistory, currentMessage, false);
        }

        let messages = this.buildConversationMessages(chatHistory, currentMessage);
        
        // Get available tools from MCP
        const availableTools = await this.getMCPTools(mcpClient);
        let finalStopReason: string | undefined;

        try {
            while (true) {
                const payload = {
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 4000,
                    messages: messages,
                    tools: availableTools.length > 0 ? availableTools : undefined,
                };

                const command = new InvokeModelWithResponseStreamCommand({
                    contentType: "application/json",
                    body: JSON.stringify(payload),
                    modelId: "apac.anthropic.claude-sonnet-4-20250514-v1:0",
                });

                const apiResponse: any = await this.client.send(command);

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
                                    yield `\n\n🔧 Using ${chunk.content_block.name}...\n`;
                                }
                            } else if (chunkType === "content_block_delta") {
                                if (chunk.delta?.type === 'text_delta' && chunk.delta?.text) {
                                    yield chunk.delta.text;
                                    streamedText += chunk.delta.text;
                                } else if (chunk.delta?.type === 'input_json_delta' && chunk.delta?.partial_json) {
                                    const lastTool = pendingToolUses[pendingToolUses.length - 1];
                                    if (lastTool) {
                                        lastTool.inputJson += chunk.delta.partial_json;
                                    }
                                }
                            } else if (chunkType === "content_block_stop") {
                                const lastTool = pendingToolUses[pendingToolUses.length - 1];
                                if (lastTool) {
                                    if (lastTool.inputJson.trim()) {
                                        try {
                                            lastTool.input = JSON.parse(lastTool.inputJson);
                                        } catch (parseError) {
                                            console.error('Failed to parse tool input JSON:', parseError);
                                            yield `\n❌ Tool input parsing failed\n`;
                                            lastTool.input = {};
                                        }
                                    } else {
                                        lastTool.input = {};
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

                // Build assistant message content for text
                const assistantContent: any[] = [];
                if (streamedText.trim()) {
                    assistantContent.push({
                        type: 'text',
                        text: streamedText.trim()
                    });
                }

                // Add tool use blocks
                for (const toolUse of pendingToolUses) {
                    assistantContent.push({
                        type: 'tool_use',
                        id: toolUse.id,
                        name: toolUse.name,
                        input: toolUse.input
                    });
                }

                // Add assistant message
                if (assistantContent.length > 0) {
                    messages.push({
                        role: 'assistant',
                        content: assistantContent
                    });
                }

                // Execute tools via MCP and add results
                const toolResults: any[] = [];
                for (const toolUse of pendingToolUses) {
                    try {
                        yield `\n🔄 Executing ${toolUse.name}...\n`;
                        const result = await this.executeMCPTool(mcpClient, toolUse.name, toolUse.input);
                        
                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                        });
                        
                        yield `✅ ${toolUse.name} completed\n`;
                    } catch (error) {
                        console.error(`Tool execution error for ${toolUse.name}:`, error);
                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: [{ 
                                type: 'text', 
                                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
                            }],
                            is_error: true
                        });
                        yield `❌ ${toolUse.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
                    }
                }

                // Add tool results message
                if (toolResults.length > 0) {
                    messages.push({
                        role: 'user',
                        content: toolResults
                    });
                }

                yield `\n`;
            }

        } catch (error: any) {
            console.error('Enhanced Chat Service: API error:', error);
            throw new Error(`Claude API error: ${error.message}`);
        }

        return { stopReason: finalStopReason };
    }

    private async getMCPTools(mcpClient: any): Promise<any[]> {
        try {
            return await mcpClient.getClaudeTools();
        } catch (error) {
            console.error('Error getting MCP tools:', error);
            return [];
        }
    }

    private async executeMCPTool(mcpClient: any, toolName: string, input: any): Promise<any> {
        return await mcpClient.executeClaudeTool(toolName, input);
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

        // Add current message
        messages.push({
            role: 'user',
            content: [{ type: 'text', text: currentMessage }]
        });

        return messages;
    }
}
