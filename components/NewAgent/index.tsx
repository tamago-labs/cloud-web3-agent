"use client"

import React, { useState, useReducer, useCallback, useContext, useEffect } from 'react';
import { ChevronDown, Zap, ArrowRight, Check, Plus } from 'react-feather';
import type { Schema } from "../../amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import { Puff } from 'react-loading-icons'
import { CloudAgentContext } from '@/hooks/useCloudAgent';
import { useRouter } from "next/navigation";
import BaseModal from '@/modals/base';
import useDatabase from '@/hooks/useDatabase';


const client = generateClient<Schema>()

// const NewAgentOLD = () => {

//     const [selectedBlockchain, setSelectedBlockchain] = useState(null);
//     const [selectedSDK, setSelectedSDK] = useState(null);
//     const [agentName, setAgentName] = useState('');
//     const [agentDescription, setAgentDescription] = useState('');

//     const blockchains: any = [
//         { id: 'solana', name: 'Solana', icon: '◎', color: 'bg-purple-500' },
//         { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', color: 'bg-blue-500' },
//         { id: 'near', name: 'NEAR Protocol', icon: 'Ⓝ', color: 'bg-teal-500' },
//         { id: 'aptos', name: 'Aptos', icon: '𝔸', color: 'bg-indigo-500' }
//     ];

//     const sdkOptions: any = {
//         solana: [
//             { id: 'agent-kit', name: 'Solana Agent Kit', description: 'Official Solana AI agent toolkit for on-chain activities' },
//             { id: 'xray-sdk', name: 'X-Ray SDK', description: 'Enhanced toolkit with advanced transaction capabilities' },
//             { id: 'custom', name: 'Custom Configuration', description: 'Manually configure agent capabilities and permissions' }
//         ],
//         ethereum: [
//             { id: 'eth-agent', name: 'Ethereum Agent Kit', description: 'Standard agent toolkit for Ethereum blockchain' },
//             { id: 'custom', name: 'Custom Configuration', description: 'Manually configure agent capabilities and permissions' }
//         ],
//         near: [
//             { id: 'near-ai', name: 'NEAR AI Toolkit', description: 'Official NEAR Protocol AI agent development kit' }
//         ],
//         aptos: [
//             { id: 'aptos-kit', name: 'Aptos Agent Kit', description: 'Aptos-native agent development toolkit' }
//         ]
//     };

//     const handleBlockchainSelect = (blockchain: any) => {
//         setSelectedBlockchain(blockchain);
//         setSelectedSDK(null);
//     };

//     const handleSDKSelect = (sdk: any) => {
//         setSelectedSDK(sdk);
//     };

//     const handleCreateAgent = () => {
//         console.log('Creating agent with:', {
//             name: agentName,
//             description: agentDescription,
//             blockchain: selectedBlockchain,
//             sdk: selectedSDK
//         });
//     };

//     return (
//         <div className="relative mx-auto px-6 py-8 max-w-4xl">
//             <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
//             <p className="text-gray-400 mb-8">Configure and deploy a new Web3 AI agent</p>

//             <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
//                 <h2 className="text-xl  font-semibold mb-4">Agent Information</h2>
//                 <div className="space-y-4">
//                     <div>
//                         <label htmlFor="agent-name" className="block text-gray-400 text-sm font-medium   mb-1">
//                             Agent Name
//                         </label>
//                         <input
//                             id="agent-name"
//                             type="text"
//                             value={agentName}
//                             onChange={(e) => setAgentName(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="My Solana Agent"
//                         />
//                     </div> 
//                 </div>
//             </div>

