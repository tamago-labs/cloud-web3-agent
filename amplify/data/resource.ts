import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createAgent } from "../functions/createAgent/resource"
import { deployAgent } from "../functions/deployAgent/resource"
import { agentChat } from "../functions/agentChat/resource";
import { scheduler } from "../functions/scheduler/resource" 

const schema = a.schema({
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
      displayName: a.string()
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
  allow.resource(agentChat),
  allow.resource(scheduler)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 