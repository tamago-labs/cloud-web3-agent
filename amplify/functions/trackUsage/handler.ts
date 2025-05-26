import type { Schema } from "../../data/resource";
import { generateClient } from 'aws-amplify/api';

const client = generateClient<Schema>();

export const handler: Schema["TrackUsage"]["functionHandler"] = async (event) => {
    const { userId, usageType, amount } = event.arguments;

    try {
        // Find the relevant quota
        // const { data: quotas } = await client.models.UsageQuota.list({
        //     filter: {
        //         userId: { eq: userId },
        //         quotaType: { eq: usageType }
        //     }
        // });

        // if (quotas.length > 0) {
        //     const quota = quotas[0];

        //     // Check if quota needs reset
        //     const now = new Date();
        //     const resetDate = new Date(quota.resetDate);

        //     if (now > resetDate) {
        //         // Reset the quota
        //         const newResetDate = usageType.includes('daily')
        //             ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        //             : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        //         await client.models.UsageQuota.update({
        //             id: quota.id,
        //             currentUsage: amount,
        //             resetDate: newResetDate.toISOString()
        //         });
        //     } else {
        //         // Update current usage
        //         await client.models.UsageQuota.update({
        //             id: quota.id,
        //             currentUsage: quota.currentUsage + amount
        //         });
        //     }
        // }

        return true;

    } catch (error: any) {
        console.error('Error tracking usage:', error.message);
        return false;
    }
};