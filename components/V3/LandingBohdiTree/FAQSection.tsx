"use client"

import { useState } from "react"

const FAQSection = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    const faqs = [
        {
            question: "What makes Bodhi Tree different from other DeFi tools?",
            answer: "Bodhi Tree is purpose-built for autonomous DeFi protocol automation, not just trading. While other tools focus on swaps and basic trading, we specialize in complex DeFi operations like lending, borrowing, leverage management, and yield optimization—all executed autonomously by AI agents."
        },
        {
            question: "How does the AI agent work?",
            answer: "You set your strategy parameters in natural language (e.g., 'maintain 2x leverage on APT with auto-deleveraging at 1.5 health factor'). The AI agent continuously monitors market conditions, executes transactions within your defined rules, and manages risk 24/7. All transactions are signed securely within TEE (Trusted Execution Environments)."
        },
        {
            question: "Is my private key safe?",
            answer: "Yes. Your private key never leaves the secure Trusted Execution Environment (TEE). We use AWS Nitro Enclave and Phala Network TEE infrastructure, which provides hardware-level isolation. Even Bodhi Tree operators and AWS administrators cannot access your keys. All transaction signing happens within the encrypted enclave."
        },
        {
            question: "What protocols and chains are supported?",
            answer: "We support 100+ DeFi protocols across 20+ chains including Ethereum, Aptos, Sui, Base, Optimism, and other EVM-compatible networks. MCP servers cover Lending, DEX, Staking, and Multi-Chain protocols with real-time data access. Protocol support includes major platforms like Aave, Compound, and many more, with new integrations added regularly."
        },
        {
            question: "Do I need to know how to code?",
            answer: "No coding required. You create strategies using natural language prompts. Simply describe what you want to achieve (e.g., 'optimize yield across top 3 protocols' or 'protect my position from liquidation'), and the AI agent handles the technical execution."
        },
        {
            question: "Can I stop the agent at any time?",
            answer: "Absolutely. You maintain full control. You can pause, modify, or stop any strategy at any time through the dashboard. Emergency stop functions are built-in for immediate position closure if needed."
        },
        {
            question: "What is MCP and how does it work with Bodhi Tree?",
            answer: "MCP (Model Context Protocol) allows AI agents to access real-time data from various DeFi protocols. Bodhi Tree uses curated MCP servers to fetch on-chain data, protocol metrics, and market conditions. This enables the AI to make informed decisions based on current blockchain state and protocol health."
        },
        {
            question: "Who develops and maintains Bodhi Tree?",
            answer: "Bodhi Tree is developed and maintained by Tamago Blockchain Labs, Co. Ltd. (https://tamagolabs.com), a Web3 software development company based in Japan."
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
             
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about Bodhi Tree
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${expandedFaq === index ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedFaq === index && (
                                <div className="px-6 pb-5">
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQSection
