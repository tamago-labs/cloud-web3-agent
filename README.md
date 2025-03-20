## Cloud Web3 Agent

Today, many blockchain foundations and major projects in the ecosystem provide SDKs for building AI agents that enable interaction with DeFi protocols and other blockchain applications through natural language. Some well-known SDKs include **MetaMove’s Move Agent Kit**, **Crypto.com’s AI Agent Kit** and **SendAI’s Solana Agent Kit**.

**Cloud Web3 Agent** provides a solution for deploying and managing these Web3 AI agents with ease. It provides a managed infrastructure built on AWS serverless architecture, packaged in an open-source AWS Amplify stack. This ensures low operational costs, high flexibility and seamless AI agent deployment.

## Features

- **Instant Deployment:** Deploy a new agent by selecting the blockchain and SDK to use and have a ready-to-use AI agent within seconds.
- **Chat Interface:** Start chatting to swap, stake, lend or perform any actions supported by the SDK. Tasks can also be scheduled to run periodically, such as monitoring healthy collateral ratios.
- **Marketplace System:** Enables fine-tuned AI agents to be monetized on the marketplace.
- **Multiple SDK Support:** Currently supports MetaMove Move Agent Kit, with Solana and Cronos support coming soon.

The project is under heavy development, with analytics data currently mocked and payments not yet functional.

## Overview

The system uses the AWS Amplify Stack to efficiently manage and run AI agents without the need for dedicated API services for the client. Agent-related data is stored in a database, while on-chain transactions rely on the SDK. This approach helps us stay lean and focus on improvements for the AI agent's core logic.

![Untitled Diagram drawio (16)](https://github.com/user-attachments/assets/8c904cec-5c41-4eb4-929d-5c52cfba7b3f)

During creation, a unique wallet key is generated on the backend and securely stored in the cloud, along with the selected blockchain and SDK data. The AI agent can then be invoked as follows:

- **Chat Interface:** Enables interaction to explore the agent's capabilities based on the selected SDK, deposit funds, trial operations, or perform initial interactions like borrowing assets from a lending protocol.

- **Automation Schedule:** – Allows programming automation by providing a set of prompts to run periodically, such as monitoring borrow positions or executing swaps at a predefined rate.

Hence, the agent can be listed on the marketplace, the admin can manually approve it through the AWS Amplify database console. After approval, others can redeploy the agent and make payments as needed.

## Automation

Automation allows users to define prompts that trigger actions at specific times. It operates through three key prompts:

- **Input Processing Prompt** – Gathers necessary information such as current exchange rates and active positions to monitor.

- **Decision-Making Prompt** – Assesses collected data against a specified condition. For example, “Check if the APT/USDT rate is above 4.5.”

- **Execution Prompt** – If the condition is met, the agent executes the on-chain action via the SDK.

All interactions between programmed prompts and the AI agent are stored in the database and can be reviewed later through the chat interface.

## Deploying to AWS

The entire project is packaged within the AWS Amplify stack, which automates the setup of essential AWS services, including:

- **Amplify Database** – A real-time database for storing AI agents and account information.

- **AWS AI Kit** – Enhances automation prompts using managed Claude on AWS.

- **AWS Lambda** – Serverless backend functions handling all SDK interactions.

- **AWS Cognito** – Managed authentication supporting Google and other providers.

- **Next.js Frontend** – The main frontend and dashboard interface.

For detailed instructions on deploying, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws)

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
