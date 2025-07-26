import { defineFunction } from "@aws-amplify/backend";
import { secret } from '@aws-amplify/backend';

export const chatApiFunction = defineFunction({
  name: "chat-api",
  timeoutSeconds: 300, // 10 minutes for long conversations
  memoryMB: 1024,
  environment: {
    NEXT_PUBLIC_AWS_ACCESS_KEY_ID: secret('NEXT_PUBLIC_AWS_ACCESS_KEY_ID'),
    NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: secret("NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY"),
    NEXT_PUBLIC_AWS_REGION: secret("NEXT_PUBLIC_AWS_REGION"),
    NEXT_PUBLIC_MCP_SERVICE_URL: secret("NEXT_PUBLIC_MCP_SERVICE_URL"),
    NEXT_PUBLIC_MCP_API_KEY: secret("NEXT_PUBLIC_MCP_API_KEY")
  },
});