import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createWallet } from "../functions/createWallet/resource"
import { checkWalletTransactions } from "../functions/checkWalletTransactions/resource"


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
  CreateWallet: a
    .query()
    .arguments({
      userId: a.string(),
      blockchain: a.string()
    })
    .returns(a.boolean())
    .handler(a.handler.function(createWallet))
    .authorization((allow) => [
      allow.authenticated()
    ]),
  CheckTxs: a
    .query()
    .arguments({
      userId: a.string(),
      blockchainId: a.string()
    })
    .returns(a.boolean())
    .handler(a.handler.function(checkWalletTransactions))
    .authorization((allow) => [
      allow.authenticated()
    ]),
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
      wallets: a.hasMany("UserWallet", "userId"),
      cryptoDeposits: a.hasMany("CryptoDeposit", "userId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.owner()
    ]),
  UserWallet: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    // Wallet identifiers
    address: a.string().required(), // unique deposit address for this user
    privateKeyEncrypted: a.string(), // encrypted private key (if you manage keys)
    derivationPath: a.string(), // HD wallet path like m/44'/60'/0'/0/123
    walletIndex: a.integer(), // sequential index for HD wallet generation 
    // Network/chain info
    network: a.string().required(), // "evm", "aptos", "sui"
    chainIds: a.integer().array(), // 1, 137, 56, 42161 
    // Status
    isActive: a.boolean().default(true),
    isMonitored: a.boolean().default(true), // whether we're watching for deposits
    lastChecked: a.datetime(), // last time we checked for transactions 
    // Relationships
    deposits: a.hasMany("CryptoDeposit", "walletId")
  }).authorization((allow) => [
    allow.authenticated().to(["read"]),
    allow.owner()
  ]),
  CryptoDeposit: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    walletId: a.id().required(),
    wallet: a.belongsTo('UserWallet', "walletId"),
    // Transaction details
    txHash: a.string().required(),
    blockNumber: a.integer(),
    blockHash: a.string(),
    transactionIndex: a.integer(),
    // Token/amount info
    tokenAddress: a.string(), // contract address (null for native token like ETH)
    tokenSymbol: a.string().required(), // "ETH", "USDC", "MATIC"
    tokenDecimals: a.integer().default(18),
    rawAmount: a.string().required(), // raw amount in wei/smallest unit
    formattedAmount: a.string().required(), // human readable amount "1.5"
    // USD conversion (at time of deposit)
    usdRate: a.float(), // token price in USD when deposited
    usdValue: a.float(), // total USD value of deposit
    creditsGranted: a.float().required(), // how many credits this deposit gave
    conversionRate: a.float().required(), // USD to credits rate used   
    // Metadata
    fromAddress: a.string(), // who sent the payment 
    notes: a.string(), // any special notes about this deposit 
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.authenticated().to(["read"]),
    allow.owner()
  ]),
  Servers: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', "userId"),
    externalId: a.string(), // ID on Railway
    serverUrl: a.string(),
    image: a.string(),
    name: a.string(),
    description: a.string(),
    category: a.string(), // e.g., "DeFi Research", "NFT Analytics", "Trading Strategy" 
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
    supportedChains: a.string().array(),
    objective: a.string(), // what the project aims to achieve
    status: a.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]),
    isPublic: a.boolean().default(false),
    isVerified: a.boolean().default(false),
    coverImage: a.string(), // URL to cover image
    tags: a.string().array(),
    // Stats
    likes: a.integer().default(0),
    views: a.integer().default(0),
    collection: a.string().array()
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
    blockchainNetwork: a.string().array(),
    dataFreshness: a.datetime(), // when data was last updated
    queryParameters: a.json(), // original query params for reproducibility
    dataValidation: a.json(), // data quality metrics
    metadata: a.json(), // additional metadata like colors, formatting, contracts analyzed, specific txs analyzed
  }).authorization((allow) => [
    allow.guest().to(["read", "update"]),
    allow.authenticated().to(["read", "update"]),
    allow.owner()
  ])
}).authorization((allow) => [
   allow.resource(createWallet),
   allow.resource(checkWalletTransactions)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 