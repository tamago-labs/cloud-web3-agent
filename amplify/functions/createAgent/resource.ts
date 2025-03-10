

import { defineFunction } from '@aws-amplify/backend';


export const createAgent = defineFunction({ 
  name: 'createAgent', 
  entry: './handler.ts', 
  timeoutSeconds: 10
});