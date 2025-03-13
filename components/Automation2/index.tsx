"use client"


import React, { useState } from 'react';
import { ArrowRight, Database, Loader, Play, Save, ArrowDownCircle, Zap, Code, Grid } from "react-feather"



const Automation = () => {

    const [agentName, setAgentName] = useState('');
    const [activeTab, setActiveTab] = useState('data');
    const [prompts, setPrompts] = useState<any>({
        data: '',
        decision: '',
        execution: ''
    });
    const [responseSpeed, setResponseSpeed] = useState('standard');
    const [confirmationMode, setConfirmationMode] = useState('manual');
    const [riskLevel, setRiskLevel] = useState('moderate');
    const [expandedTemplate, setExpandedTemplate] = useState<any>(null);

    const handlePromptChange = (module: any, value: any) => {
        setPrompts((prev:any) => ({
            ...prev,
            [module]: value
        }));
    };

    const templates = [
        {
            title: "DeFi Trading Agent",
            description: "Monitors markets and executes trades based on parameters",
            prompts: {
                data: "Continuously monitor APT/USDC price movements across all major Aptos DEXs. Track 24-hour price changes, volume, and liquidity. Also gather data on overall market sentiment from social feeds.",
                decision: "Analyze price movements to identify potential entry and exit points. When price moves more than 5% in either direction within 24 hours, evaluate volume trends to confirm momentum. Use market sentiment as a secondary signal.",
                execution: "When buy signals are confirmed, execute trades on the DEX with best price. Maintain a stop-loss at 10% below entry price. Take profit at 15% gain. Report all transactions and maintain a performance log."
            }
        },
        {
            title: "NFT Collection Monitor",
            description: "Tracks floor prices and alerts on opportunities",
            prompts: {
                data: "Track floor prices, sales volume, and listing counts for the top 5 NFT collections on Aptos. Monitor social media mentions and sentiment around these collections.",
                decision: "Identify potential buying opportunities when floor price drops more than 20% while sales volume remains stable or increases. Look for collections with declining list counts as potential bullish signals.",
                execution: "When opportunity is identified, send alert with collection name, floor price change, and recommendation. If auto-buy is enabled, purchase NFTs that are listed 5% or more below the current floor price, up to preset budget limits."
            }
        },
        {
            title: "Liquidity Management",
            description: "Optimizes liquidity positions across pools",
            prompts: {
                data: "Monitor APT/USDC and APT/MOD liquidity pools across Liquidswap and Pontem. Track fees generated, impermanent loss, and pool APRs. Compare with alternative yield opportunities on Aptos.",
                decision: "Calculate optimal liquidity distribution based on fee generation, impermanent loss risk, and pool volatility. Determine rebalancing triggers when impermanent loss exceeds 2% or when fees earned surpass 0.5% of position value.",
                execution: "Execute rebalancing transactions when triggers are met. Withdraw liquidity from underperforming pools and add to optimal pools. Maintain reserve for gas fees and transaction costs. Generate weekly performance reports."
            }
        },
        {
            "title": "Yield Optimizer",
            "description": "Automatically rebalances funds across DeFi protocols to maximize yield",
            "prompts": {
              "data": "Track current APYs across all major Aptos lending protocols (Aries, Thala, etc.). Monitor liquidity mining rewards, deposit/borrow rates, and supply caps. Gather data on gas costs for transactions and historical yield volatility. Check account balances and current positions.",
              "decision": "Calculate risk-adjusted returns for each protocol accounting for impermanent loss potential and platform risks. Determine optimal allocation strategy based on user's risk preference. Identify opportunities when yield differential exceeds transaction costs by at least 0.5% annualized. Consider lockup periods and early withdrawal penalties in calculations.",
              "execution": "Withdraw funds from lower-yielding protocols and deposit into higher-yielding options when thresholds are met. Claim and reinvest any reward tokens automatically. Generate weekly performance reports comparing actual vs benchmark yields. Maintain minimum liquidity reserve for gas fees and emergency withdrawals."
            }
          },
          {
            "title": "Arbitrage Hunter",
            "description": "Identifies and executes on price differences between DEXs",
            "prompts": {
              "data": "Continuously monitor token prices across all major Aptos DEXs (Liquidswap, Pontem, Ditto, etc.) for the top 20 tokens by volume. Track gas costs, slippage estimates based on trade size, and historical price divergence patterns. Monitor blockchain congestion and transaction success rates.",
              "decision": "Identify arbitrage opportunities when price differences between DEXs exceed gas costs plus a 0.3% profit margin. Calculate optimal trade sizes to maximize profit while minimizing slippage. Prioritize opportunities with highest expected profit and highest likelihood of successful execution. Consider historical reliability of price feeds when ranking opportunities.",
              "execution": "Execute flash loan-based arbitrage where beneficial. For direct arbitrage, use atomic swap transactions when possible to reduce execution risk. Split large trades to minimize slippage. Keep detailed logs of all trades including profitability and execution time. Automatically pause trading if success rate drops below 90% over 10 trades."
            }
          },
          {
            "title": "Liquidation Protector",
            "description": "Monitors lending positions and prevents liquidations",
            "prompts": {
              "data": "Monitor all user lending positions across Aptos lending protocols. Track current collateral ratios, liquidation thresholds, and price movements of collateral assets. Calculate time-to-liquidation based on price volatility and trend analysis. Monitor available funds for repayment or additional collateral.",
              "decision": "Calculate risk levels for each position based on proximity to liquidation threshold and recent price volatility. Determine optimal action when positions reach 110% of required collateral ratio: either add collateral, partially repay loan, or adjust collateral type based on market conditions. Generate alerts at 125%, 115%, and 105% of required ratio.",
              "execution": "When risk thresholds are met, automatically add collateral or repay partial debt to restore health factor to safe levels. If insufficient funds are available for either action, execute collateral swap to more stable assets. Send detailed notifications explaining actions taken and updated position status. Generate monthly risk management reports."
            }
          },
          {
            "title": "Flash Loan Strategist",
            "description": "Executes complex DeFi strategies using flash loans",
            "prompts": {
              "data": "Monitor flash loan availability across Aptos protocols. Track arbitrage opportunities, liquidation targets, and potential collateral swaps. Analyze gas costs, protocol fees, and success probability for different strategies. Monitor market volatility and blockchain congestion that might affect execution.",
              "decision": "Evaluate profitability of flash loan strategies accounting for all fees and execution risks. Rank opportunities by expected return and execution complexity. Simulate transactions before execution to verify profitability. Identify optimal execution paths through multiple protocols to maximize returns. Set minimum profit thresholds based on current market conditions.",
              "execution": "Construct and execute multi-step flash loan transactions. Verify each step's success and implement fallback options for failed steps. Maintain detailed analytics on strategy performance and optimization opportunities. Implement circuit breakers to pause operations during extreme market volatility or when success rates decline. Generate audit logs of all operations."
            }
          },
          {
            "title": "Limit Order Manager",
            "description": "Places and manages limit orders across DEXs",
            "prompts": {
              "data": "Monitor token prices across Aptos DEXs. Track user-defined limit orders and their parameters (token pairs, price targets, expiration). Calculate historical volatility and liquidity profiles for token pairs. Monitor gas prices and optimal execution times based on historical patterns.",
              "decision": "For each limit order, continuously evaluate current market prices against target prices. Calculate optimal order routing to minimize slippage based on order size and DEX liquidity. Determine whether to use limit order protocols or simulate limit orders through monitoring and executing market orders when conditions are met. Adjust gas settings based on urgency (proximity to target price).",
              "execution": "Place orders on limit order protocols where available. For simulated limit orders, execute market orders when price conditions are met. Cancel and replace orders when better execution options become available. Send confirmation notifications with execution details and price comparisons. Keep detailed order history with performance metrics."
            }
          },
          {
            "title": "Liquidity Pool Rebalancer",
            "description": "Optimizes liquidity provision across multiple pools",
            "prompts": {
              "data": "Track performance metrics (fees, impermanent loss, APR) across all Aptos liquidity pools where user has positions. Monitor trading volume trends, pool composition changes, and fee tier adjustments. Analyze price correlation between paired assets and volatility patterns. Track reward token prices and vesting schedules.",
              "decision": "Calculate risk-adjusted returns for each pool accounting for impermanent loss, fees earned, and reward tokens. Identify optimal concentration ranges for concentrated liquidity positions based on historical price movements. Determine rebalancing triggers when expected improvement exceeds 1% APR after transaction costs. Evaluate pool health through volume/TVL ratios and composition stability.",
              "execution": "Adjust liquidity positions by removing from underperforming pools and adding to optimal pools. For concentrated liquidity, adjust ranges to capture expected price movements. Claim and handle reward tokens according to user preferences (reinvest, swap to stablecoins, etc.). Generate monthly performance reports comparing returns to benchmark strategies."
            }
          },
          {
            "title": "Options Vault Manager",
            "description": "Manages options strategies on DeFi options protocols",
            "prompts": {
              "data": "Monitor options markets on Aptos options protocols. Track implied volatility, historical volatility, option prices, and greeks (delta, gamma, theta, vega). Analyze underlying asset price movements and correlation with broader market indices. Monitor funding rates and term structure of volatility.",
              "decision": "Identify mispriced options based on volatility surface analysis. Determine optimal options strategies (covered calls, cash-secured puts, spreads) based on market outlook and risk parameters. Calculate position sizing to maintain target portfolio delta and vega exposure. Set profit-taking and stop-loss levels for each position. Evaluate roll-forward opportunities near expiration.",
              "execution": "Open options positions using selected strategies. Manage positions by adjusting as market conditions change. Close positions when profit targets or stop-loss levels are reached. Roll forward expiring positions when conditions warrant. Generate regular performance reports including strategy returns, greek exposures, and statistical analysis compared to benchmarks."
            }
          },
          {
            "title": "Stablecoin Yield Hunter",
            "description": "Maximizes yield on stablecoin holdings while maintaining stability",
            "prompts": {
              "data": "Track stablecoin yields across Aptos lending markets, liquidity pools, and yield aggregators. Monitor stablecoin pegs and deviation patterns. Analyze protocol risks including TVL trends, audit status, and governance stability. Evaluate on-chain insurance costs and coverage availability. Track historical reliability of each stablecoin type.",
              "decision": "Rank stablecoin yield opportunities based on risk-adjusted returns, taking into account peg stability risks and protocol security. Calculate optimal allocation across multiple protocols to diversify platform risk. Set rebalancing thresholds when yield differentials exceed 0.5% APR after accounting for transaction costs. Adjust risk scoring during market stress periods.",
              "execution": "Distribute stablecoin holdings across the highest-yielding platforms according to risk parameters. Rebalance when yield differentials or risk assessments change significantly. Maintain a portion in high-liquidity options for quick reallocation. Generate weekly yield reports comparing performance to stablecoin yield indices. Monitor and alert on any depegging events or protocol risk changes."
            }
          },
          {
            "title": "Governance Optimizer",
            "description": "Manages governance tokens and voting to maximize protocol benefits",
            "prompts": {
              "data": "Track upcoming governance proposals across Aptos DeFi protocols where user holds governance tokens. Monitor voting patterns, quorum requirements, and proposal outcomes. Analyze historical impact of proposal types on token value and protocol performance. Track delegation opportunities and associated rewards.",
              "decision": "Evaluate governance proposals based on potential impact on protocol value and user's specific positions. Identify optimal voting strategies to maximize protocol benefits aligned with user holdings. Determine whether to vote directly or delegate to aligned protocol experts. Calculate opportunity costs of governance token lockups during voting periods.",
              "execution": "Execute votes on governance proposals according to determined strategy. Delegate voting power when advantageous. Claim any governance rewards and reinvest according to user parameters. Generate reports on voting activity and value generated through governance participation. Alert on high-impact proposals requiring user input."
            }
          },
          {
            "title": "DeFi Tax Optimizer",
            "description": "Manages transactions to optimize tax implications",
            "prompts": {
              "data": "Track all user transactions across Aptos DeFi platforms including trades, liquidity provisions, lending, borrowing, rewards, and staking. Calculate cost basis for all assets using specified method (FIFO, LIFO, etc.). Monitor holding periods for preferential tax treatment thresholds. Identify harvestable tax losses and wash sale risks.",
              "decision": "Identify tax optimization opportunities such as harvesting losses to offset gains, timing transactions to qualify for long-term capital gains rates, and optimizing reward claim timing. Evaluate transactions for potential tax implications before execution. Identify high-tax-efficiency and low-tax-efficiency actions based on user's current tax situation.",
              "execution": "Execute tax-optimizing transactions such as harvesting losses near reporting period ends. Adjust transaction timing to maximize after-tax returns. Maintain detailed transaction records with tax classifications and cost basis information. Generate tax-year summaries and transaction logs formatted for tax reporting. Avoid executing transactions that create wash sale concerns."
            }
          }
    ];

    const handleTemplateSelect = (template: any) => {
        setPrompts(template.prompts);
        setAgentName(template.title);
        setExpandedTemplate(null);
    };

    const handleEnhancePrompt = (module: any) => {
        // Placeholder for AI enhancement functionality
        alert(`Enhancing ${module} prompt with AI assistance...`);
    };

    const handlePreview = () => {
        // Placeholder for preview functionality
        alert("Previewing agent behavior...");
    };

    const handleDeploy = () => {
        // Placeholder for deployment functionality
        alert("Deploying agent to the cloud...");
    };

    const moduleIcons: any = {
        data: <Database className="h-5 w-5 text-blue-400" />,
        decision: <Loader className="h-5 w-5 text-purple-400" />,
        execution: <ArrowDownCircle className="h-5 w-5 text-green-400" />
    };

    const moduleTitles: any = {
        data: "Data Ingestion Module",
        decision: "Decision-Making Module",
        execution: "Action Execution Module"
    };

    const moduleDescriptions: any = {
        data: "Define how your agent gathers and processes input data",
        decision: "Specify how your agent analyzes data and determines actions",
        execution: "Configure how your agent carries out decisions and handles results"
    };


    return (
        <div className="min-h-screen  text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Web3 Agent</h1>
                    <p className="text-lg text-blue-200">
                        Define your agent's capabilities with modular prompts
                    </p>
                    <p className="text-sm mt-2 max-w-2xl mx-auto">
                        Configure each module of your agent to create a powerful blockchain automation system on Aptos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Prompt Input */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-blue-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                                    Agent Builder
                                </h2>

                                <div className="flex items-center">
                                    <label htmlFor="agentName" className="block text-sm font-medium mr-2">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="agentName"
                                        value={agentName}
                                        onChange={(e) => setAgentName(e.target.value)}
                                        placeholder="My Trading Agent"
                                        className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Module Tabs */}
                            <div className="flex mb-4 border-b border-gray-700">
                                {Object.keys(prompts).map((module) => (
                                    <button
                                        key={module}
                                        onClick={() => setActiveTab(module)}
                                        className={`py-2 px-4 flex items-center ${activeTab === module
                                                ? 'border-b-2 border-blue-500 text-blue-400'
                                                : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        {moduleIcons[module]}
                                        <span className="ml-2 capitalize">{module}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Current Module Content */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-lg flex items-center">
                                        {moduleIcons[activeTab]}
                                        <span className="ml-2">{moduleTitles[activeTab]}</span>
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{moduleDescriptions[activeTab]}</p>

                                <textarea
                                    value={prompts[activeTab]}
                                    onChange={(e) => handlePromptChange(activeTab, e.target.value)}
                                    placeholder={`Enter your ${activeTab} module prompt here...`}
                                    className="w-full h-48 bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>{prompts[activeTab].length} characters</span>
                                    <button
                                        onClick={() => handleEnhancePrompt(activeTab)}
                                        className="text-blue-400 hover:text-blue-300 flex items-center"
                                    >
                                        <Zap className="h-3 w-3 mr-1" /> Enhance this prompt
                                    </button>
                                </div>
                            </div>

                            {/* Module Completion Status */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {Object.keys(prompts).map((module) => (
                                    <div
                                        key={module}
                                        className="bg-gray-800 rounded-md p-3 border-l-4 border-opacity-75"
                                        style={{
                                            borderLeftColor: prompts[module].length > 0 ? '#4ADE80' : '#6B7280'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {moduleIcons[module]}
                                                <span className="ml-2 capitalize text-sm">{module}</span>
                                            </div>
                                            <span className={`text-xs font-medium ${prompts[module].length > 0 ? 'text-green-400' : 'text-gray-400'
                                                }`}>
                                                {prompts[module].length > 0 ? 'Completed' : 'Incomplete'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 my-6">
                            <button
                                onClick={handlePreview}
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
                            >
                                <Play className="h-4 w-4" /> Test Your Agent
                            </button>
                            <button
                                onClick={handleDeploy}
                                disabled={!prompts.data || !prompts.decision || !prompts.execution}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${!prompts.data || !prompts.decision || !prompts.execution
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                                    }`}
                            >
                                Deploy Agent <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
                            >
                                <Save className="h-4 w-4" /> Save Draft
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Agent Templates */}
                        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-blue-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Agent Templates</h2>
                                <Grid className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                {templates.map((template, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
                                        <div
                                            className="p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                                            onClick={() => setExpandedTemplate(expandedTemplate === index ? null : index)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium text-blue-400">{template.title}</h3>
                                                <button className="text-gray-400 hover:text-white">
                                                    {expandedTemplate === index ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 15l-6-6-6 6" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M6 9l6 6 6-6" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-1">{template.description}</p>
                                        </div>

                                        {expandedTemplate === index && (
                                            <div className="px-4 pb-4">
                                                <div className="space-y-3">
                                                    {Object.entries(template.prompts).map(([module, prompt]) => (
                                                        <div key={module} className="bg-gray-900 p-3 rounded-md">
                                                            <div className="flex items-center mb-1">
                                                                {moduleIcons[module]}
                                                                <span className="ml-2 text-sm font-medium capitalize">{module} Module</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 line-clamp-2">{prompt}</p>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleTemplateSelect(template)}
                                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition-colors text-sm font-medium mt-2"
                                                    >
                                                        Use This Template
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Configuration Options */}
                        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-blue-700">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Code className="mr-2 h-5 w-5 text-green-400" />
                                Agent Configuration
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Response Speed</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['fast', 'standard', 'thorough'].map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => setResponseSpeed(speed)}
                                                className={`py-2 px-3 rounded-md capitalize text-sm ${responseSpeed === speed
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                {speed}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Transaction Confirmation</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['automatic', 'manual'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setConfirmationMode(mode)}
                                                className={`py-2 px-3 rounded-md capitalize text-sm ${confirmationMode === mode
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Risk Level</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['conservative', 'moderate', 'aggressive'].map((risk) => (
                                            <button
                                                key={risk}
                                                onClick={() => setRiskLevel(risk)}
                                                className={`py-2 px-2 rounded-md capitalize text-sm ${riskLevel === risk
                                                        ? risk === 'conservative' ? 'bg-blue-600 text-white' :
                                                            risk === 'moderate' ? 'bg-yellow-600 text-white' :
                                                                'bg-red-600 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                {risk}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Automation