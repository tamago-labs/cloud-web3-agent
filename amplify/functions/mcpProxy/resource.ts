import { defineFunction } from '@aws-amplify/backend';

export const mcpProxy = defineFunction({
    name: 'mcpProxy',
    entry: './handler.ts',
    timeoutSeconds: 60,
    environment: {
        // Add environment variables for external APIs
    }
});