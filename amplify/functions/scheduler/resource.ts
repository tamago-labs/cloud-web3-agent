import { defineFunction } from "@aws-amplify/backend";
import { secret } from '@aws-amplify/backend';

export const scheduler = defineFunction({
    name: "scheduler",
    schedule: "every 10m",
    resourceGroupName: "data",
    entry: './handler.ts',
    environment: {
        ANTHROPIC_API_KEY: secret('ANTHROPIC_API_KEY'),
        CRONOS_ZKEVM_TESTNET_API_KEY: secret("CRONOS_ZKEVM_TESTNET_API_KEY"),
        CRONOS_ZKEVM_API_KEY: secret("CRONOS_ZKEVM_API_KEY"),
        CRONOS_EVM_TESTNET_API_KEY: secret("CRONOS_EVM_TESTNET_API_KEY"),
        CRONOS_EVM_API_KEY: secret("CRONOS_EVM_API_KEY")
    },
    timeoutSeconds: 600
})