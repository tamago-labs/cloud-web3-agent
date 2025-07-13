"use client"

import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward, Play } from "react-feather"
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
import { getStatusBadge, getSdkName } from "@/helpers/getter"

enum Modal {
    NONE,
    SETTINGS
}

const Agent = ({ agentId }: any) => {

    // const { getAgent } = useDatabase()

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

    // useEffect(() => {
    //     agentId && getAgent(agentId).then(setAgent)
    // }, [agentId, tick])

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
                    <div className="flex-1">
                        <div className="h-[90px] px-6 py-4 border-b border-white/10 flex flex-col  bg-blue-900/30 ">
                            <div className="flex justify-between items-center my-auto">
                                <div className="flex flex-row w-full ">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 my-auto bg-gradient-to-br from-indigo-600/40 to-purple-600/40 rounded-full mr-3 flex items-center justify-center text-white font-bold shadow-md">
                                            {getId(agent.name)}
                                        </div>
                                        <h1 className="text-2xl my-auto font-bold text-white">
                                            {agent.name}
                                        </h1>
                                        {/* <span className="ml-2   bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                                            {getSdkName(agent.blockchain, agent.sdkType)}
                                        </span> */}
                                    </div>
                                    {/* <div className="ml-auto flex space-x-2">
                                        <span className="flex capitalize items-center h-[28px] my-auto bg-indigo-900 border text-gray-200 border-indigo-700 px-3 rounded-md text-xs shadow-sm  ">
                                            {agent.blockchain}
                                        </span>
                                        <span className="flex items-center h-[28px] my-auto bg-indigo-900  border text-gray-200 border-indigo-700 px-3 rounded-md text-xs shadow-sm  ">
                                            {getSdkName(agent.blockchain, agent.sdkType)}
                                        </span>
                                    </div> */}
                                    {/* <div className=" ml-auto  flex items-center">
                                        <div className="flex items-center bg-indigo-900  border border-indigo-700 px-3 py-1.5 rounded-md text-sm  transition-colors duration-200 cursor-pointer shadow-sm  ">
                                            <CopyToClipboard text={agent?.walletAddresses[0] || ""}>
                                                <div className="flex items-center group">
                                                    <span className="text-xs text-gray-200">{shortAddress(agent?.walletAddresses[0], 10, -8)}</span>
                                                    <button className="ml-2 text-gray-400 group-hover:text-white transition-colors duration-200">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </CopyToClipboard>
                                           
                                        </div>
                                         {agent.blockchain === "aptos" && (
                                                <a href={`https://explorer.aptoslabs.com/account/${agent?.walletAddresses[0] || ""}?network=${agent.isTestnet ? "testnet" : "mainnet"}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2  my-auto text-gray-200 "
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            )

                                            }
                                    </div> */}
                                </div>
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
                        <div className="h-[90px] px-3  border-b border-white/10 flex flex-col  bg-blue-900/30 ">
                            {/* <AgentCountdown agent={agent} /> */}
                            <div className=" ml-auto my-auto px-4 flex items-center space-x-2">
                                {/* <span className="flex capitalize items-center h-[28px] my-auto bg-indigo-900 border text-gray-200 border-indigo-700 px-3 rounded-md text-xs shadow-sm  ">
                                    {agent.blockchain}
                                </span> */}
                                {/* <span className="flex items-center h-[28px] my-auto bg-indigo-900  border text-gray-200 border-indigo-700 px-3 rounded-md text-xs shadow-sm  ">
                                    {getSdkName(agent.blockchain, agent.sdkType)}
                                </span> */}
                                <div className="flex items-center bg-indigo-900  border border-indigo-700 px-3 py-1.5 rounded-md text-sm  transition-colors duration-200 cursor-pointer shadow-sm  ">
                                    <CopyToClipboard text={agent?.walletAddresses[0] || ""}>
                                        <div className="flex items-center group">
                                            <span className="text-xs text-gray-200 ">{shortAddress(agent?.walletAddresses[0], 10, -8)}</span>
                                            <button className="ml-2 text-gray-400 group-hover:text-white transition-colors duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </CopyToClipboard>

                                </div>
                                {agent.blockchain === "aptos" && (
                                    <a href={`https://explorer.aptoslabs.com/account/${agent?.walletAddresses[0] || ""}?network=${agent.isTestnet ? "testnet" : "mainnet"}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center bg-indigo-900 border text-gray-400 hover:text-gray-200 border-indigo-700 px-3 py-1.5 rounded-md text-sm  transition-colors duration-200 cursor-pointer shadow-sm  "
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )

                                }
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

export const AgentCountdown = ({ agent, onPause, onStart }: any) => {

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
        <div className="flex flex-row w-full text-white items-center justify-between p-4 px-0 ">
            {/* Left side - Control buttons */}
            <div className="flex items-center space-x-3">
                {agent.isActive ? (
                    <button
                        onClick={onPause}
                        className="flex items-center  cursor-pointer space-x-2 px-4 py-2 bg-white hover:bg-gray-200 text-gray-900 rounded-md transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="6" width="12" height="12" strokeWidth="2" />
                        </svg>
                        <span className="font-medium">Stop Automation</span>
                    </button>
                ) : (
                    <button
                        onClick={onStart}
                        className="flex items-center cursor-pointer space-x-1 px-4 py-2 bg-white hover:bg-gray-200  text-gray-900 rounded-md transition-colors duration-200"
                    >
                        <Play size={20} />
                        <span className="font-medium">Start Automation</span>
                    </button>
                )}

                <div className="flex items-center px-3 py-1 bg-gray-800 rounded-md">
                    <div className={`w-3 h-3 rounded-full mr-2 ${agent.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">{agent.isActive ? 'Running' : 'Stopped'}</span>
                </div>
            </div>


            {/* Right side - Timer */}
            <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-white">Next Run In</div>
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-900 border border-indigo-700 rounded-md px-3 py-2 text-xl font-bold text-white min-w-[3rem] text-center">
                            {timeLeft.hours}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 uppercase">Hours</span>
                    </div>

                    <div className="text-2xl font-bold text-indigo-500 -mt-5">:</div>

                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-900 border border-indigo-700 rounded-md px-3 py-2 text-xl font-bold text-white min-w-[3rem] text-center">
                            {timeLeft.minutes}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 uppercase">Minutes</span>
                    </div>

                    <div className="text-2xl font-bold text-indigo-500 -mt-5">:</div>

                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-900 border border-indigo-700 rounded-md px-3 py-2 text-xl font-bold text-white min-w-[3rem] text-center">
                            {timeLeft.seconds}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 uppercase">Seconds</span>
                    </div>
                </div>
            </div>


            {/* <div className="text-lg my-auto font-semibold text-white ">Next Run In</div>
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
            </div> */}

        </div>
    );
};

export default Agent