import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import { Function as LambdaFunction, FunctionUrl, InvokeMode, FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
// import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib"
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from "./storage/resource";
import { chatApiFunction } from "./functions/chat-api/resource";
import { createWallet } from "./functions/createWallet/resource"
import { checkWalletTransactions } from "./functions/checkWalletTransactions/resource"

const backend = defineBackend({
  auth,
  data,
  storage,
  chatApiFunction,
  createWallet,
  checkWalletTransactions
});

// Get the Lambda function
const lambdaFunction = backend.chatApiFunction.resources.lambda as LambdaFunction;

const functionUrl = lambdaFunction.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  invokeMode: InvokeMode.RESPONSE_STREAM, // Enable streaming
  cors: {
    allowCredentials: true,
    allowedOrigins: ["*"], // Restrict this in production
    allowedMethods: [HttpMethod.ALL],
    allowedHeaders: ["*"],
    maxAge: Duration.minutes(5),
  },
});


// Add outputs to the configuration file
backend.addOutput({
  custom: {
    ChatAPI: {
      functionUrl: functionUrl.url,
      region: Stack.of(lambdaFunction).region,
      functionName: lambdaFunction.functionName,
    },
  },
});