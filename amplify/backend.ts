import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createAgent } from "./functions/createAgent/resource"
import { deployAgent } from "./functions/deployAgent/resource"
import { scheduler } from "./functions/scheduler/resource"
import { agentCronosFunctionHandler } from './functions/agentCronos/resource';

defineBackend({
  auth,
  data,
  scheduler,
  createAgent,
  deployAgent,
  agentCronosFunctionHandler
});
