"use client"

import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward } from "react-feather"
import { shortAddress } from "@/helpers"
import { useEffect, useState, useReducer, useCallback } from "react"
import Loading from "../Loading"
import useDatabase from "@/hooks/useDatabase"
import AgentSettingsModal from "@/modals/agentSettings"
import ChatPanel from "./ChatPanel"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Configuration from "./Configuration"
import { secondsToDDHHMMSS } from "../../helpers"
import { useInterval } from "@/hooks/useInterval";

enum Modal {
    NONE,
    SETTINGS
}

const Agent = ({ agentId }: any) => {

    const { getAgent } = useDatabase()

    const [agent, setAgent] = useState<any>()

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            loading: false,
            modal: Modal.NONE,
            tick: 1
        }
    )

    const { modal, loading, tick } = values

    useEffect(() => {
        agentId && getAgent(agentId).then(setAgent)
    }, [agentId, tick])

    const increaseTick = useCallback(() => {
        dispatch({ tick: tick + 1 })
    }, [tick])

    const getId = (name: string) => {
        let id = "#"
        if (name && name[0]) {
            id = (name[0]).toLocaleUpperCase()
        }
        return id
    }

    return (
        <div className="h-screen">
            {!agent && (
                <Loading />
            )}

            <AgentSettingsModal
                visible={modal === Modal.SETTINGS}
                close={() => dispatch({ modal: Modal.NONE })}
                agent={agent}
                increaseTick={increaseTick}
            />

            {agent && (
                <div className="flex flex-row">
                    {/* <div className="h-24 px-6 py-4 border-b border-white/10 flex flex-col bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                        <div className="flex    justify-between items-center mb-8">

                            <div className="mt-0.5 ">
                                <div className="flex flex-row">
                                    <div className="w-8 h-8 my-auto bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full mr-3 flex items-center justify-center text-sm font-bold">
                                        {getId(agent.name)}
                                    </div>
                                    <h1 className="text-2xl my-auto font-bold">
                                        {agent.name}
                                    </h1>
                                </div>

                                <p className="text-gray-400 mt-2 inline-flex">
                                    <span className="w-2 h-2 my-auto bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-sm text-gray-400 mr-1">Active • Move Agent Kit •</span>
                                    <span className="text-sm text-gray-400">{shortAddress(agent?.walletAddresses[0], 10, -8)} </span>
                                </p>
                            </div>
                            <div className="ml-auto  flex items-center space-x-3">

                                <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                    <Tool size={22} />
                                </button>
                                <button onClick={() => dispatch({ modal: Modal.SETTINGS })} className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                    <Settings size={22} />
                                </button>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex-1">
                        <div className="h-[90px] px-6 py-4 border-b border-white/10 flex flex-col  bg-blue-900/30 ">
                            <div className="flex  justify-between items-center  ">

                                <div className="my-auto">
                                    <div className="flex flex-row">
                                        <div className="w-8 h-8 my-auto bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full mr-3 flex items-center justify-center text-sm font-bold">
                                            {getId(agent.name)}
                                        </div>
                                        <h1 className="text-2xl my-auto font-bold">
                                            {agent.name}
                                        </h1>
                                    </div>
                                    <p className="text-gray-400 mt-2 inline-flex">
                                        <span className={`w-2 h-2 my-auto ${agent.isActive ? "bg-green-500" : "bg-orange-400"} rounded-full mr-2`}></span>
                                        <span className="text-sm my-auto text-gray-400 mr-1">{agent.isActive ? "Active" : "Paused"} • Move Agent Kit •</span>
                                        <CopyToClipboard text={agent?.walletAddresses[0] || ""}>
                                            <div className="flex flex-row my-auto cursor-pointer hover:underline ">
                                                <span className="text-sm my-auto text-gray-400">{shortAddress(agent?.walletAddresses[0], 10, -8)} </span>
                                                <button className="p-1 my-auto cursor-pointer  text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </CopyToClipboard>
                                        <a
                                            href={`https://explorer.aptoslabs.com/account/${agent?.walletAddresses[0] || ""}?network=${agent.isTestnet ? "testnet" : "mainnet"}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="  my-auto text-gray-400 "
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </p>
                                </div>
                                {/* <div className="ml-auto  flex items-center space-x-3">
                                    <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                        <Tool size={22} />
                                    </button>
                                    <button onClick={() => dispatch({ modal: Modal.SETTINGS })} className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                        <Settings size={22} />
                                    </button>
                                </div> */}
                            </div>
                        </div>
                        <div className="h-[calc(100vh-90px)] ">
                            <ChatPanel
                                agent={agent}
                                increaseTick={increaseTick}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="h-[90px] px-6 py-4 border-b border-white/10 flex flex-col  bg-blue-900/30 ">
                            <div className="flex  my-auto justify-between items-center ">
                                <div className="ml-auto my-auto flex items-center space-x-3">
                                    {/* <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                        <Tool size={22} />
                                    </button> */}
                                    {/* <button onClick={() => dispatch({ modal: Modal.SETTINGS })} className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                                        <Settings size={22} />
                                    </button> */}
                                    <AgentCountdown agent={agent} />
                                </div>
                            </div>
                        </div>
                        <div className="h-[calc(100vh-90px)] ">
                            <Configuration
                                agent={agent}
                                increaseTick={increaseTick}
                            />
                        </div>
                    </div>
                </div>
            )

            }

        </div>
    )
}

const AgentCountdown = ({ agent }: any) => {

    const [timeLeft, setTimeLeft] = useState<any>({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Calculate time left based on future timestamp
    function calculateTimeLeft(agent: any) {

        if (agent.isActive && agent.lastRanAt) {
            const diffTime = ((agent.lastRanAt + agent.schedule) * 1000) - (new Date()).valueOf()
            const totals = Math.floor(diffTime / 1000)
            const { hours, minutes, seconds } = secondsToDDHHMMSS(totals)
            setTimeLeft({
                hours,
                minutes,
                seconds
            })

        } else {
            setTimeLeft({
                hours: 0,
                minutes: 0,
                seconds: 0
            })
        }


    }

    // Update countdown every second 
    useInterval(() => {
        calculateTimeLeft(agent)
    }, 1000)

    return (
        <div className="flex flex-row text-white items-end justify-center space-x-2">
            <div className="text-lg my-auto font-semibold text-white ">Next Run In</div>
            <div className="flex items-center">
                <div className="flex flex-col items-center">
                    <div className="bg-gray-800 rounded-md px-2 py-1 text-lg font-medium text-white">
                        {timeLeft.hours}
                    </div>
                    <span className="text-sm text-gray-400 mt-1">Hours</span>
                </div>
                <span className="mx-1 text-gray-400 text-xl">:</span>
                <div className="flex flex-col items-center">
                    <div className="bg-gray-800 rounded-md px-2 py-1 text-lg font-medium text-white">
                    {timeLeft.minutes}
                    </div>
                    <span className="text-sm text-gray-400 mt-1">Mins</span>
                </div>
                <span className="mx-1 text-gray-400 text-xl">:</span>
                <div className="flex flex-col items-center">
                    <div className="bg-gray-800 rounded-md px-2 py-1 text-lg font-medium text-white">
                    {timeLeft.seconds}
                    </div>
                    <span className="text-sm text-gray-400 mt-1">Secs</span>
                </div>
            </div>

        </div>
    );
};

export default Agent