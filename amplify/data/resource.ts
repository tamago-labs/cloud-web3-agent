import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      role: a.enum(["USER", "MANAGER", "ADMIN"]), 
      displayName: a.string(),
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
  ])
}).authorization((allow) => [ 
  // allow.resource(scheduler)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 