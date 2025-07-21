# Bodhi Tree Analytics

> **Web3 Analytics via Chat - No SQL Required**

![MCP](https://img.shields.io/badge/MCP-Protocol-purple)
[![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#)
[![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)

Bodhi Tree is a platform that lets you ask questions like "Show Aave TVL" or "Track Vitalik's wallet" and get real-time blockchain charts instantly. It's similar to Dune Analytics, but with natural language queries instead of SQL, and no setup required.

The platform leverages the extensive MCP (Model Context Protocol) server ecosystem to access real-time data — from on-chain sources via Nodit MCP to off-chain data like token prices. With 10,000+ MCPs available in the market, the system can perform a wide range of analytics tasks across various Web3 domains.

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
  - Node.js Express service for managing MCP servers deployable on platforms like Railway.app
  - Allows users to interact with MCP servers online — no local setup needed
  - Acts as the middleware between the frontend and blockchain data sources
  - Handles server discovery, connection management, and tool execution

- **Web3 MCP Servers**
  - (https://github.com/tamago-labs/web3-mcp)
  - A set of Web3-specific MCP servers, including:
    - Portfolio Snapshot
    - DeFi Analytics
    - Whale Tracker
    - Bitcoin Wallet Analyzer
  - Built on top of Nodit MCP for real-time on-chain data analytics
  - Integrates with Pyth Network for off-chain token prices
  - Saves up to 90% in token query costs compared to direct calls on Nodit MCP

## Screenshots

 <img width="1191" height="737" alt="Screenshot from 2025-07-14 11-01-13" src="https://github.com/user-attachments/assets/3a424640-118a-43e4-a865-5a7f52c19926" />

## Features

- **Natural Language Queries:** Ask questions and get professional charts instantly. No SQL or technical expertise needed
- **Real-time Data:** Live blockchain data across 10+ chains (Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Bitcoin, Aptos, and more)
- **AI-Powered:** Claude Sonnet 4 processes queries and generates visualizations
- **Zero Setup:** Browser-based interface with instant access
- **Private Processing:** Your data stays secure with AWS infrastructure
- **Cost Efficient:** Up to 90% savings on data queries through optimized MCP servers


## Usage Examples

### **Simple Queries**
- *"What's the current price of Bitcoin?"*
- *"Show me Ethereum gas prices today"*
- *"How much TVL does Aave have?"*

### **Advanced Analytics**  
- *"Compare the performance of top DeFi protocols this month"*
- *"Analyze whale movements for ETH in the last 24 hours"*
- *"Show me the distribution of Bitcoin mining pools"*
- *"Track yield farming opportunities across different chains"*

### **Portfolio Analysis**
- *"Analyze Vitalik's wallet portfolio breakdown"*
- *"Show me the largest token holders for USDC"*
- *"Track transactions for wallet 0x..."*

## Available MCP Servers

| Server | Description | Chains Supported |
|--------|-------------|------------------|
| **Portfolio Snapshot** | Multi-chain wallet analysis | Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Kaia |
| **Gas Optimization Helper** | Real-time gas price optimization | Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Kaia |
| **DeFi Analytics** | Protocol TVL, yield tracking, DEX analytics | Multi-chain DeFi protocols |
| **Bitcoin Wallet Analyzer** | UTXO analysis, fee optimization | Bitcoin, Dogecoin |
| **Bitcoin Network Insights** | Mining analytics, network health | Bitcoin, Dogecoin |
| **NFT Collection Insights** | Collection stats, holder analysis | Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, Kaia |
| **Aptos DeFi Analytics** | Native Aptos ecosystem analytics | Aptos |




