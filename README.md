# Bodhi Tree Analytics

![MCP](https://img.shields.io/badge/MCP-Protocol-purple)
[![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#)
[![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)

Bodhi Tree is a platform that lets you ask questions like "Show Aave TVL" or "Track Vitalik’s wallet" and get real-time blockchain charts instantly. It's similar to Dune Analytics, but with no SQL and no setup required.

It leverages the extensive MCP server library to access real-time data — from on-chain sources via Nodit MCP to off-chain data like token prices. With over 10,000+ MCPs available in the market, the system can perform a wide range of tasks and acquire knowledge across various domains.

<img width="1277" height="489" alt="bodhi-tree drawio" src="https://github.com/user-attachments/assets/4e5c24f9-421b-4eaf-85ac-20d3b15f3d71" />

The platform comprises several components that enable real-time, AI-powered Web3 analytics via chat. Each part plays a critical role in making **Bodhi Tree** seamless, scalable, and extensible:

- **Serverless Backend + Frontend**
  - (https://github.com/tamago-labs/bodhi-tree-analytics) - This repo
  - Built on AWS Amplify Serverless stack
  - Uses Next.js for frontend
  - Backend includes GraphQL API, database, and Bedrock AI integration
  - Handles chat queries and artifact generation with no backend maintenance

- **Online MCP Server Service**
  - (https://github.com/tamago-labs/decentral-mcp-server)
  - Node.js Express for manage MCP servers
  - Deployable on platforms like Railway.app
  - Allows users to interact with MCP servers online — no local setup needed
  - Acts as the middleware between the frontend and blockchain data sources

- **Web3 MCP Servers**
  - (https://github.com/tamago-labs/web3-mcp)
  - A set of Web3-specific MCP servers, including:
    - DeFi Analytics
    - Whale Tracker
    - Bitcoin Wallet Analyzer
  - Built on top of Nodit infrastructure for data access
  - Integrates with Pyth Network for off-chain token prices
  - Saves up to 90% in token query costs
  - Each server includes documentation, usage instructions, and API specs

## Screenshots

 <img width="1191" height="737" alt="Screenshot from 2025-07-14 11-01-13" src="https://github.com/user-attachments/assets/3a424640-118a-43e4-a865-5a7f52c19926" />




