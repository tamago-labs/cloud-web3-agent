import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// User Profile API functions
export const userProfileAPI = {
    // Get user profile by ID  
    async getProfile(username: string) {
        try {

            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            let entry

            const user = await client.models.User.list({
                filter: {
                    username: {
                        eq: username
                    }
                }
            })

            if (user.data.length === 0) {
                const data = this.createProfile({
                    username,
                    displayName: "New User",
                    credits: 25,
                    creditsUsed: 0,
                    totalCredits: 25
                })

                entry = data
            } else {
                entry = user.data[0]
            }
            return entry
        } catch (error) {
            console.log(error)
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    // Update user profile  
    async updateProfile(userId: string, profileData: {
        displayName?: string;
    }) {
        try {

            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const response = await client.models.User.update({
                id: userId,
                ...profileData
            });
            const { data: updatedProfile } = response
            return updatedProfile;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },
    // Create user profile  
    async createProfile(profileData: {
        username: string;
        displayName?: string;
        credits?: number;
        creditsUsed?: number;
        totalCredits?: number;
    }) {
        try {

            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: newProfile } = await client.models.User.create(profileData);
            return newProfile;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }
};

// Conversation API functions
export const conversationAPI = {
    // Get all conversations for a user
    async getUserConversations(userId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: conversations } = await client.models.Conversation.list({
                filter: {
                    userId: {
                        eq: userId
                    }
                }
            });

            // Sort by creation date (newest first)
            return conversations.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },

    // Create new conversation
    async createConversation(userId: string, title: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: newConversation } = await client.models.Conversation.create({
                userId,
                title
            });
            return newConversation;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    },

    // Get conversation with messages
    async getConversationWithMessages(conversationId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            // Get conversation
            const { data: conversation } = await client.models.Conversation.get({
                id: conversationId
            });

            if (!conversation) {
                throw new Error('Conversation not found');
            }

            // Get messages for this conversation
            const { data: messages } = await client.models.Message.list({
                filter: {
                    conversationId: {
                        eq: conversationId
                    }
                }
            });

            // Get tool results for all messages
            const messagesWithToolResults = await Promise.all(
                messages.map(async (message) => {
                    const { data: toolResults } = await client.models.ToolResult.list({
                        filter: {
                            messageId: {
                                eq: message.id
                            }
                        }
                    });

                    return {
                        ...message,
                        toolResults: toolResults.sort((a, b) =>
                            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                        )
                    };
                })
            );

            // Sort messages by position (chronological order)
            const sortedMessages = messagesWithToolResults.sort((a, b) =>
                (a.position || 0) - (b.position || 0)
            );

            return {
                conversation,
                messages: sortedMessages
            };
        } catch (error) {
            console.error('Error fetching conversation with messages:', error);
            throw error;
        }
    },

    // Update conversation title
    async updateConversationTitle(conversationId: string, title: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: updatedConversation } = await client.models.Conversation.update({
                id: conversationId,
                title
            });
            return updatedConversation;
        } catch (error) {
            console.error('Error updating conversation title:', error);
            throw error;
        }
    },

    // Delete conversation and all its messages and tool results
    async deleteConversation(conversationId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            // First get all messages in the conversation
            const { data: messages } = await client.models.Message.list({
                filter: {
                    conversationId: {
                        eq: conversationId
                    }
                }
            });

            // Delete all tool results for all messages
            for (const message of messages) {
                const { data: toolResults } = await client.models.ToolResult.list({
                    filter: {
                        messageId: {
                            eq: message.id
                        }
                    }
                });

                // Delete each tool result
                for (const toolResult of toolResults) {
                    await client.models.ToolResult.delete({ id: toolResult.id });
                }

                // Delete the message
                await client.models.Message.delete({ id: message.id });
            }

            // Then delete the conversation
            const { data: deletedConversation } = await client.models.Conversation.delete({
                id: conversationId
            });

            return deletedConversation;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }
};

