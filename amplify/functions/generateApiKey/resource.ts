import { defineFunction } from '@aws-amplify/backend';

export const generateApiKey = defineFunction({
    name: 'generateApiKey',
    entry: './handler.ts',
    timeoutSeconds: 30,
    environment: {
        // Add any environment variables needed
    }
});
