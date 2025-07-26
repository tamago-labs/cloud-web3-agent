import { defineFunction } from "@aws-amplify/backend";

export const chatApiFunction = defineFunction({
  name: "chat-api",
  timeoutSeconds: 300, // 10 minutes for long conversations
  memoryMB: 1024
});