// Message API functions
export const messageAPI = {
    // Create new message
    async createMessage(messageData: {
        conversationId: string;
        messageId: string;
        sender: string;
        content: string;
        timestamp: string;
        position: number;
        stopReason?: string;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: newMessage } = await client.models.Message.create(messageData);
            return newMessage;
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    },

    // Get messages for a conversation with tool results
    async getConversationMessages(conversationId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: messages } = await client.models.Message.list({
                filter: {
                    conversationId: {
                        eq: conversationId
                    }
                }
            });

            // Get tool results for each message
            const messagesWithToolResults = await Promise.all(
                messages.map(async (message) => {
                    const { data: toolResults } = await client.models.ToolResult.list({
                        filter: {
                            messageId: {
                                eq: message.id
                            }
                        }
                    });

                    return {
                        ...message,
                        toolResults: toolResults.sort((a, b) =>
                            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                        )
                    };
                })
            );

            // Sort by position (chronological order)
            return messagesWithToolResults.sort((a, b) =>
                (a.position || 0) - (b.position || 0)
            );
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    async updateMessage(messageId: string, updateData: {
        content?: string;
        stopReason?: string;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: updatedMessage } = await client.models.Message.update({
                id: messageId,
                ...updateData
            });
            return updatedMessage;
        } catch (error) {
            console.error('Error updating message:', error);
            throw error;
        }
    },

    // Delete a specific message and its tool results
    async deleteMessage(messageId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            // First delete all tool results for this message
            const { data: toolResults } = await client.models.ToolResult.list({
                filter: {
                    messageId: {
                        eq: messageId
                    }
                }
            });

            // Delete each tool result
            for (const toolResult of toolResults) {
                await client.models.ToolResult.delete({ id: toolResult.id });
            }

            // Then delete the message
            const { data: deletedMessage } = await client.models.Message.delete({
                id: messageId
            });

            return deletedMessage;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
};

// ToolResult API functions
export const toolResultAPI = {

    // Create new tool result
    async createToolResult(toolResultData: {
        messageId: string;
        toolId: string;
        toolName: string;
        serverName?: string;
        status: 'pending' | 'running' | 'completed' | 'error';
        input?: any;
        output?: any;
        error?: string;
        duration?: number;
        metadata?: any;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: newToolResult } = await client.models.ToolResult.create(toolResultData);
            return newToolResult;
        } catch (error) {
            console.error('Error creating tool result:', error);
            throw error;
        }
    },

    // Update tool result (for status changes, adding output, etc.)
    async updateToolResult(toolResultId: string, updateData: {
        status?: 'pending' | 'running' | 'completed' | 'error';
        input?: any;
        output?: any;
        error?: string;
        duration?: number;
        metadata?: any;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: updatedToolResult } = await client.models.ToolResult.update({
                id: toolResultId,
                ...updateData
            });
            return updatedToolResult;
        } catch (error) {
            console.error('Error updating tool result:', error);
            throw error;
        }
    },

    // Get tool results for a specific message
    async getMessageToolResults(messageId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: toolResults } = await client.models.ToolResult.list({
                filter: {
                    messageId: {
                        eq: messageId
                    }
                }
            });

            // Sort by start time (chronological order)
            return toolResults.sort((a, b) =>
                new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        } catch (error) {
            console.error('Error fetching tool results:', error);
            throw error;
        }
    },

    // Get a specific tool result
    async getToolResult(toolResultId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: toolResult } = await client.models.ToolResult.get({
                id: toolResultId
            });
            return toolResult;
        } catch (error) {
            console.error('Error fetching tool result:', error);
            throw error;
        }
    },

    // Delete a tool result
    async deleteToolResult(toolResultId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: deletedToolResult } = await client.models.ToolResult.delete({
                id: toolResultId
            });
            return deletedToolResult;
        } catch (error) {
            console.error('Error deleting tool result:', error);
            throw error;
        }
    },
};

