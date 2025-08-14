

import { defineFunction } from '@aws-amplify/backend';


export const createWallet = defineFunction({
    name: 'createWallet',
    entry: './handler.ts',
    timeoutSeconds: 10
});