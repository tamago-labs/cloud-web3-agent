import type { Schema } from "../../data/resource";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api'; 

const client = generateClient<Schema>();

export const handler: Schema["GenerateApiKey"]["functionHandler"] = async (event) => {
    const { userId, name } = event.arguments;

    try {

        if (!userId) {
            throw new Error("userId is undefined")
        }

        // Create the API key record
        const { data: newApiKey } = await client.models.ApiKey.create({
            userId: userId,
            isActive: true,
            name
        });

        if (!newApiKey) {
            throw new Error('Failed to create API key');
        }

        // Initialize usage quotas for new user if they don't exist
        const { data: existingQuotas } = await client.models.UsageQuota.list({
            filter: { userId: { eq: userId } }
        });

        if (existingQuotas.length === 0) {
            // Create default quotas
            await Promise.all([
                client.models.UsageQuota.create({
                    userId: userId,
                    quotaType: 'messages_monthly',
                    limitAmount: 1000,
                    currentUsage: 0,
                    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).valueOf(), // 30 days from now
                    tierName: 'FREE'
                }),
                client.models.UsageQuota.create({
                    userId: userId,
                    quotaType: 'api_calls_daily',
                    limitAmount: 500,
                    currentUsage: 0,
                    resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).valueOf(), // 24 hours from now
                    tierName: 'FREE'
                })
            ]);
        }

        return {
            success: true,
            apiKey: newApiKey.id, // Return the actual key only once
        };

    } catch (error: any) {
        console.error('Error generating API key:', error.message);
        return {
            success: false,
            error: 'Failed to generate API key'
        };
    }
};