// Server API functions
export const serverAPI = {
    // Get all servers
    async getAllServers(isLoggedIn: boolean) {
        try {

            const client = generateClient<Schema>({
                authMode: isLoggedIn ? "userPool" : "iam"
            });

            const { data: servers } = await client.models.Servers.list();
            return servers;
        } catch (error) {
            console.error('Error fetching all servers:', error);
            throw error;
        }
    },

    // Get specific server
    async getServer(isLoggedIn: boolean, id: string) {
        try {

            const client = generateClient<Schema>({
                authMode: isLoggedIn ? "userPool" : "iam"
            });

            const { data: server } = await client.models.Servers.get({
                id
            });
            return server;
        } catch (error) {
            console.error('Error fetching server:', error);
            throw error;
        }
    }

}


// Simplified pricing configuration
const PRICING = {
    // AI Model pricing (per 1M tokens)
    ai: {
        'claude-sonnet-4': {
            input: 3.00,   // $3.00 per 1M input tokens
            output: 15.00  // $15.00 per 1M output tokens
        }
    },
    // Unified tool pricing
    tool: {
        base: 0.001  // $0.001 per tool execution (regardless of which tool)
    },
    // Base conversation cost
    conversation: {
        base: 0.01  // $0.01 per conversation
    }
};

// Credit/Usage tracking API
export const creditAPI = {
    // Calculate cost for AI usage
    calculateAICost(model: string, inputTokens: number, outputTokens: number): number {
        const modelPricing = PRICING.ai[model as keyof typeof PRICING.ai] || PRICING.ai['claude-sonnet-4'];

        const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
        const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

        return inputCost + outputCost;
    },

    // Calculate cost for tool usage (unified pricing)
    calculateToolCost(executionCount: number = 1): number {
        return PRICING.tool.base * executionCount;
    },

    // Estimate tokens from text (rough approximation)
    estimateTokens(text: string): number {
        // Rough estimation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    },

    // Create usage log and deduct credits
    async logUsageAndDeductCredits(usageData: {
        userId: string;
        serverId?: string;
        conversationId?: string;
        messageId?: string;
        type: 'ai' | 'tool' | 'conversation';
        model?: string;
        toolName?: string;
        inputTokens?: number;
        outputTokens?: number;
        executionTime?: number;
        success?: boolean;
        metadata?: any;
    }): Promise<{ success: boolean; cost: number; remainingCredits: number; error?: string }> {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            // Calculate cost based on usage type
            let cost = 0;
            let tokensUsed = 0;

            switch (usageData.type) {
                case 'ai':
                    if (usageData.model && usageData.inputTokens && usageData.outputTokens) {
                        cost = this.calculateAICost(usageData.model, usageData.inputTokens, usageData.outputTokens);
                        tokensUsed = usageData.inputTokens + usageData.outputTokens;
                    }
                    break;

                case 'tool':
                    cost = this.calculateToolCost(1); // Unified tool cost
                    tokensUsed = 1; // 1 execution
                    break;

                case 'conversation':
                    cost = PRICING.conversation.base;
                    tokensUsed = 1;
                    break;
            }

            // Get current user profile
            const { data: user } = await client.models.User.get({ id: usageData.userId });
            if (!user) {
                throw new Error('User not found');
            }

            const currentCredits = user.credits || 0;
            const currentUsed = user.creditsUsed || 0;

            // Check if user has enough credits
            if (currentCredits < cost) {
                return {
                    success: false,
                    cost,
                    remainingCredits: currentCredits,
                    error: 'Insufficient credits'
                };
            }

            // Create usage log
            await client.models.UsageLogs.create({
                userId: usageData.userId,
                serverId: usageData.serverId || 'ai-service',
                tokensUsed: Math.round(tokensUsed),
                cpuMs: usageData.executionTime || 0,
                success: usageData.success ?? true
            });

            // Update user credits
            const newCredits = currentCredits - cost;
            const newUsed = currentUsed + cost;

            await client.models.User.update({
                id: usageData.userId,
                credits: newCredits,
                creditsUsed: newUsed
            });

            return {
                success: true,
                cost,
                remainingCredits: newCredits
            };

        } catch (error) {
            console.error('Error logging usage and deducting credits:', error);
            return {
                success: false,
                cost: 0,
                remainingCredits: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    // Get user's credit information
    async getUserCredits(userId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: user } = await client.models.User.get({ id: userId });
            if (!user) {
                throw new Error('User not found');
            }

            return {
                current: user.credits || 0,
                used: user.creditsUsed || 0,
                total: user.totalCredits || 0,
                remaining: (user.credits || 0)
            };
        } catch (error) {
            console.error('Error fetching user credits:', error);
            throw error;
        }
    },

    // Add credits to user account
    async addCredits(userId: string, amount: number) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: user } = await client.models.User.get({ id: userId });
            if (!user) {
                throw new Error('User not found');
            }

            const newCredits = (user.credits || 0) + amount;
            const newTotal = (user.totalCredits || 0) + amount;

            await client.models.User.update({
                id: userId,
                credits: newCredits,
                totalCredits: newTotal
            });

            return {
                success: true,
                newBalance: newCredits,
                totalCredits: newTotal
            };
        } catch (error) {
            console.error('Error adding credits:', error);
            throw error;
        }
    },

    // Get usage statistics
    async getUsageStats(userId: string, timeframe: 'day' | 'week' | 'month' = 'month') {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            // Calculate date range
            const now = new Date();
            const startDate = new Date();

            switch (timeframe) {
                case 'day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
            }

            const { data: usageLogs } = await client.models.UsageLogs.list({
                filter: {
                    userId: { eq: userId },
                    createdAt: { ge: startDate.toISOString() }
                }
            });

            // Aggregate statistics
            const stats = {
                totalExecutions: usageLogs.length,
                totalTokens: usageLogs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
                totalCpuMs: usageLogs.reduce((sum, log) => sum + (log.cpuMs || 0), 0),
                successRate: usageLogs.length > 0 ?
                    (usageLogs.filter(log => log.success).length / usageLogs.length) * 100 : 0,
                byDay: this.groupByDay(usageLogs),
                timeframe
            };

            return stats;
        } catch (error) {
            console.error('Error fetching usage stats:', error);
            throw error;
        }
    },

    // Helper to group usage by day
    groupByDay(usageLogs: any[]) {
        const byDay: Record<string, { executions: number; tokens: number; cpuMs: number }> = {};

        usageLogs.forEach(log => {
            const day = new Date(log.createdAt).toISOString().split('T')[0];
            if (!byDay[day]) {
                byDay[day] = { executions: 0, tokens: 0, cpuMs: 0 };
            }
            byDay[day].executions++;
            byDay[day].tokens += log.tokensUsed || 0;
            byDay[day].cpuMs += log.cpuMs || 0;
        });

        return byDay;
    }
};

