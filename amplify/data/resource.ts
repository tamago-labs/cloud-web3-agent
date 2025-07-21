import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  extractChartData: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: `You are a Web3 data analyst specialized in extracting and visualizing blockchain analytics.

Analyze the provided conversation and tool results to identify the most meaningful numerical data for visualization.

Chart Type Selection:
- PIE: Token/asset distributions, portfolio allocations, percentage breakdowns
- BAR: Protocol comparisons, ranking data, categorical metrics
- LINE: Time series data, price movements, growth trends
- AREA: Cumulative values over time, stacked metrics

Data Extraction Rules:
1. Look for numerical values with clear labels
2. Prefer recent/final tool results over intermediate data
3. Extract the most significant finding (highest values, clear trends)
4. Normalize units when possible (convert to USD, ETH, etc.)
5. Limit to 3-8 data points for clarity

Format Requirements:
- dataName: Clear, concise labels (ETH, Aave TVL, Week 1)
- dataValue: Numerical values only (no units in the number)
- title: Descriptive chart title (Portfolio Distribution, DeFi Protocol TVL)
- totalValue: Optional summary with units ($14,213, 425.7 ETH)
- change: Optional percentage change (+12.4%, -3.2%)

Focus on actionable insights from Web3 data like portfolio values, protocol metrics, transaction volumes, or market trends.`
  })
    .arguments({
      conversationText: a.string().required(),
      toolResults: a.string().required()
    })
    .returns(
      a.customType({
        chartType: a.enum(['pie', 'bar', 'line', 'area']),
        title: a.string().required(),
        dataName: a.string().array().required(),
        dataValue: a.float().array().required(),
        totalValue: a.string(), // e.g. "$14,213"
        change: a.string() // e.g. "+12.4%"
      })
    )
    .authorization((allow) => allow.authenticated()),
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
      artifacts: a.hasMany("Artifact", "userId"),
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
    toolResults: a.hasMany("ToolResult", "messageId"),
    artifacts: a.hasMany("Artifact", "messageId")
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
  Artifact: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    messageId: a.id().required(),
    message: a.belongsTo('Message', "messageId"),
    title: a.string().required(),
    description: a.string(),
    chartType: a.enum(['pie', 'bar', 'line', 'area', 'donut', 'horizontal_bar']),
    data: a.json().required(), // Array of chart data points
    totalValue: a.string(), // e.g. "$14,213", "425.7 ETH"
    change: a.string(), // e.g. "+12.4%", "-3.2%"
    category: a.string(), // e.g. "Portfolio Analytics", "DeFi Analytics"
    tags: a.string().array(), // searchable tags
    isPublic: a.boolean().default(false), // whether visible in discover page
    likes: a.integer().default(0),
    views: a.integer().default(0),
    sourceData: a.json(), // original conversation data used to create chart
    metadata: a.json() // additional metadata like colors, formatting, etc
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.authenticated().to(["read"]),
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