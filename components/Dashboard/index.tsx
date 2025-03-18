import { LogOut, Plus, Book } from "react-feather";
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";

import AgentList from "./AgentList"
import useDatabase from "@/hooks/useDatabase";
import { CloudAgentContext } from "@/hooks/useCloudAgent";


// Portfolio Page Component
const Portfolio = () => {

    // const [ modal, setModal ] = useState(true)

    const router = useRouter()

    // Sample portfolio data
    // const portfolioData = [
    //     { id: 1, trader: "0x7fa9...82c3", allocation: 30, profit: 32.4, assets: ["APT", "USDC"], status: "active" },
    //     { id: 2, trader: "0x3e8d...76b1", allocation: 25, profit: 18.7, assets: ["APT", "BTC"], status: "active" },
    //     { id: 3, trader: "0xf42c...19a5", allocation: 20, profit: -4.2, assets: ["ETH", "USDC"], status: "paused" },
    //     { id: 4, trader: "0x8a1b...54e2", allocation: 15, profit: 7.8, assets: ["SOL", "USDT"], status: "active" },
    //     { id: 5, trader: "0x2d6f...91c7", allocation: 10, profit: 12.3, assets: ["APT", "BNB"], status: "active" },
    // ];

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (
        <div>
            {/* Main content */}
            <main className="container mx-auto px-6 py-8">
                {/* Portfolio header */}
                <div className="flex backdrop-blur-sm justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
                        <p className="text-gray-400">Track and manage your mirrored traders</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-blue-600 cursor-pointer to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                            <Plus className="mr-1.5" />
                            Add Web Wallet
                        </button>
                        <button onClick={handleSignOut} className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                            <LogOut className="mr-1.5" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Portfolio stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Total Value</div>
                        <div className="text-2xl font-bold">$12,456.78</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +14.5% (30d)
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Active Traders</div>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-blue-400 text-sm mt-1">80% of portfolio</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Net Profit</div>
                        <div className="text-2xl font-bold">$876.32</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +7.2% (7d)
                        </div>
                    </div>
                </div>

                {/* Traders table */}
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-white/10 flex flex-row">
                        <h2 className="text-xl my-auto font-semibold">Mirrored Traders</h2>
                        <button className="bg-gradient-to-r my-auto ml-auto from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Trader
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black/20">
                                    <th className="text-left p-4 font-medium text-gray-400">Trader Wallet</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Allocation</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Profit/Loss</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Assets</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {portfolioData.map((trader) => (
                                    <tr key={trader.id} className="border-t border-white/5 hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full mr-3 flex items-center justify-center text-xs">
                                                    {trader.id}
                                                </div>
                                                <span>{trader.trader}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">{trader.allocation}%</td>
                                        <td className="p-4">
                                            <span className={trader.profit >= 0 ? "text-green-400" : "text-red-400"}>
                                                {trader.profit >= 0 ? "+" : ""}{trader.profit}%
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-1">
                                                {trader.assets.map((asset) => (
                                                    <span key={asset} className="bg-blue-900/30 px-2 py-1 rounded text-xs">
                                                        {asset}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${trader.status === "active" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                                                }`}>
                                                {trader.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button className="p-1 text-gray-400 hover:text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-red-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance chart card */}
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-white/10 backdrop-blur-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                        <div className="flex space-x-2">
                            <button className="bg-blue-600/40 hover:bg-blue-600/60 px-3 py-1 rounded text-sm transition">7d</button>
                            <button className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-sm transition">30d</button>
                            <button className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-sm transition">All</button>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        {/* Placeholder for chart */}
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p>Performance chart will be displayed here</p>
                        </div>
                    </div>
                </div>
            </main>


        </div>
    );
};

const Dashboard = () => {

    const { listAgents } = useDatabase()
    const { profile } = useContext(CloudAgentContext)
    const [agents, setAgents] = useState<any[]>([])

    useEffect(() => {
        profile && listAgents(profile.id).then(setAgents)
    }, [profile])

    // const examples = [
    //     {
    //         id: 1,
    //         name: "Solana Swap Agent",
    //         status: "active",
    //         nextRun: "Today, 18:00",
    //         prompts: {
    //             dataIngestion: "Get SOL/USDC price from Jupiter aggregator and analyze 24h trend",
    //             decisionMaking: "If SOL price dropped more than 5% in last 24h and trading volume is above average, proceed to execution",
    //             execution: "Swap 10 USDC to SOL using Jupiter with 0.5% slippage tolerance"
    //         }
    //     },
    //     {
    //         id: 2,
    //         name: "ETH Staking Agent",
    //         status: "paused",
    //         nextRun: "Not scheduled",
    //         prompts: {
    //             dataIngestion: "Check current ETH staking APY across Lido, Rocket Pool, and native staking",
    //             decisionMaking: "If any provider offers >4.5% APY and has had stable returns for past 30 days",
    //             execution: "Stake 0.5 ETH with the highest yield provider"
    //         }
    //     },
    //     {
    //         id: 3,
    //         name: "Arbitrage Monitor",
    //         status: "active",
    //         nextRun: "Tomorrow, 06:00",
    //         prompts: {
    //             dataIngestion: "Compare USDC/SOL prices across Raydium, Orca, and Jupiter",
    //             decisionMaking: "If price difference >1.2% between any two DEXes after accounting for fees",
    //             execution: "Execute arbitrage trade with 50 USDC maximum position size"
    //         }
    //     }
    // ];



    return (
        <>

            {/* Main content */}
            <main className="container mx-auto px-6 py-8">
                {/* header */}
                <div className="flex backdrop-blur-sm justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-gray-400">Track and manage your Web3 AI agent</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-blue-600 cursor-pointer to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                            <Book className="mr-1.5" />
                            Documentation
                        </button>
                    </div>
                </div>

                {/* Portfolio stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Total Value</div>
                        <div className="text-2xl font-bold">$12,456.78</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +14.5% (30d)
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Total Agents</div>
                        <div className="text-2xl font-bold">
                            {agents.length}
                        </div>
                        <div className="text-blue-400 text-sm mt-1">{agents.length > 0 ? ((agents.filter(item => item.isActive).length / (agents.length)) * 100).toLocaleString() : 0}% are active</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Net Profit</div>
                        <div className="text-2xl font-bold">$876.32</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +7.2% (7d)
                        </div>
                    </div>
                </div>

                {/* Agent List */}
                <AgentList
                    agents={agents}
                />

                {/* Performance chart card */}
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-white/10 backdrop-blur-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                        <div className="flex space-x-2">
                            <button className="bg-blue-600/40 hover:bg-blue-600/60 px-3 py-1 rounded text-sm transition">7d</button>
                            <button className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-sm transition">30d</button>
                            <button className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-sm transition">All</button>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        {/* Placeholder for chart */}
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p>Performance chart will be displayed here</p>
                        </div>
                    </div>
                </div>
            </main>


        </>
    )
}

export default Dashboard