// Enhanced message API with credit tracking
export const enhancedMessageAPI = {
    ...messageAPI, // Include existing message API functions

    // Create message with credit tracking for AI usage
    async createMessageWithCredits(messageData: {
        conversationId: string;
        messageId: string;
        sender: string;
        content: string;
        timestamp: string;
        position: number;
        stopReason?: string;
        userId: string;
        model?: string;
        inputTokens?: number;
        outputTokens?: number;
    }) {
        try {
            // Create the message first
            const message = await messageAPI.createMessage(messageData);

            // Track AI usage if it's an assistant message
            if (messageData.sender === 'assistant' && messageData.model) {
                const inputTokens = messageData.inputTokens || creditAPI.estimateTokens(messageData.content);
                const outputTokens = messageData.outputTokens || creditAPI.estimateTokens(messageData.content);

                await creditAPI.logUsageAndDeductCredits({
                    userId: messageData.userId,
                    conversationId: messageData.conversationId,
                    messageId: message?.id,
                    type: 'ai',
                    model: messageData.model,
                    inputTokens,
                    outputTokens,
                    success: true
                });
            }

            return message;
        } catch (error) {
            console.error('Error creating message with credits:', error);
            throw error;
        }
    }
};

// Enhanced tool result API with credit tracking
export const enhancedToolResultAPI = {
    ...toolResultAPI, // Include existing tool result API functions

    // Create tool result with credit tracking
    async createToolResultWithCredits(toolResultData: {
        messageId: string;
        toolId: string;
        toolName: string;
        serverName?: string;
        status: 'pending' | 'running' | 'completed' | 'error';
        input?: any;
        output?: any;
        error?: string;
        duration?: number;
        metadata?: any;
        userId: string;
        conversationId?: string;
    }) {
        try {
            // Create the tool result first
            const toolResult = await toolResultAPI.createToolResult(toolResultData);

            // Track tool usage and deduct credits when tool starts
            if (toolResultData.status === 'pending') {
                await creditAPI.logUsageAndDeductCredits({
                    userId: toolResultData.userId,
                    serverId: toolResultData.serverName,
                    conversationId: toolResultData.conversationId,
                    messageId: toolResultData.messageId,
                    type: 'tool',
                    toolName: toolResultData.toolName,
                    executionTime: toolResultData.duration,
                    success: false
                });
            }

            return toolResult;
        } catch (error) {
            console.error('Error creating tool result with credits:', error);
            throw error;
        }
    }
};

