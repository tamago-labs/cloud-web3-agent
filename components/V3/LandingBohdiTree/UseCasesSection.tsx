"use client"

import { useState } from "react"

const UseCasesSection = () => {
    const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null)

    const strategies = [
        {
            id: "leverage",
            name: "Automated Leverage",
            description: "Supply collateral to lending pools, borrow stablecoins, and swap back to increase exposure. AI manages leverage ratios dynamically based on market conditions.",
            icon: "📈",
            color: "from-blue-500 to-indigo-600",
            example: "Supply APT → Borrow USDC → Swap to APT → Repeat"
        },
        {
            id: "yield",
            name: "Yield Optimization",
            description: "Automatically move funds between protocols to capture the highest APY. AI monitors rates across multiple platforms and rebalances positions.",
            icon: "💰",
            color: "from-green-500 to-emerald-600",
            example: "Monitor Aave, Compound, Venus → Auto-migrate to best rates"
        },
        {
            id: "deleverage",
            name: "Risk Management",
            description: "Detect protocol vulnerabilities and market risks. Automatically de-leverage or exit positions before liquidation or exploits occur.",
            icon: "🛡️",
            color: "from-red-500 to-pink-600",
            example: "Monitor health factor → Auto de-leverage at 1.5x → Exit on anomalies"
        },
        {
            id: "rebalance",
            name: "Portfolio Rebalancing",
            description: "Maintain target allocations across DeFi positions. AI rebalances based on price movements and portfolio drift thresholds.",
            icon: "⚖️",
            color: "from-purple-500 to-violet-600",
            example: "Target: 60% ETH, 40% Stables → Auto-rebalance on ±5% drift"
        },
        {
            id: "arbitrage",
            name: "Cross-Chain Arbitrage",
            description: "Identify and execute arbitrage opportunities across different chains and DEXs. AI handles bridging and optimal routing.",
            icon: "🔄",
            color: "from-orange-500 to-amber-600",
            example: "ETH on Uniswap vs PancakeSwap → Bridge & arbitrage"
        },
        {
            id: "liquidation",
            name: "Liquidation Protection",
            description: "Monitor collateral health factors across all positions. Automatically add collateral or close positions to prevent liquidation.",
            icon: "🔐",
            color: "from-teal-500 to-cyan-600",
            example: "Watch health factor < 1.3 → Auto-add collateral or close position"
        }
    ]

    return (
        <section id="use-cases" className="py-24 bg-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Automated DeFi Strategies
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Set your goals in plain English. AI handles the complex execution.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map((strategy) => (
                        <div
                            key={strategy.id}
                            className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                            onMouseEnter={() => setHoveredStrategy(strategy.id)}
                            onMouseLeave={() => setHoveredStrategy(null)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            
                            <div className="relative p-6">
                                <div className="text-5xl mb-4">{strategy.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {strategy.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {strategy.description}
                                </p>
                                
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="text-xs text-gray-500 font-semibold mb-1">Example:</div>
                                    <div className="text-xs text-gray-700 font-mono leading-relaxed">
                                        {strategy.example}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">...and more strategies coming soon.</span> Governance participation, 
                        tax-loss harvesting, and custom prompt-based strategies.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default UseCasesSection
