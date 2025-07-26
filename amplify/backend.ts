import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import { Function as LambdaFunction, FunctionUrl, InvokeMode, FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib"
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from "./storage/resource";
import { chatApiFunction } from "./functions/chat-api/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  chatApiFunction,
});

// create a new Lambda stack for the chat function
const chatStack = backend.createStack("chat-lambda-stack");

// Get the Lambda function
const lambdaFunction = backend.chatApiFunction.resources.lambda as LambdaFunction;

// Create Function URL with streaming enabled
const functionUrl = new FunctionUrl(chatStack, "ChatFunctionUrl", {
  function: lambdaFunction,
  authType: FunctionUrlAuthType.NONE,
  invokeMode: InvokeMode.RESPONSE_STREAM, // Enable streaming
  cors: {
    allowCredentials: true,
    allowedOrigins: ["*"], // Restrict this in production
    allowedMethods: [HttpMethod.POST, HttpMethod.OPTIONS],
    allowedHeaders: ["*"],
    maxAge: Duration.minutes(5),
  },
});
 

// Add permissions for authenticated users to invoke the function URL
// const invokePolicy = new PolicyStatement({
//   actions: ["lambda:InvokeFunctionUrl"],
//   resources: [lambdaFunction.functionArn],
// });

// // backend.auth.resources.authenticatedUserIamRole.addToPolicy(invokePolicy);
// backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(invokePolicy)

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