import { defineFunction } from '@aws-amplify/backend';

export const trackUsage = defineFunction({
    name: 'trackUsage',
    entry: './handler.ts',
    timeoutSeconds: 20
});