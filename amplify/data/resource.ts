import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createAgent } from "../functions/createAgent/resource"

const schema = a.schema({
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
  User: a
    .model({
      username: a.string().required(),
      role: a.enum(["USER", "MANAGER", "ADMIN"]),
      agents: a.hasMany('Agent', "userId"),
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
      sdkType: a.string(),
      wallets: a.hasMany('Wallet', "agentId"),
      walletAddresses: a.string().array(),
      configurations: a.json(),
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
      key: a.json()
    }).authorization((allow) => [
      allow.owner()
    ]),
}).authorization((allow) => [allow.resource(createAgent)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool"
  },
}); 