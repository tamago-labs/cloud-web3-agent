import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createAgent } from "../functions/createAgent/resource"
import { deployAgent } from "../functions/deployAgent/resource"
// import { agentChat } from "../functions/agentChat/resource";
// import { agentCronos } from "../functions/agentCronos/resource"
import { scheduler } from "../functions/scheduler/resource"

const schema = a.schema({
  // AgentChat: a
  //   .query()
  //   .arguments({
  //     messages: a.json(),
  //     agentId: a.string()
  //   })
  //   .returns(a.json())
  //   .handler(a.handler.function(agentChat))
  //   .authorization((allow) => [allow.authenticated()])
  // ,
  // AgentCronos: a
  //   .query()
  //   .arguments({
  //     messages: a.json(),
  //     agentId: a.string()
  //   })
  //   .returns(a.json())
  //   .handler(a.handler.function(agentCronos))
  //   .authorization((allow) => [allow.authenticated()])
  // ,
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
      // New Version
      credits: a.float(),
      creditsUsed: a.float(),
      totalCredits: a.float(),
      favorites: a.hasMany("Favorite", "userId"),
      servers: a.hasMany("Servers", "userId"),
      usageLogs: a.hasMany("UsageLogs", "userId"),
      conversations: a.hasMany("Conversation", "userId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner()
    ]),
  Servers: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    image: a.string(),
    name: a.string(),
    description: a.string(),
    category: a.string(),
    author: a.string(),
    features: a.string().array(),
    color: a.string(),
    command: a.string(),
    args: a.string().array(),
    env: a.json(),
    isFeatured: a.boolean(),
    favorites: a.hasMany("Favorite", "serverId"),
    usageLogs: a.hasMany("UsageLogs", "serverId"),
    likeCount: a.integer().default(0),
    isWeb3: a.boolean().default(true),
    supportedChains: a.string().array()
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.authenticated().to(["read"]),
    allow.owner()
  ]),
  Favorite: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    serverId: a.id().required(),
    servers: a.belongsTo('Servers', "serverId"),
    position: a.integer() // If users can reorder favorites
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.authenticated(),
  ]),
  UsageLogs: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    serverId: a.id().required(),
    servers: a.belongsTo('Servers', "serverId"),
    tokensUsed: a.integer(),            // if meter LLM tokens
    cpuMs: a.integer(),                 // or wall‑clock time
    success: a.boolean().default(true)
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.authenticated(),
  ]),
  Conversation: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    title: a.string(),
    messages: a.hasMany("Message", "conversationId")
  }).authorization((allow) => [
    allow.owner()
  ]),
  Message: a.model({
    conversationId: a.id().required(),
    conversation: a.belongsTo('Conversation', "conversationId"),
    messageId: a.string(),
    sender: a.string(),
    content: a.string(),
    timestamp: a.datetime(),
    stopReason: a.string(),
    position: a.integer(), // If we can reorder
    toolResults: a.hasMany("ToolResult", "messageId")
  }).authorization((allow) => [
    allow.owner()
  ]),
  ToolResult: a.model({
    messageId: a.id().required(),
    message: a.belongsTo('Message', "messageId"),
    toolId: a.string(),
    toolName: a.string(),
    serverName: a.string(),
    status: a.string(),
    input: a.json(),
    output: a.json(),
    error: a.string(),
    duration: a.integer(),
    metadata: a.json()
  }).authorization((allow) => [
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
}).authorization((allow) => [
  allow.resource(createAgent),
  allow.resource(deployAgent),
  // allow.resource(agentChat),
  // allow.resource(agentCronos),
  allow.resource(scheduler)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 