import { defineFunction } from '@aws-amplify/backend';
import { secret } from '@aws-amplify/backend';


export const checkWalletTransactions = defineFunction({
    name: 'checkWalletTransactions',
    entry: './handler.ts',
    timeoutSeconds: 30,
    environment: {
        // Add any environment variables needed for blockchain API calls
        ALCHEMY_API_KEY: secret("ALCHEMY_API_KEY") || '46BFnBkjDdWActWG5HvRV',
        APTOS_NODE_URL: secret("APTOS_NODE_URL") || 'https://fullnode.mainnet.aptoslabs.com/v1',
        SUI_RPC_URL: secret("SUI_RPC_URL") || 'https://fullnode.mainnet.sui.io:443'
    }
});