//             <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-4">Step 1: Select Blockchain</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {blockchains.map((blockchain: any) => (
//                         <div
//                             key={blockchain.id}
//                             className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedBlockchain === blockchain.id
//                                 ? 'border-blue-500 ring-2 ring-blue-200'
//                                 : 'border-gray-200 hover:border-blue-300'
//                                 }`}
//                             onClick={() => handleBlockchainSelect(blockchain.id)}
//                         >
//                             <div className="flex items-center">
//                                 <div className={`w-10 h-10 ${blockchain.color} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
//                                     {blockchain.icon}
//                                 </div>
//                                 <div>
//                                     <h3 className="font-medium">{blockchain.name}</h3>
//                                     {selectedBlockchain === blockchain.id && (
//                                         <span className="text-blue-600 text-sm flex items-center">
//                                             <Check size={16} className="mr-1" /> Selected
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {selectedBlockchain && (
//                 <div className="mb-8 bg-white rounded-lg shadow p-6">
//                     <h2 className="text-xl font-semibold mb-4">Step 2: Select SDK</h2>
//                     <div className="space-y-3">
//                         {sdkOptions[selectedBlockchain].map((sdk: any) => (
//                             <div
//                                 key={sdk.id}
//                                 className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedSDK === sdk.id
//                                     ? 'border-blue-500 bg-blue-50'
//                                     : 'border-gray-200 hover:border-blue-300'
//                                     }`}
//                                 onClick={() => handleSDKSelect(sdk.id)}
//                             >
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="font-medium">{sdk.name}</h3>
//                                         <p className="text-sm text-gray-600">{sdk.description}</p>
//                                     </div>
//                                     {selectedSDK === sdk.id ? (
//                                         <Check size={20} className="text-blue-600" />
//                                     ) : (
//                                         <ChevronDown size={20} className="text-gray-400" />
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="flex justify-between items-center">
//                 <p className="text-sm text-gray-500">
//                     Additional configuration can be done in the Automation tab after creation.
//                 </p>
//                 <button
//                     onClick={handleCreateAgent}
//                     disabled={!selectedBlockchain || !selectedSDK || !agentName}
//                     className={`flex items-center px-6 py-3 rounded-lg font-medium ${selectedBlockchain && selectedSDK && agentName
//                         ? 'bg-blue-600 text-white hover:bg-blue-700'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         }`}
//                 >
//                     <Zap size={18} className="mr-2" />
//                     Create Agent
//                     <ArrowRight size={18} className="ml-2" />
//                 </button>
//             </div>
//         </div>
//     )
// }

const NewAgent = () => {

    const { listAgents } = useDatabase()

    const router = useRouter()

    const { profile } = useContext(CloudAgentContext)

    const blockchains: any = [
        { id: 'aptos', name: 'Aptos', icon: "/assets/images/aptos-icon.png" },
        { id: 'solana', name: 'Solana', icon: "/assets/images/solana-icon.png" },
        { id: 'cronos', name: 'Cronos', icon: "/assets/images/cronos-icon.png" }
    ];

    const sdkOptions: any = {
        aptos: [
            { id: 'aptos-kit', disabled: false, name: 'Move Agent Kit', description: 'A comprehensive toolkit designed to simplify AI agents interactions with Move-based blockchains.' }
        ],
        solana: [
            { id: 'agent-kit', disabled: true, name: 'SendAI Solana Agent Kit', description: 'An open-source toolkit for connecting AI agents to Solana protocols.' },
        ],

        cronos: [
            { id: 'cronos-kit', disabled: true, name: 'Crypto.com AI Agent SDK', description: 'Official Crypto.com AI agent toolkit for on-chain activities.' }
        ]
    };

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            selectedBlockchain: undefined,
            selectedSDK: undefined,
            agentName: undefined, 
            errorMessage: undefined,
            loading: false,
            modal: false
        }
    )

    useEffect(() => {
        if (profile && profile.id) {
            listAgents(profile.id).then(
                (agents) => {
                    const total = agents.length
                    dispatch({ agentName : `My Agent #${total+1}` })
                }
            )
        }
    },[profile])

    const { agentName, selectedBlockchain, selectedSDK, errorMessage, loading, modal } = values

    const handleBlockchainSelect = (blockchain: any) => {
        dispatch({
            selectedBlockchain: blockchain,
            selectedSDK: undefined
        })
    };

    const handleSDKSelect = (sdk: any) => {
        dispatch({
            selectedSDK: sdk
        })
    };

    const handleCreateAgent = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (!agentName || agentName.length <= 3) {
            dispatch({ errorMessage: "Invalid Agent Name" })
            return
        }

        if (!profile || !profile.id) {
            dispatch({ errorMessage: "Invalid User Session" })
            return
        }

        dispatch({ loading: true })

        try {

            const { data } = await client.queries.CreateAgent({
                name: agentName,
                userId: profile.id,
                blockchain: selectedBlockchain,
                sdkType: selectedSDK
            })

            if (data) {
                dispatch({
                    selectedBlockchain: undefined,
                    selectedSDK: undefined,
                    agentName: "My Aptos Agent",
                    errorMessage: undefined,
                    loading: false,
                    modal: true
                }) 
            } else {
                throw new Error("Unknow error. Please try again.")
            }

        } catch (error: any) {
            console.log(error)
            dispatch({ loading: false, errorMessage: error.message })
        }

    }, [selectedBlockchain, selectedSDK, agentName, profile])


    const next = () => {
        dispatch({ modal: false })
        router.push("/dashboard/automation")
    }

    return (
        <>
            <BaseModal
                visible={modal}
            >
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">Agent Created Successfully</h3>
                        <button onClick={next} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-base sm:text-lg font-medium">
                        <p className="text-center">
                        Your AI agent has been deployed. You will be redirected to the Automation tab to set up automations via chat
                        </p> 
                        <div className="flex p-4">
                            <button onClick={next} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                OK
                            </button>
                        </div>
                    </div> 
                </div>
            </BaseModal>

            <div className="relative mx-auto px-6 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
                <p className="text-gray-400 mb-8">Configure and deploy a new Web3 AI agent</p>

                {/* Step 1: Select Blockchain */}
                <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 1: Select Blockchain</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blockchains.map((blockchain: any) => (
                            <div
                                key={blockchain.id}
                                className={`border-2 rounded p-4 cursor-pointer transition-all ${selectedBlockchain === blockchain.id
                                    ? 'border-white/10 bg-white/5'
                                    : 'border-white/10 hover:bg-white/5'
                                    }`}
                                onClick={() => handleBlockchainSelect(blockchain.id)}
                            >
                                <div className="flex items-center">
                                    <img src={blockchain.icon} className='w-10 h-10 rounded-full mr-2' />
                                    <div className='flex flex-row'>
                                        <h3 className="font-medium my-auto">{blockchain.name}</h3>
                                        {selectedBlockchain === blockchain.id && (
                                            <span className="bg-blue-900/30 px-2 my-auto py-1 ml-2 rounded border border-blue-600  text-blue-600 text-sm font-semibold flex items-center">
                                                <Check size={16} className="mr-1" /> Selected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 2: Select SDK */}

                <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 2: Select SDK</h2>
                    <div className="space-y-3 min-h-[100px]">
                        {!selectedBlockchain && (
                            <p className='p-4 text-center font-normal text-gray-400'>
                                Please select a blockchain to view the available SDK options
                            </p>
                        )}
                        {selectedBlockchain && sdkOptions[selectedBlockchain].map((sdk: any) => (
                            <div
                                key={sdk.id}
                                className={`border rounded p-4 ${!sdk.disabled && "cursor-pointer"} transition-all ${selectedSDK === sdk.id
                                    ? 'border-white/10 bg-white/5'
                                    : 'border-white/10 hover:bg-white/5'
                                    }`}
                                onClick={() => !sdk.disabled && handleSDKSelect(sdk.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{sdk.name}</h3>
                                        <p className="text-sm text-gray-400">{sdk.description}</p>
                                    </div>
                                    {selectedSDK === sdk.id && (
                                        <span className="bg-blue-900/30 px-2 my-auto py-1 ml-2 rounded border border-blue-600  text-blue-600 text-sm font-semibold flex items-center">
                                            <Check size={16} className="mr-1" /> Selected
                                        </span>
                                    )}
                                    {sdk.disabled && (
                                        <span className="bg-transparent px-2 my-auto py-1 ml-2 rounded border border-gray-400  text-gray-400 text-sm font-semibold flex items-center">
                                            Not available
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 3: Agent Information */}
                <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 3: Agent Information</h2>
                    <div className="space-y-4">
                        <div className='grid grid-cols-7'>
                            <div className='flex'>
                                <label htmlFor="agent-name" className="block my-auto text-white text font-semibold ">
                                    Agent Name:
                                </label>
                            </div>

                            <input
                                id="agent-name"
                                type="text"
                                value={agentName}
                                onChange={(e) => dispatch({ agentName: e.target.value })}
                                className="w-full col-span-6 px-4 py-2 border border-white/10 rounded bg-white/5 focus:border-white/10 focus:ring-0 "
                                placeholder="My Aptos Agent"
                            />
                        </div>
                    </div>
                </div>

                {/* Create Button */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        Additional configuration can be done in the Automation tab after creation.
                    </p>
                    <button
                        onClick={handleCreateAgent}
                        disabled={!selectedBlockchain || !selectedSDK || !agentName || loading}
                        className={`flex items-center px-6 py-3 rounded-lg  ${selectedBlockchain && selectedSDK && agentName
                            ? 'bg-white text-slate-900 cursor-pointer '
                            : 'bg-gray-300 text-slate-600  cursor-not-allowed'
                            }`}
                    >
                        {loading
                            ?
                            <Puff
                                stroke="#000"
                                className="w-5 h-5 mr-2"
                            />
                            :
                            <Plus size={18} className="mr-2" />
                        }
                        <span className='font-semibold'>Create Agent</span>
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                </div>

                {errorMessage && (
                    <p className="text-sm text-center mt-2 text-blue-600">
                        {errorMessage}
                    </p>
                )}

            </div>
        </>
    )
}

export default NewAgent