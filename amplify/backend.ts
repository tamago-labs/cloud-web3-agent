import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createAgent } from "./functions/createAgent/resource"

defineBackend({
  auth,
  data,
  createAgent
});
