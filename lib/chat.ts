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

interface ToolCall {
    id: string;
    name: string;
    input: any;
    status: 'pending' | 'running' | 'completed' | 'error';
    output?: any;
    error?: string;
    startTime?: number;
    endTime?: number;
}

interface StreamChunk {
    type: 'text' | 'tool_start' | 'tool_progress' | 'tool_complete' | 'tool_error' | 'tool_result';
    content: string;
    toolCall?: ToolCall;
    toolResult?: {
        toolId: string;
        input: any;
        output?: any;
        error?: string;
        duration?: number;
    };
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
        return {
            awsAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
            awsSecretKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
            awsRegion: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-1'
        };
    }

    async *streamChat(
        chatHistory: ChatMessage[],
        currentMessage: string,
        mcpConfig: any
    ): AsyncGenerator<StreamChunk, { stopReason?: string }, unknown> {

        if (mcpConfig && mcpConfig.enabledServers.length > 0) {
            return yield* this.streamChatWithMCP(chatHistory, currentMessage, mcpConfig.enabledServers);
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

                for await (const item of apiResponse.body) {
                    if (item.chunk?.bytes) {
                        try {
                            const chunk = JSON.parse(new TextDecoder().decode(item.chunk.bytes));
                            const chunkType = chunk.type;

                            if (chunkType === "message_delta" && chunk.delta?.stop_reason) {
                                finalStopReason = chunk.delta.stop_reason;
                            } else if (chunkType === "content_block_delta") {
                                if (chunk.delta?.type === 'text_delta' && chunk.delta?.text) {
                                    yield {
                                        type: 'text',
                                        content: chunk.delta.text
                                    };
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
        currentMessage: string,
        enabledServers: string[]
    ): AsyncGenerator<StreamChunk, { stopReason?: string }, unknown> {

        const mcpClient = getMCPClient();
        const activeCalls = new Map<string, ToolCall>();

        // Initialize MCP servers
        try {
            yield {
                type: 'text',
                content: `🔧 Initializing MCP services: ${enabledServers.join(', ')}...\n`
            };
            await mcpClient.initializeServers(enabledServers);
            yield {
                type: 'text',
                content: `✅ MCP services ready\n\n`
            };
        } catch (error) {
            console.error('MCP initialization failed:', error);
            yield {
                type: 'text',
                content: `⚠️  MCP services unavailable, continuing without tools\n\n`
            };
            // Continue without MCP if it fails
            return yield* this.streamChat(chatHistory, currentMessage, false);
        }

        let messages = this.buildConversationMessages(chatHistory, currentMessage);

        // Get available tools from ONLY the enabled servers
        const availableTools = await this.getMCPToolsForServers(mcpClient, enabledServers);
        
        console.log(`[Chat Enhanced] Enabled servers: ${enabledServers.join(', ')}`);
        console.log(`[Chat Enhanced] Available tools: ${availableTools.length} tools from enabled servers`);
        
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
                                    const toolCall: ToolCall = {
                                        id: chunk.content_block.id,
                                        name: chunk.content_block.name,
                                        input: {},
                                        status: 'pending',
                                        startTime: Date.now()
                                    };
                                    
                                    pendingToolUses.push({
                                        id: chunk.content_block.id,
                                        name: chunk.content_block.name,
                                        input: {},
                                        inputJson: ''
                                    });
                                    
                                    activeCalls.set(toolCall.id, toolCall);
                                    
                                    yield {
                                        type: 'tool_start',
                                        content: `\n\n🔧 Using ${chunk.content_block.name}...\n`,
                                        toolCall: toolCall
                                    };
                                }
                            } else if (chunkType === "content_block_delta") {
                                if (chunk.delta?.type === 'text_delta' && chunk.delta?.text) {
                                    yield {
                                        type: 'text',
                                        content: chunk.delta.text
                                    };
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
                                            
                                            // Update the active call with parsed input
                                            const activeCall = activeCalls.get(lastTool.id);
                                            if (activeCall) {
                                                activeCall.input = lastTool.input;
                                                activeCall.status = 'running';

                                                // Emit tool input captured event
                                                yield {
                                                    type: 'tool_result',
                                                    content: '',
                                                    toolResult: {
                                                        toolId: lastTool.id,
                                                        input: lastTool.input
                                                    }
                                                };
                                            }
                                        } catch (parseError) {
                                            console.error('Failed to parse tool input JSON:', parseError);
                                            yield {
                                                type: 'tool_error',
                                                content: `\n❌ Tool input parsing failed\n`,
                                                toolCall: activeCalls.get(lastTool.id)
                                            };
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
                    const activeCall = activeCalls.get(toolUse.id);
                    if (!activeCall) continue;

                    try {
                        activeCall.status = 'running';
                        yield {
                            type: 'tool_progress',
                            content: `\n🔄 Executing ${toolUse.name}...\n`,
                            toolCall: activeCall
                        };

                        // Execute the tool and capture the full result
                        const executionStartTime = Date.now();
                        const result = await this.executeMCPTool(mcpClient, toolUse.name, toolUse.input);
                        const executionEndTime = Date.now();

                        activeCall.status = 'completed';
                        activeCall.output = result;
                        activeCall.endTime = executionEndTime;

                        // Emit detailed tool result
                        yield {
                            type: 'tool_result',
                            content: '',
                            toolResult: {
                                toolId: toolUse.id,
                                input: toolUse.input,
                                output: result,
                                duration: executionEndTime - executionStartTime
                            }
                        };

                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                        });

                        yield {
                            type: 'tool_complete',
                            content: `✅ ${toolUse.name} completed (${executionEndTime - executionStartTime}ms)\n`,
                            toolCall: activeCall
                        };
                    } catch (error) {
                        console.error(`Tool execution error for ${toolUse.name}:`, error);
                        
                        if (activeCall) {
                            activeCall.status = 'error';
                            activeCall.error = error instanceof Error ? error.message : 'Unknown error';
                            activeCall.endTime = Date.now();

                            // Emit tool error result
                            yield {
                                type: 'tool_result',
                                content: '',
                                toolResult: {
                                    toolId: toolUse.id,
                                    input: toolUse.input,
                                    error: activeCall.error,
                                    duration: activeCall.endTime - (activeCall.startTime || Date.now())
                                }
                            };
                        }

                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: [{
                                type: 'text',
                                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                            }],
                            is_error: true
                        });

                        yield {
                            type: 'tool_error',
                            content: `❌ ${toolUse.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
                            toolCall: activeCall
                        };
                    }
                }

                // Add tool results message
                if (toolResults.length > 0) {
                    messages.push({
                        role: 'user',
                        content: toolResults
                    });
                }

                yield {
                    type: 'text',
                    content: `\n`
                };
            }

        } catch (error: any) {
            console.error('Enhanced Chat Service: API error:', error);
            throw new Error(`Claude API error: ${error.message}`);
        }

        return { stopReason: finalStopReason };
    }

    // NEW: Get tools filtered by enabled servers only
    private async getMCPToolsForServers(mcpClient: any, enabledServers: string[]): Promise<any[]> {
        try {
            // Get all tools from all servers
            const allTools = await mcpClient.listTools();
            const filteredTools: any[] = [];

            console.log(`[Chat Enhanced] Filtering tools for servers: ${enabledServers.join(', ')}`);
            console.log(`[Chat Enhanced] Available server tools:`, Object.keys(allTools));

            // Only include tools from enabled servers
            for (const serverName of enabledServers) {
                const serverTools = allTools[serverName] || [];
                console.log(`[Chat Enhanced] Server ${serverName}: ${serverTools.length} tools`);
                
                for (const tool of serverTools) {
                    filteredTools.push({
                        name: `${serverName}__${tool.name}`,
                        description: `${tool.description} (via ${serverName})`,
                        input_schema: tool.inputSchema || { 
                            type: 'object', 
                            properties: {},
                            required: []
                        }
                    });
                }
            }

            console.log(`[Chat Enhanced] Total filtered tools: ${filteredTools.length}`);
            return filteredTools;
        } catch (error) {
            console.error('Error getting filtered MCP tools:', error);
            return [];
        }
    }

    // DEPRECATED: This gets ALL tools, use getMCPToolsForServers instead
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