import { useState, useEffect } from 'react';
import { Bot, Coins, Infinity, ChevronDown, ChevronUp } from 'lucide-react';

const SupportedTechnologies = () => {
  const [activeCategory, setActiveCategory] = useState<any>('blockchains');
  const [expandedItem, setExpandedItem] = useState<any>(0);

  // Data from your paste.txt file
  const blockchains = [
    {
      icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Aptos | Metamove Agent Kit",
      description: "Enables AI agents to interact with various DeFi protocols across the Aptos ecosystem",
      features: [
        "Joule: Lending & borrowing operations",
        "Amnis: Staking operations",
        "Thala: Staking & DEX operations",
        "Echelon: Lending & borrowing operations",
        "LiquidSwap: DEX operations",
        "Panora: DEX aggregation operations",
        "Aries: Lending & borrowing operations",
        "Echo: Staking operations"
      ]
    },
    {
      icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Cronos | Crypto.com AI Agent SDK",
      description: "Supports both Cronos EVM and Cronos zkEVM networks with comprehensive SDK capabilities",
      features: [
        "Simple and intuitive API for interacting with Cronos blockchain networks",
        "Supports token balances (native & CRC20), token transfers, wrapping, and swapping",
        "Transaction queries by address or hash, and fetching transaction statuses",
        "Smart contract ABI fetching by contract address",
        "Wallet creation and balance management"
      ]
    },
    // {
    //   icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
    //   title: "Solana | SendAI Agent Kit",
    //   description: "Comprehensive toolkit for AI agents to perform operations across the Solana ecosystem",
    //   features: [
    //     "Swap tokens on Jupiter Exchange",
    //     "Execute limit orders and perp trades on Drift and Adrena",
    //     "Provide liquidity to Raydium, Orca, or Meteora pools",
    //     "Fetch real-time price feeds from Pyth and CoinGecko",
    //     "Lend assets via Lulo",
    //     "Stake SOL via Jito, Solayer, or DeFi vaults",
    //     "Automate yield strategies with Drift vaults"
    //   ]
    // },
    // {
    //   icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
    //   title: "Hedera | Hedera Agent Kit",
    //   description: "Enabling AI agents to perform operations on Hedera's high-performance public network",
    //   features: [
    //     "Create and manage fungible and non-fungible tokens (HTS)",
    //     "Submit and retrieve messages using the Hedera Consensus Service",
    //     "Deploy and interact with smart contracts",
    //     "Query account information and transaction history",
    //     "Create topics and submit messages for decentralized logging",
    //     "Manage multi-signature accounts and schedule transactions",
    //     "File storage and retrieval operations"
    //   ]
    // }
  ];

  const upcoming = [
    {
      icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Solana | SendAI Agent Kit",
      description: "Comprehensive toolkit for AI agents to perform operations across the Solana ecosystem",
      features: [
        "Swap tokens on Jupiter Exchange",
        "Execute limit orders and perp trades on Drift and Adrena",
        "Provide liquidity to Raydium, Orca, or Meteora pools",
        "Fetch real-time price feeds from Pyth and CoinGecko",
        "Lend assets via Lulo",
        "Stake SOL via Jito, Solayer, or DeFi vaults",
        "Automate yield strategies with Drift vaults"
      ]
    },
    {
      icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Base | Base AgentKit",
      description: "Comprehensive toolkit for AI agents to interact with applications on Base Layer 2 blockchain",
      features: [
        "Execute transactions across major Base DeFi protocols (Aerodrome, BaseSwap, Degen)",
        "Bridge assets between Ethereum and Base using official bridge protocols",
        "Interact with NFT marketplaces and collections on Base",
        "Access real-time price feeds and liquidity data from onchain oracles",
        "Deploy and manage smart contracts with Base-optimized gas estimation",
        "Track transaction history and account balances across Base ecosystem",
        "Automate yield strategies and liquidity provision on Base protocols"
      ]
    },
    {
      icon: <Coins className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Hedera | Hedera Agent Kit",
      description: "Enabling AI agents to perform operations on Hedera's high-performance public network",
      features: [
        "Create and manage fungible and non-fungible tokens (HTS)",
        "Submit and retrieve messages using the Hedera Consensus Service",
        "Deploy and interact with smart contracts",
        "Query account information and transaction history",
        "Create topics and submit messages for decentralized logging",
        "Manage multi-signature accounts and schedule transactions",
        "File storage and retrieval operations"
      ]
    }
  ];

  const aiModels = [
    {
      icon: <Bot className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Claude",
      description: "Full integration with Anthropic's Claude models including Claude 3 Opus, Sonnet, and Haiku",
      features: [
        "Secure authentication via API keys",
        "Support for function calling capabilities",
        "Context-aware blockchain operations",
        "Human-like reasoning for transaction validation",
        "Advanced natural language understanding for complex queries",
        "Support for Claude MCP protocol extensions"
      ]
    },
    {
      icon: <Bot className="w-10 h-10 text-[#A5B4FC]" />,
      title: "GPT-4 & GPT-3.5",
      description: "Complete integration with OpenAI's GPT models for blockchain interaction",
      features: [
        "Function-calling support with GPT-4 and GPT-3.5-Turbo",
        "OpenAI API compatibility layer",
        "Assistants API support",
        "Custom tool definitions for all blockchain operations",
        "Contextual memory for multi-step operations",
        "Transaction verification and validation capabilities"
      ]
    },
    {
      icon: <Bot className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Llama & Mistral",
      description: "Support for open-source models including Llama 3, Mistral, and other compatible LLMs",
      features: [
        "Open-source model compatibility",
        "Self-hosted model support",
        "Tool-use with function calling capabilities",
        "Customizable prompting templates",
        "Efficient tokenization for blockchain data",
        "Support for various model sizes from 7B to 70B parameters"
      ]
    },
    {
      icon: <Bot className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Custom Models",
      description: "Extensible architecture supporting integration with your own fine-tuned or custom models",
      features: [
        "SDK for integrating proprietary models",
        "Adapter pattern for new model architectures",
        "Support for domain-specific blockchain LLMs",
        "Customizable tool definitions",
        "Flexible authentication mechanisms",
        "Performance optimization for specialized models"
      ]
    }
  ];

  const protocols = [
    {
      icon: <Infinity className="w-10 h-10 text-[#A5B4FC]" />,
      title: "DeFi Protocols",
      description: "Interact with leading decentralized finance protocols across multiple blockchains",
      features: [
        "DEX operations (swaps, liquidity provision, limit orders)",
        "Lending and borrowing (supply, borrow, repay, collateralization)",
        "Yield farming strategies and automated compound",
        "Staking and unstaking operations",
        "Perpetual trading with leverage",
        "Bridging assets across supported chains",
        "Position management and liquidation protection"
      ]
    },
    {
      icon: <Infinity className="w-10 h-10 text-[#A5B4FC]" />,
      title: "NFT & TokenFi",
      description: "Comprehensive tooling for NFT and token management operations",
      features: [
        "Token creation and minting workflows",
        "NFT metadata management and updates",
        "Collection deployment and configuration",
        "Marketplace integrations for buying, selling, and listing",
        "Royalty and split payment management",
        "Batch operations for efficient management",
        "Programmable NFT interactions and conditional transfers"
      ]
    },
    {
      icon: <Infinity className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Governance & DAOs",
      description: "Tools for interacting with on-chain governance systems and DAO operations",
      features: [
        "Proposal creation and submission",
        "Voting operations with various mechanisms",
        "Delegation of voting power",
        "DAO treasury management",
        "Multi-signature operations",
        "Governance parameter updates",
        "On-chain organizational management"
      ]
    },
    {
      icon: <Infinity className="w-10 h-10 text-[#A5B4FC]" />,
      title: "Data & Oracles",
      description: "Access to on-chain data sources, oracle networks, and indexed information",
      features: [
        "Price feed integrations from leading oracles",
        "Market data aggregation across protocols",
        "Historical transaction analytics",
        "Weather data and real-world events",
        "Sports and prediction market data",
        "Cross-chain data availability",
        "Time-weighted average price calculations"
      ]
    }
  ];

  // Map category to data
  const categoryData: any = {
    blockchains,
    aiModels,
    protocols,
    upcoming
  };

  // Map category to gradient
  // const categoryGradients = {
  //   blockchains: 'from-teal-900 via-blue-800 to-teal-800',
  //   aiModels: 'from-teal-900 via-purple-800 to-teal-800',
  //   protocols: 'from-teal-900 via-green-800 to-teal-800',
  // };

  // Handle item expansion
  const toggleExpand = (index: any) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };

  return (
    <section className={`  min-h-[700px]  bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 transition-all duration-700 py-24 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-4xl font-bold text-white text-center mb-16">Supported Technologies</h2> */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Seamless Web3 Access</h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-4"></div>
          <p className="text-teal-100/80 max-w-2xl text-sm md:text-base mx-auto">
            We integrate mature Agent Kits from across the Web3 ecosystem, giving you instant access to 100+ protocols with no additional integration work
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-black/20 backdrop-blur-md rounded-lg p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6">Support List</h3>

              <button
                onClick={() => {
                  setActiveCategory('blockchains')
                  setExpandedItem(undefined)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition ${activeCategory === 'blockchains'
                  ? 'bg-teal-800/60 text-white'
                  : 'bg-transparent text-teal-100/70 hover:bg-teal-800/40'
                  }`}
              >
                <span>Available</span>
                <span className="ml-auto bg-teal-800/60 text-xs px-2 py-1 rounded-full">{blockchains.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategory('upcoming')
                  setExpandedItem(undefined)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition ${activeCategory === 'upcoming'
                  ? 'bg-teal-800/60 text-white'
                  : 'bg-transparent text-teal-100/70 hover:bg-teal-800/40'
                  }`}
              >

                <span>Upcoming</span>
                <span className="ml-auto bg-teal-800/60 text-xs px-2 py-1 rounded-full">{upcoming.length}</span>
              </button>

              {/* <button
                onClick={() => setActiveCategory('protocols')}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition ${
                  activeCategory === 'protocols' 
                    ? 'bg-teal-800/60 text-white' 
                    : 'bg-transparent text-teal-100/70 hover:bg-teal-800/40'
                }`}
              >
                <Infinity className="w-5 h-5" />
                <span>Protocols</span>
                <span className="ml-auto bg-teal-800/60 text-xs px-2 py-1 rounded-full">{protocols.length}</span>
              </button> */}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryData[activeCategory].map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-black/20 backdrop-blur-md rounded-lg p-6 border border-teal-800/30 hover:border-teal-500/50 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* <div className="bg-teal-900/50 rounded-lg p-3">
                      {item.icon}
                    </div> */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-teal-100/70 mt-2">{item.description}</p>

                      {/* Feature list toggle button */}
                      <button
                        onClick={() => toggleExpand(index)}
                        className="mt-4 flex items-center text-teal-300 hover:text-teal-200 transition text-sm font-medium"
                      >
                        {expandedItem === index ? (
                          <>
                            <span>Hide features</span>
                            <ChevronUp className="w-4 h-4 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>View features</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>

                      {/* Expandable feature list */}
                      {expandedItem === index && (
                        <ul className="mt-4 space-y-2 text-sm text-teal-100/80">
                          {item.features.map((feature: any, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-start">
                              <div className="h-5 w-5 rounded-full bg-teal-800/30 flex items-center justify-center text-teal-400 mr-2 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



      </div>
    </section>
  );
};

export default SupportedTechnologies;