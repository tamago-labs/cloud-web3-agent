"use client"


import { CloudAgentContext } from '@/hooks/useCloudAgent';
import useDatabase from '@/hooks/useDatabase';
import React, { useState, useCallback, useEffect, useReducer, useRef, useContext } from 'react';
import { Send, Plus, Settings, Download, Copy, Trash, ChevronDown, PlayCircle } from "react-feather"
import AgentPanel from './AgentPanel';

const Automation = () => {

    const { listAgents, getAgent } = useDatabase()
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

    const increaseTick = useCallback(async () => {
        dispatch({ tick: tick + 1 })
        if (selected) {
            const agent = await getAgent(selected.id)
            dispatch({ selected: agent }) 
        }
    }, [tick, selected])

    useEffect(() => {
        profile && listAgents(profile.id).then(setAgents)
    }, [profile, tick])

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

export default Automation