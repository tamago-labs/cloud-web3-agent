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

            // Sort messages by position (chronological order)
            const sortedMessages = messages.sort((a, b) => 
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

    // Delete conversation and all its messages
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

            // Delete all messages
            for (const message of messages) {
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

    // Get messages for a conversation
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

            // Sort by position (chronological order)
            return messages.sort((a, b) => 
                (a.position || 0) - (b.position || 0)
            );
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
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
 