// Artifact API functions
export const artifactAPI = {
    // Create new artifact
    async createArtifact(artifactData: {
        userId: string;
        conversationId?: string;
        messageId?: string;
        title: string;
        description?: string;
        chartType: 'pie' | 'bar' | 'line' | 'area' | 'donut' | 'horizontal_bar';
        data: any; // Chart data points
        totalValue?: string;
        change?: string;
        category?: string;
        tags?: string[];
        isPublic?: boolean;
        sourceData?: any;
        metadata?: any;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: newArtifact } = await client.models.Artifact.create({
                ...artifactData,
                data: JSON.stringify(artifactData.data),
                sourceData: artifactData.sourceData ? JSON.stringify(artifactData.sourceData) : undefined,
                metadata: artifactData.metadata ? JSON.stringify(artifactData.metadata) : undefined,
                likes: 0,
                views: 0,
                isPublic: artifactData.isPublic || false
            } as any);
            return newArtifact;
        } catch (error) {
            console.error('Error creating artifact:', error);
            throw error;
        }
    },

    // Get user's artifacts
    async getUserArtifacts(userId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: artifacts }: any = await client.models.Artifact.list({
                filter: {
                    userId: {
                        eq: userId
                    }
                }
            });

            // Sort by creation date (newest first)
            return artifacts.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map((artifact: any) => ({
                ...artifact,
                data: artifact.data ? JSON.parse(artifact.data) : [],
                sourceData: artifact.sourceData ? JSON.parse(artifact.sourceData) : null,
                metadata: artifact.metadata ? JSON.parse(artifact.metadata) : null
            }));
        } catch (error) {
            console.error('Error fetching user artifacts:', error);
            throw error;
        }
    },

    // Get public artifacts for discover page
    async getPublicArtifacts(isLoggedIn: boolean, filters?: {
        category?: string;
        searchQuery?: string;
        sortBy?: 'popular' | 'recent' | 'liked';
        limit?: number;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: isLoggedIn ? "userPool" : "iam"
            });

            let filterCondition: any = {
                isPublic: {
                    eq: true
                }
            };

            // Add category filter
            if (filters?.category && filters.category !== 'All') {
                filterCondition.category = {
                    eq: filters.category
                };
            }

            const { data: artifacts } = await client.models.Artifact.list({
                filter: filterCondition
            });

            let filteredArtifacts = artifacts.map((artifact: any) => ({
                ...artifact,
                data: artifact.data ? JSON.parse(artifact.data) : [],
                sourceData: artifact.sourceData ? JSON.parse(artifact.sourceData) : null,
                metadata: artifact.metadata ? JSON.parse(artifact.metadata) : null
            }));

            // Apply search filter
            if (filters?.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filteredArtifacts = filteredArtifacts.filter(artifact =>
                    artifact.title?.toLowerCase().includes(query) ||
                    artifact.description?.toLowerCase().includes(query) ||
                    artifact.tags?.some((tag: string) => tag.toLowerCase().includes(query))
                );
            }

            // Apply sorting
            switch (filters?.sortBy) {
                case 'popular':
                    filteredArtifacts.sort((a, b) => (b.views || 0) - (a.views || 0));
                    break;
                case 'liked':
                    filteredArtifacts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                    break;
                case 'recent':
                default:
                    filteredArtifacts.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    break;
            }

            // Apply limit
            if (filters?.limit) {
                filteredArtifacts = filteredArtifacts.slice(0, filters.limit);
            }

            return filteredArtifacts;
        } catch (error) {
            console.error('Error fetching public artifacts:', error);
            throw error;
        }
    },

    // Get specific artifact by ID
    async getArtifact(artifactId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: artifact }: any = await client.models.Artifact.get({
                id: artifactId
            });

            if (!artifact) {
                throw new Error('Artifact not found');
            }

            return {
                ...artifact,
                data: artifact.data ? JSON.parse(artifact.data) : [],
                sourceData: artifact.sourceData ? JSON.parse(artifact.sourceData) : null,
                metadata: artifact.metadata ? JSON.parse(artifact.metadata) : null
            };
        } catch (error) {
            console.error('Error fetching artifact:', error);
            throw error;
        }
    },

    // Update artifact
    async updateArtifact(artifactId: string, updateData: {
        title?: string;
        description?: string;
        chartType?: 'pie' | 'bar' | 'line' | 'area' | 'donut' | 'horizontal_bar';
        data?: any;
        totalValue?: string;
        change?: string;
        category?: string;
        tags?: string[];
        isPublic?: boolean;
        metadata?: any;
    }) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const processedData: any = { ...updateData };

            // Stringify JSON fields
            if (updateData.data) {
                processedData.data = JSON.stringify(updateData.data);
            }
            if (updateData.metadata) {
                processedData.metadata = JSON.stringify(updateData.metadata);
            }

            const { data: updatedArtifact } = await client.models.Artifact.update({
                id: artifactId,
                ...processedData
            });
            return updatedArtifact;
        } catch (error) {
            console.error('Error updating artifact:', error);
            throw error;
        }
    },

    // Delete artifact
    async deleteArtifact(artifactId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: "userPool"
            });

            const { data: deletedArtifact } = await client.models.Artifact.delete({
                id: artifactId
            });
            return deletedArtifact;
        } catch (error) {
            console.error('Error deleting artifact:', error);
            throw error;
        }
    },

    // Increment artifact views
    // async incrementViews(artifactId: string) {
    //     try {
    //         const client = generateClient<Schema>({
    //             authMode: "userPool"
    //         });

    //         // Get current artifact
    //         const { data: artifact } = await client.models.Artifact.get({
    //             id: artifactId
    //         });

    //         if (!artifact) {
    //             throw new Error('Artifact not found');
    //         }

    //         // Increment views
    //         const { data: updatedArtifact } = await client.models.Artifact.update({
    //             id: artifactId,
    //             views: (artifact.views || 0) + 1
    //         });

    //         return updatedArtifact;
    //     } catch (error) {
    //         console.error('Error incrementing artifact views:', error);
    //         throw error;
    //     }
    // },

    // Toggle artifact like
    // async toggleLike(artifactId: string, increment: boolean = true) {
    //     try {
    //         const client = generateClient<Schema>({
    //             authMode: "userPool"
    //         });

    //         // Get current artifact
    //         const { data: artifact } = await client.models.Artifact.get({
    //             id: artifactId
    //         });

    //         if (!artifact) {
    //             throw new Error('Artifact not found');
    //         }

    //         // Update likes
    //         const currentLikes = artifact.likes || 0;
    //         const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    //         const { data: updatedArtifact } = await client.models.Artifact.update({
    //             id: artifactId,
    //             likes: newLikes
    //         });

    //         return updatedArtifact;
    //     } catch (error) {
    //         console.error('Error toggling artifact like:', error);
    //         throw error;
    //     }
    // },

    // Get artifacts for a specific message
    async getMessageArtifacts(isLoggedIn: boolean, messageId: string) {
        try {
            const client = generateClient<Schema>({
                authMode: isLoggedIn ? "userPool" : "iam"
            });

            const { data: artifacts } = await client.models.Artifact.list({
                filter: {
                    messageId: {
                        eq: messageId
                    }
                }
            });

            return artifacts.map((artifact: any) => ({
                ...artifact,
                data: artifact.data ? JSON.parse(artifact.data) : [],
                sourceData: artifact.sourceData ? JSON.parse(artifact.sourceData) : null,
                metadata: artifact.metadata ? JSON.parse(artifact.metadata) : null
            }));
        } catch (error) {
            console.error('Error fetching message artifacts:', error);
            throw error;
        }
    },

    // Get artifact categories for filtering
    // async getArtifactCategories() {
    //     try {
    //         const client = generateClient<Schema>({
    //             authMode: "userPool"
    //         });

    //         const { data: artifacts } = await client.models.Artifact.list({
    //             filter: {
    //                 isPublic: {
    //                     eq: true
    //                 }
    //             }
    //         });

    //         // Extract unique categories
    //         const categories = Array.from(new Set(
    //             artifacts
    //                 .map(artifact => artifact.category)
    //                 .filter(category => category && category.trim())
    //         )).sort();

    //         return ['All', ...categories];
    //     } catch (error) {
    //         console.error('Error fetching artifact categories:', error);
    //         return ['All'];
    //     }
    // },

    // // Search artifacts with advanced filters
    // async searchArtifacts(searchParams: {
    //     query?: string;
    //     category?: string;
    //     chartType?: string;
    //     tags?: string[];
    //     userId?: string;
    //     isPublic?: boolean;
    //     sortBy?: 'popular' | 'recent' | 'liked';
    //     limit?: number;
    //     offset?: number;
    // }) {
    //     try {
    //         const client = generateClient<Schema>({
    //             authMode: "userPool"
    //         });

    //         let filterCondition: any = {};

    //         // Add filters
    //         if (searchParams.userId) {
    //             filterCondition.userId = { eq: searchParams.userId };
    //         }
    //         if (searchParams.isPublic !== undefined) {
    //             filterCondition.isPublic = { eq: searchParams.isPublic };
    //         }
    //         if (searchParams.category && searchParams.category !== 'All') {
    //             filterCondition.category = { eq: searchParams.category };
    //         }
    //         if (searchParams.chartType) {
    //             filterCondition.chartType = { eq: searchParams.chartType };
    //         }

    //         const { data: artifacts } = await client.models.Artifact.list({
    //             filter: Object.keys(filterCondition).length > 0 ? filterCondition : undefined
    //         });

    //         let results = artifacts.map((artifact: any) => ({
    //             ...artifact,
    //             data: artifact.data ? JSON.parse(artifact.data) : [],
    //             sourceData: artifact.sourceData ? JSON.parse(artifact.sourceData) : null,
    //             metadata: artifact.metadata ? JSON.parse(artifact.metadata) : null
    //         }));

    //         // Apply text search
    //         if (searchParams.query) {
    //             const query = searchParams.query.toLowerCase();
    //             results = results.filter(artifact =>
    //                 artifact.title?.toLowerCase().includes(query) ||
    //                 artifact.description?.toLowerCase().includes(query) ||
    //                 artifact.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    //             );
    //         }

    //         // Apply tag filter
    //         if (searchParams.tags && searchParams.tags.length > 0) {
    //             results = results.filter(artifact =>
    //                 searchParams.tags!.some(tag =>
    //                     artifact.tags?.includes(tag)
    //                 )
    //             );
    //         }

    //         // Apply sorting
    //         switch (searchParams.sortBy) {
    //             case 'popular':
    //                 results.sort((a, b) => (b.views || 0) - (a.views || 0));
    //                 break;
    //             case 'liked':
    //                 results.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    //                 break;
    //             case 'recent':
    //             default:
    //                 results.sort((a, b) =>
    //                     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //                 );
    //                 break;
    //         }

    //         // Apply pagination
    //         const offset = searchParams.offset || 0;
    //         const limit = searchParams.limit || 50;
    //         const paginatedResults = results.slice(offset, offset + limit);

    //         return {
    //             artifacts: paginatedResults,
    //             total: results.length,
    //             hasMore: offset + limit < results.length
    //         };
    //     } catch (error) {
    //         console.error('Error searching artifacts:', error);
    //         throw error;
    //     }
    // }
};