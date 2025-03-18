

import { defineFunction } from '@aws-amplify/backend';


export const deployAgent = defineFunction({ 
  name: 'deployAgent', 
  entry: './handler.ts', 
  timeoutSeconds: 10
});