"use client"

import { Zap, Bot, Shield } from "lucide-react"

const MCPSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            </div> */}
            {/* Animated Blobs */}
            {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div> */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How it Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        From strategy definition to secure execution, our AI agents handle the complexity while you maintain control
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Data via MCP</h3>
                        <p className="text-gray-600 text-sm">Model Context Protocol (MCP) servers provide live access to lending rates, pool liquidity, TVL, and protocol health metrics across chains.</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Driven Decisions</h3>
                        <p className="text-gray-600 text-sm">Agents analyze MCP data to make intelligent decisions about when to leverage, de-leverage, or rebalance positions based on your strategy.</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">TEE Secure Execution</h3>
                        <p className="text-gray-600 text-sm">Transactions are signed within AWS Nitro Enclaves and Phala Network TEE, ensuring your private keys never leave the secure environment.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-4">Complete Workflow</h3>
                    <ol className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                            <span className="text-blue-400 font-bold mr-3 flex-shrink-0">1.</span>
                            <span>You define your strategy in natural language (e.g., "maintain 2x leverage on APT")</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 font-bold mr-3 flex-shrink-0">2.</span>
                            <span>AI agent connects to relevant MCP servers for real-time protocol data</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 font-bold mr-3 flex-shrink-0">3.</span>
                            <span>Agent analyzes conditions and determines optimal actions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 font-bold mr-3 flex-shrink-0">4.</span>
                            <span>Transactions are prepared and signed within TEE (AWS Nitro/Phala)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 font-bold mr-3 flex-shrink-0">5.</span>
                            <span>Signed transactions are broadcast to the blockchain for execution</span>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    )
}

export default MCPSection
