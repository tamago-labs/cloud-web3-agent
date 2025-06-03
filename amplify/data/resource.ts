import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createAgent } from "../functions/createAgent/resource"
import { deployAgent } from "../functions/deployAgent/resource"
import { agentChat } from "../functions/agentChat/resource";
import { agentCronos } from "../functions/agentCronos/resource"
import { scheduler } from "../functions/scheduler/resource"
import { generateApiKey } from "../functions/generateApiKey/resource"
import { mcpProxy } from "../functions/mcpProxy/resource"
import { trackUsage } from "../functions/trackUsage/resource"

const schema = a.schema({
  // ===== EXISTING QUERIES - NO CHANGES =====
  AgentChat: a
    .query()
    .arguments({
      messages: a.json(),
      agentId: a.string()
    })
    .returns(a.json())
    .handler(a.handler.function(agentChat))
    .authorization((allow) => [allow.authenticated()])
  ,
  AgentCronos: a
    .query()
    .arguments({
      messages: a.json(),
      agentId: a.string()
    })
    .returns(a.json())
    .handler(a.handler.function(agentCronos))
    .authorization((allow) => [allow.authenticated()])
  ,
  PromptEnhance: a.generation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: 'You are a helpful assistant that completes prompts for automation tasks on the Web3 AI-agent platform.',
  })
    .arguments({ prompt: a.string() })
    .returns(a.string())
    .authorization((allow) => allow.authenticated()),
  CreateAgent: a
    .query()
    .arguments({
      name: a.string(),
      userId: a.string(),
      blockchain: a.string(),
      sdkType: a.string()
    })
    .returns(a.boolean())
    .handler(a.handler.function(createAgent))
    .authorization((allow) => [allow.authenticated()])
  ,
  DeployAgent: a
    .query()
    .arguments({
      name: a.string(),
      userId: a.string(),
      blockchain: a.string(),
      sdkType: a.string(),
      subnetwork: a.string(),
      isTestnet: a.boolean(),
      promptInput: a.string(),
      promptDecision: a.string(),
      promptExecute: a.string()
    })
    .returns(a.boolean())
    .handler(a.handler.function(deployAgent))
    .authorization((allow) => [allow.authenticated()])
  ,
  User: a
    .model({
      username: a.string().required(),
      role: a.enum(["USER", "MANAGER", "ADMIN"]),
      agents: a.hasMany('Agent', "userId"),
      displayName: a.string(),
      apiKeys: a.hasMany('ApiKey', "userId"),
      usageLogs: a.hasMany('UsageLog', "userId"),
      toolSelections: a.hasMany('ToolSelection', "userId"),
      usageQuotas: a.hasMany('UsageQuota', "userId"),
      chatSessions: a.hasMany('ChatSession', "userId")
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner()
    ]),
  Agent: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      name: a.string(),
      blockchain: a.string(),
      subnetwork: a.string(),
      isTestnet: a.boolean(),
      isActive: a.boolean(),
      schedule: a.integer(),
      lastRanAt: a.timestamp(),
      promptInput: a.string(),
      promptDecision: a.string(),
      promptExecute: a.string(),
      additionalTools: a.json(),
      sdkType: a.string(),
      wallets: a.hasMany('Wallet', "agentId"),
      walletAddresses: a.string().array(),
      listing: a.hasOne('Marketplace', "agentId"),
      messages: a.json()
    })
    .authorization((allow) => [
      allow.authenticated()
    ]),
  Wallet: a
    .model({
      agentId: a.id().required(),
      agent: a.belongsTo('Agent', "agentId"),
      address: a.string(),
      isDefault: a.boolean(),
      key: a.string()
    }).authorization((allow) => [
      allow.owner()
    ]),
  Marketplace: a
    .model({
      agentId: a.id().required(),
      agent: a.belongsTo('Agent', "agentId"),
      publicName: a.string(),
      description: a.string(),
      isApproved: a.boolean(),
      isHidden: a.boolean(),
      category: a.string(),
      price: a.integer(),
      redeployCount: a.integer(),
      blockchain: a.string(),
      sdkType: a.string(),
      tags: a.string().array()
    }).authorization((allow) => [
      allow.authenticated()
    ]),
  // ===== NEW MCP QUERIES =====
  GenerateApiKey: a
    .query()
    .arguments({
      userId: a.string()
    })
    .returns(a.json()) // { apiKey: string, keyId: string }
    .handler(a.handler.function(generateApiKey))
    .authorization((allow) => [allow.authenticated()]),
  McpProxy: a
    .query()
    .arguments({
      messages: a.json(),
      tools: a.string().array(),
      apiKey: a.string()
    })
    .returns(a.json())
    .handler(a.handler.function(mcpProxy))
    .authorization((allow) => [allow.authenticated()]),
  TrackUsage: a
    .mutation()
    .arguments({
      userId: a.string(),
      usageType: a.string(), // 'message', 'api_call'
      amount: a.integer()
    })
    .returns(a.boolean())
    .handler(a.handler.function(trackUsage))
    .authorization((allow) => [allow.authenticated()]),
  ApiKey: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      keyHash: a.string().required(), // Store hashed version only
      keyPrefix: a.string().required(), // First 8 chars for display
      isActive: a.boolean().default(true),
      lastUsedAt: a.timestamp(),
      expiresAt: a.timestamp(), // Optional expiration
      name: a.string(), // User-friendly name like "Development Key"
      usageLogs: a.hasMany('UsageLog', "apiKeyId")
    })
    .authorization((allow) => [
      allow.owner()
    ]),
  UsageLog: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      apiKeyId: a.id(),
      apiKey: a.belongsTo('ApiKey', "apiKeyId"),
      endpoint: a.string(), // e.g., '/mcp/chat', '/mcp/wallet'
      method: a.string(), // 'POST', 'GET'
      tokensUsed: a.integer().default(0),
      responseTime: a.integer(), // milliseconds
      success: a.boolean().default(true),
      errorMessage: a.string()
    })
    .authorization((allow) => [
      allow.owner()
    ]),
  ToolSelection: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      category: a.string().required(), // 'blockchain', 'defi', 'analytics'
      toolName: a.string().required(), // 'wallet_operations', 'token_transfers'
      isEnabled: a.boolean().default(true),
      configuration: a.json() // Tool-specific config
    })
    .authorization((allow) => [
      allow.owner()
    ]),
  UsageQuota: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      quotaType: a.string().required(), // 'messages_monthly', 'api_calls_daily'
      limitAmount: a.integer().required(), // Max allowed
      currentUsage: a.integer().default(0), // Current usage
      resetDate: a.timestamp().required(), // When it resets
      tierName: a.string().default("FREE") // 'FREE', 'PRO', 'ENTERPRISE'
    })
    .authorization((allow) => [
      allow.owner()
    ]),
  ChatSession: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo('User', "userId"),
      name: a.string().default("Chat Session"),
      messages: a.json(), // Array of chat messages
      toolsUsed: a.string().array(), // Tools used in this session
      tokenCount: a.integer().default(0),
      isActive: a.boolean().default(true)
    })
    .authorization((allow) => [
      allow.owner()
    ])
}).authorization((allow) => [
  allow.resource(createAgent),
  allow.resource(deployAgent),
  allow.resource(agentChat),
  allow.resource(agentCronos),
  allow.resource(scheduler),
  allow.resource(generateApiKey),
  allow.resource(mcpProxy),
  allow.resource(trackUsage)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 