import Anthropic from '@anthropic-ai/sdk';
// import {
//     BedrockRuntimeClient,
//     InvokeModelWithResponseStreamCommand,
// } from "@aws-sdk/client-bedrock-runtime";
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
    private client: Anthropic;

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.NEXT_PUBLIC_CLAUDE_API || "",
            dangerouslyAllowBrowser: true
        });
    }

    async *streamChat(
        chatHistory: ChatMessage[],
        currentMessage: string,
        mcpConfig: any
    ): AsyncGenerator<StreamChunk, { stopReason?: string }, unknown> {

        if (mcpConfig && mcpConfig.enabledServers.length > 0) {
            return yield* this.streamChatWithMCP(chatHistory, currentMessage, mcpConfig.enabledServers);
        }

        // Original implementation without MCP using Claude SDK
        let messages = this.buildConversationMessages(chatHistory, currentMessage);
        let finalStopReason: string | undefined;

        try {
            const stream = await this.client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 4000,
                messages: messages,
                stream: true
            });

            for await (const chunk of stream) {
                if (chunk.type === 'message_delta' && chunk.delta.stop_reason) {
                    finalStopReason = chunk.delta.stop_reason;
                } else if (chunk.type === 'content_block_delta') {
                    if (chunk.delta.type === 'text_delta') {
                        yield {
                            type: 'text',
                            content: chunk.delta.text
                        };
                    }
                }
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
            // Continue streaming until no more tools are needed
            while (true) {
                const stream = await this.client.messages.create({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 4000,
                    tools: availableTools.length > 0 ? availableTools : undefined,
                    messages: messages,
                    stream: true
                });

                let currentResponseContent: any[] = [];
                let pendingToolUses: any[] = [];
                let hasToolUse = false;
                let streamedText = '';

                for await (const chunk of stream) {
                    if (chunk.type === 'message_delta' && chunk.delta.stop_reason) {
                        finalStopReason = chunk.delta.stop_reason;
                        console.log('claude', `Stream ended with stop_reason: ${finalStopReason}`);
                    } else if (chunk.type === 'content_block_start') {
                        if (chunk.content_block.type === 'tool_use') {
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
                            
                            // Show brief tool usage indicator
                            yield {
                                type: 'tool_start',
                                content: `\n\n🔧 Using ${chunk.content_block.name}...\n`,
                                toolCall: toolCall
                            };
                        }
                    } else if (chunk.type === 'content_block_delta') {
                        if (chunk.delta.type === 'text_delta') {
                            // Stream text content to user
                            yield {
                                type: 'text',
                                content: chunk.delta.text
                            };
                            streamedText += chunk.delta.text;
                        } else if (chunk.delta.type === 'input_json_delta') {
                            // Accumulate tool input
                            const lastTool = pendingToolUses[pendingToolUses.length - 1];
                            if (lastTool) {
                                lastTool.inputJson += chunk.delta.partial_json;
                            }
                        }
                    } else if (chunk.type === 'content_block_stop') {
                        // Finalize tool input - always set input even if empty
                        const lastTool = pendingToolUses[pendingToolUses.length - 1];
                        if (lastTool) {
                            if (lastTool.inputJson.trim()) {
                                try {
                                    lastTool.input = JSON.parse(lastTool.inputJson);
                                    console.log("Parsed tool input:", lastTool.input);
                                    
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
                                    console.error(`Failed to parse tool input JSON: ${parseError}`);
                                    yield {
                                        type: 'tool_error',
                                        content: `\n❌ Tool input parsing failed\n`,
                                        toolCall: activeCalls.get(lastTool.id)
                                    };
                                    lastTool.input = {}; // Default to empty object
                                }
                            } else {
                                // No input provided - set to empty object
                                lastTool.input = {};
                                console.log("Tool requires no input, set to empty object:", lastTool.name);
                            }
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

                // Execute all pending tools and add tool uses to content
                const toolResults: any[] = [];
                for (const toolUse of pendingToolUses) {
                    console.log("Processing tool use:", toolUse);

                    // Add tool use to assistant content
                    assistantContent.push({
                        type: 'tool_use',
                        id: toolUse.id,
                        name: toolUse.name,
                        input: toolUse.input || {} // Ensure we always have an object
                    });

                    const activeCall = activeCalls.get(toolUse.id);
                    
                    try {
                        if (activeCall) {
                            activeCall.status = 'running';
                            yield {
                                type: 'tool_progress',
                                content: `\n🔄 Executing ${toolUse.name}...\n`,
                                toolCall: activeCall
                            };
                        }

                        // Execute tool even if input is empty (some tools don't need parameters)
                        const executionStartTime = Date.now();
                        const result = await this.executeMCPTool(mcpClient, toolUse.name, toolUse.input || {});
                        const executionEndTime = Date.now();

                        if (activeCall) {
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

                            yield {
                                type: 'tool_complete',
                                content: `✅ ${toolUse.name} completed (${executionEndTime - executionStartTime}ms)\n`,
                                toolCall: activeCall
                            };
                        }

                        // Format result for Claude
                        let resultContent = 'Tool executed successfully';
                        if (typeof result === 'string') {
                            resultContent = result;
                        } else if (result && typeof result === 'object') {
                            if (result.content && Array.isArray(result.content)) {
                                const textContent = result.content
                                    .filter((item: any) => item.type === 'text')
                                    .map((item: any) => item.text)
                                    .join('\n');
                                resultContent = textContent || JSON.stringify(result, null, 2);
                            } else {
                                resultContent = JSON.stringify(result, null, 2);
                            }
                        }

                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: resultContent
                        });

                        console.log(`Tool executed successfully: ${toolUse.name}`);
                    } catch (toolError: any) {
                        console.log("Tool execution error:", toolError);
                        
                        if (activeCall) {
                            activeCall.status = 'error';
                            activeCall.error = toolError.message;
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

                            yield {
                                type: 'tool_error',
                                content: `❌ ${toolUse.name} failed: ${toolError.message}\n`,
                                toolCall: activeCall
                            };
                        }

                        toolResults.push({
                            type: 'tool_result',
                            tool_use_id: toolUse.id,
                            content: `Error: ${toolError.message}`,
                            is_error: true
                        });
                    }
                }

                // Only add messages if we have content
                if (assistantContent.length > 0) {
                    messages.push({
                        role: 'assistant',
                        content: assistantContent
                    });
                }

                if (toolResults.length > 0) {
                    messages.push({
                        role: 'user',
                        content: toolResults
                    });
                } else {
                    // If no tool results, break to avoid infinite loop
                    break;
                }

                // Clear tool indicator and continue
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
                content: msg.content
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: currentMessage
        });

        // Claude API has limits, so keep only recent messages if too many
        const MAX_MESSAGES = 25;
        if (messages.length > MAX_MESSAGES) {
            return messages.slice(-MAX_MESSAGES);
        }

        return messages;
    }
 
}