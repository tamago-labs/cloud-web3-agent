import { defineFunction } from "@aws-amplify/backend";
import { secret } from '@aws-amplify/backend';

export const scheduler = defineFunction({
    name: "scheduler",
    schedule: "every 10m",
    resourceGroupName: "data",
    entry: './handler.ts',
    environment: {
        ANTHROPIC_API_KEY: secret('ANTHROPIC_API_KEY')
    },
    timeoutSeconds: 600
})