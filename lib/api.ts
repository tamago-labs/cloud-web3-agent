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
