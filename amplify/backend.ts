import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createAgent } from "./functions/createAgent/resource"
import { deployAgent } from "./functions/deployAgent/resource"
import { scheduler } from "./functions/scheduler/resource" 
import { storage } from "./storage/resource"

defineBackend({
  auth,
  data,
  storage,
  scheduler,
  createAgent,
  deployAgent
});
