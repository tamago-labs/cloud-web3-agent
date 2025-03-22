import { LogOut, Plus, Book, Info, ExternalLink } from "react-feather";
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";

import AgentList from "./AgentList"
import useDatabase from "@/hooks/useDatabase";
import { CloudAgentContext } from "@/hooks/useCloudAgent";
import DashboardModal from "@/modals/dashboard";

import Link from "next/link";

const Dashboard = () => {

    const [modal, setModal] = useState(false)

    const { listAgents } = useDatabase()
    const { profile } = useContext(CloudAgentContext)
    const [agents, setAgents] = useState<any[]>([])

    useEffect(() => {
        profile && listAgents(profile.id).then(setAgents)
    }, [profile])

    useEffect(() => {

        if (localStorage.getItem("welcome")) {

        } else {
            localStorage.setItem("welcome", "on")
            setModal(true)
        }

    }, [])


    return (
        <>

            <DashboardModal
                visible={modal}
                close={() => setModal(false)}
            />

            {/* Main content */}
            <main className="container mx-auto px-6 py-8">
                {/* header */}
                <div className="flex backdrop-blur-sm justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-gray-400">Track and manage your Web3 AI agent</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="https://docs.tamagolabs.com/" target="_blank">
                            <button className="  cursor-pointer bg-white  text-gray-900 px-4 py-2 rounded-lg font-medium transition flex items-center">
                                <ExternalLink className="mr-1.5  text-gray-900 " />
                                Docs
                            </button>
                        </Link>

                    </div>
                </div>

                {/* Portfolio stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="text-gray-400 mb-1">Total Value</div>
                        <div className="text-2xl font-bold">$0.0</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +0.0% (30d)
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
                        <div className="text-2xl font-bold">$0.0</div>
                        <div className="text-green-400 text-sm mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            +0.0% (7d)
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