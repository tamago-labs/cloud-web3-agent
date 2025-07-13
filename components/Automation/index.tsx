"use client"

import { CloudAgentContext } from '@/hooks/useCloudAgent';
import useDatabase from '@/hooks/useDatabase';
import React, { useState, useCallback, useEffect, useReducer, useRef, useContext } from 'react';
import { Send, Plus, Settings, Download, Copy, Trash, Edit, MessageSquare, ChevronDown, PlayCircle, Calendar, Menu, Play, Pause } from "react-feather"
import AgentPanel from './AgentPanel';
import useTest from '@/hooks/useTest';

const Automation = () => {

    // const { listAgents, getAgent } = useDatabase()
    const { profile } = useContext(CloudAgentContext)
    const [agents, setAgents] = useState<any[]>([])

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            selected: undefined,
            tick: 1
        }
    )

    const { selected, tick } = values

    const setSelected = (entry: any) => {
        dispatch({ selected: entry })
    }

    // const increaseTick = useCallback(async () => {
    //     dispatch({ tick: tick + 1 })
    //     if (selected) {
    //         const agent = await getAgent(selected.id)
    //         dispatch({ selected: agent })
    //     }
    // }, [tick, selected])

    // useEffect(() => {
    //     profile && listAgents(profile.id).then(setAgents)
    // }, [profile, tick])

    return (
        <div className="flex h-screen relative">
            <div className="w-64  border-r border-white/10 flex flex-col bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                <div className="p-4 ">
                    <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <Plus size={16} className="mr-2" />
                        New Conversation
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto ">
                    {agents.map((entry, index) => (
                        <div
                            key={entry.id}
                            onClick={() => setSelected(entry)}
                            className={`p-3 border-t border-white/10 hover:bg-white/5 cursor-pointer ${(agents.length - 1 === index) && "border-b"}  ${selected && (entry.id === selected.id) ? ' bg-white/5 ' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className={`font-medium  `}>{entry.name} </span>
                                </div>
                                <span className="text-xs text-gray-400">{entry?.timestamp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">

                {!selected &&
                    <div className=" m-auto  bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg text-center shadow p-6 px-12 w-[400px] font-semibold">
                        No agent selected
                    </div>
                }

                {selected && (
                    <AgentPanel
                        agent={selected}
                        increaseTick={increaseTick}
                    />
                )}

            </div>
        </div>
    )
}

const AutomationNew = () => {

    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<any>('dataIngestion');
    // const { getTools } = useTest()

    const agents = [
        {
            id: 1,
            name: "Solana Swap Agent",
            status: "active",
            nextRun: "Today, 18:00",
            prompts: {
                dataIngestion: "Get SOL/USDC price from Jupiter aggregator and analyze 24h trend",
                decisionMaking: "If SOL price dropped more than 5% in last 24h and trading volume is above average, proceed to execution",
                execution: "Swap 10 USDC to SOL using Jupiter with 0.5% slippage tolerance"
            }
        },
        {
            id: 2,
            name: "ETH Staking Agent",
            status: "paused",
            nextRun: "Not scheduled",
            prompts: {
                dataIngestion: "Check current ETH staking APY across Lido, Rocket Pool, and native staking",
                decisionMaking: "If any provider offers >4.5% APY and has had stable returns for past 30 days",
                execution: "Stake 0.5 ETH with the highest yield provider"
            }
        },
        {
            id: 3,
            name: "Arbitrage Monitor",
            status: "active",
            nextRun: "Tomorrow, 06:00",
            prompts: {
                dataIngestion: "Compare USDC/SOL prices across Raydium, Orca, and Jupiter",
                decisionMaking: "If price difference >1.2% between any two DEXes after accounting for fees",
                execution: "Execute arbitrage trade with 50 USDC maximum position size"
            }
        }
    ];

    const handleAgentSelect = (agent: any) => {
        setSelectedAgent(agent);
        setActiveTab('dataIngestion');
    };

    const getStatusBadge = (status: any) => {
        switch (status) {
            case 'active':
                return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
            case 'paused':
                return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Paused</span>;
            case 'error':
                return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Error</span>;
            default:
                return null;
        }
    };



    return (
        <div className="flex min-h-screen bg-gray-50"> 

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Your Agents</h2>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600">
                            + New Automation
                        </button>
                    </div>

                    {/* Agent List */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Agent Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Next Run</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {agents.map((agent : any) => (
                                    <tr
                                        key={agent.id}
                                        className={`${selectedAgent?.id === agent.id ? 'bg-indigo-50' : 'hover:bg-gray-50'} cursor-pointer`}
                                        onClick={() => handleAgentSelect(agent)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(agent.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {agent.nextRun}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-1 text-gray-600 hover:text-indigo-600">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-gray-600 hover:text-indigo-600">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {agent.status === 'active' ? (
                                                    <button className="p-1 text-gray-600 hover:text-red-600">
                                                        <Pause className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button className="p-1 text-gray-600 hover:text-green-600">
                                                        <Play className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-1 text-gray-600 hover:text-red-600">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Agent Configuration Panel */}
                    {selectedAgent && (
                        <div className="p-6 bg-gray-50 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Configure: {selectedAgent.name}</h3>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                                        Test
                                    </button>
                                    <button className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600">
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex mb-4 space-x-4">
                                <button
                                    onClick={() => setActiveTab('dataIngestion')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'dataIngestion'
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Data Ingestion
                                </button>
                                <button
                                    onClick={() => setActiveTab('decisionMaking')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'decisionMaking'
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Decision Making
                                </button>
                                <button
                                    onClick={() => setActiveTab('execution')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'execution'
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Execution
                                </button>
                            </div>

                            {/* Prompt Editor */}
                            <div className="mt-4">
                                <textarea
                                    className="w-full h-32 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder={`Enter your ${activeTab} prompt...`}
                                    value={selectedAgent.prompts[activeTab]}
                                ></textarea>
                            </div>

                            {/* Schedule Settings */}
                            <div className="mt-4">
                                <h4 className="mb-2 text-sm font-medium text-gray-700">Schedule</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="oneTime"
                                            name="schedule"
                                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="oneTime" className="ml-2 text-sm text-gray-700">
                                            One-time
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="recurring"
                                            name="schedule"
                                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            checked
                                        />
                                        <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
                                            Recurring
                                        </label>
                                    </div>
                                    <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500">
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Custom</option>
                                    </select>
                                    <input
                                        type="time"
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                                        value="18:00"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Panel (could be implemented as a separate component or modal) */}
                {selectedAgent && (
                    <div className="mt-6 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-medium text-gray-900">Chat with {selectedAgent.name}</h3>
                            <button className="p-1 text-gray-500 rounded hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto border-b">
                            <div className="flex flex-col space-y-3">
                                <div className="self-start max-w-md p-3 text-sm bg-gray-100 rounded-lg">
                                    Hello! I'm your {selectedAgent.name}. How can I assist you today?
                                </div>
                                <div className="self-end max-w-md p-3 text-sm text-white bg-indigo-500 rounded-lg">
                                    Show me the current status of your automation task.
                                </div>
                                <div className="self-start max-w-md p-3 text-sm bg-gray-100 rounded-lg">
                                    I'm currently {selectedAgent.status === 'active' ? 'active' : 'paused'} and scheduled to run {selectedAgent.nextRun.toLowerCase()}. My task is to {selectedAgent.prompts.dataIngestion.toLowerCase()}. Would you like me to run a test now?
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Type your message..."
                                />
                                <button className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-r-md hover:bg-indigo-600">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Automation