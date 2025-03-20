import useDatabase from "@/hooks/useDatabase"
import BaseModal from "@/modals/base"
import { useState, useEffect, useReducer, useCallback } from "react"
import { Info, DollarSign, Plus, Minus, ChevronDown, ChevronUp, Play, Pause, X } from "react-feather"
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { SpinningCircles } from 'react-loading-icons'

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIGeneration } = createAIHooks(client);

enum Section {
    CONFIG,
    LISTING,
    SETTINGS
}

enum Prompt {
    INPUT,
    DECISION,
    EXECUTE
}

const Configuration = ({ agent, increaseTick }: any) => {

    const [{ data, isLoading, hasError }, promptEnhance] = useAIGeneration("PromptEnhance");

    const { addToMarketplace, updateAgent, setAgentActive, saveAgentAutomation, saveMarketplace } = useDatabase()

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            section: Section.CONFIG,
            prompt: Prompt.INPUT,
            schedule: 86400,
            isActive: false,
            promptInput: "",
            promptDecision: "",
            promptExecute: "",
            errorMessage: undefined,
            modal: undefined,
            agentName: "",
            isTestnet: false,
            isListing: false,
            listing: undefined,
            processingPrompt: Prompt.INPUT
        }
    )

    const { processingPrompt, isListing, listing, isTestnet, agentName, modal, section, prompt, schedule, isActive, promptInput, promptDecision, promptExecute, errorMessage } = values

    // Categories available in the marketplace
    const categories = [
        { id: 'defi', name: 'DeFi' },
        { id: 'trading', name: 'Trading' },
        { id: 'nft', name: 'NFT' },
        { id: 'portfolio', name: 'Portfolio' },
        { id: 'utility', name: 'Utility' },
        { id: 'governance', name: 'Governance' }
    ];

    useEffect(() => {

        if (agent) {
            dispatch({
                agentName: agent?.name || "",
                isTestnet: agent?.isTestnet || false,
                schedule: agent?.schedule || 86400,
                isActive: agent?.isActive || false,
                promptInput: agent?.promptInput || "",
                promptDecision: agent?.promptDecision || "",
                promptExecute: agent?.promptExecute || ""
            })
            agent.listing().then(
                ({ data }: any) => {
                    if (data) {
                        dispatch({
                            isListing: true,
                            listing: {
                                listingId: data.id,
                                publicName: data.publicName,
                                description: data.description,
                                category: data.category,
                                price: data.price,
                                isHidden: data.isHidden,
                                isApproved: data.isApproved
                            }
                        })
                    } else {
                        dispatch({
                            isListing: false,
                            listing: {
                                publicName: "",
                                description: "",
                                category: categories[0].id,
                                price: 0,
                                isHidden: false
                            }
                        })
                    }

                }
            )
        }

    }, [agent])

    const onStart = useCallback(async () => {
        await setAgentActive(agent.id, true)
        increaseTick()
        dispatch({ modal: "Agent started successfully" })
    }, [agent, increaseTick])

    const onPause = useCallback(async () => {
        await setAgentActive(agent.id, false)
        increaseTick()
        dispatch({ modal: "Agent paused successfully" })
    }, [agent, increaseTick])

    const onUpdate = useCallback(async () => {
        if (!agentName || agentName.length <= 3) {
            return
        }

        await updateAgent(agent.id, agentName, isTestnet)

        increaseTick()
        dispatch({ modal: "Saved successfully" })

    }, [agent, agentName, isTestnet])

    const onSave = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (!agent) {
            return
        }

        if (!promptInput || !promptDecision || !promptExecute) {
            dispatch({ errorMessage: "Some fields are empty" })
            return
        }

        if (promptInput.length < 5 || promptDecision.length < 5 || promptExecute.length < 5) {
            dispatch({ errorMessage: "Each prompt must contains >5 characters" })
            return
        }

        try {
            await saveAgentAutomation({
                agentId: agent.id,
                promptInput,
                promptDecision,
                promptExecute,
                schedule
            })
            dispatch({ modal: "Saved successfully" })
            increaseTick()
        } catch (e: any) {
            console.log(e)
            dispatch({ errorMessage: e.message })
        }

    }, [promptInput, schedule, promptDecision, promptExecute, agent, increaseTick])

    const onSubmit = useCallback(async () => {

        dispatch({ errorMessage: undefined })

        if (!agent) {
            return
        }

        if (!listing.publicName || !listing.description || !listing.category) {
            dispatch({ errorMessage: "Some fields are empty" })
            return
        }

        if (listing.publicName.length < 5 || listing.description.length < 5) {
            dispatch({ errorMessage: "Name and description must each contain more than 5 characters" })
            return
        }

        try {

            await addToMarketplace({
                agentId: agent.id,
                publicName: listing.publicName,
                description: listing.description,
                category: listing.category,
                price: listing.price,
                blockchain: agent.blockchain,
                sdkType: agent.sdkType
            })

            dispatch({ modal: "Your submission is being reviewed" })
            increaseTick()
        } catch (e: any) {
            console.log(e)
            dispatch({ errorMessage: e.message })
        }

    }, [agent, increaseTick, listing])

    const onSaveMarketplace = useCallback(async () => {


        dispatch({ errorMessage: undefined })

        if (!listing) {
            return
        }

        if (!listing.publicName || !listing.description || !listing.category) {
            dispatch({ errorMessage: "Some fields are empty" })
            return
        }

        if (listing.publicName.length < 5 || listing.description.length < 5) {
            dispatch({ errorMessage: "Name and description must each contain more than 5 characters" })
            return
        }

        try {

            await saveMarketplace({
                listingId: listing.listingId,
                publicName: listing.publicName,
                description: listing.description,
                category: listing.category,
                price: listing.price,
                isHidden: listing.isHidden
            })

            dispatch({ modal: "Your entry has been updated" })
            increaseTick()
        } catch (e: any) {
            console.log(e)
            dispatch({ errorMessage: e.message })
        }

    }, [listing, increaseTick])


    const onEnhance = useCallback(async (promptType: Prompt, promptA: string, promptB: string, promptC: string) => {

        dispatch({ processingPrompt : promptType })
        const prompt = promptType === Prompt.INPUT ? promptA : promptType === Prompt.DECISION ? promptB : promptC

        promptEnhance({
            prompt: [
                `Help correct following prompt and return only prompt`,
                prompt
            ].join("\n")
        })

    }, [])

    useEffect(() => {

        if ( data && isLoading === false) {  
            const matches = data.match(/"([^"]+)"/g);
            if (matches && matches[0]) {
                const newPrompt = matches[0].replaceAll(`"`, ``) 
                if (processingPrompt === Prompt.INPUT) {
                    dispatch({
                        promptInput: newPrompt
                    })
                } else if (processingPrompt === Prompt.DECISION) {
                    dispatch({
                        promptDecision: newPrompt
                    })
                } else  if (processingPrompt === Prompt.EXECUTE) {
                    dispatch({
                        promptExecute: newPrompt
                    })
                }
            }

        }
            
    },[data, processingPrompt, isLoading ])

    return (
        <>

            <BaseModal
                visible={isLoading}
            >
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">
                            Please wait for a moment...
                        </h3>
                        <button onClick={() => {
                             
                        }} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div> 

                    {isLoading && (
                        <div className="text-base sm:text-lg p-4 font-medium">
                            <SpinningCircles className='mx-auto' />
                        </div>
                    )}
                </div>
            </BaseModal>

            <BaseModal
                visible={modal !== undefined}
            >
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">Status Update</h3>
                        <button onClick={() => dispatch({ modal: undefined })} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-base sm:text-lg font-medium">
                        <p className="text-center">
                            {modal}
                        </p>
                        <div className="flex p-4">
                            <button onClick={() => dispatch({ modal: undefined })} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            </BaseModal>

            <div className="px-6 h-full py-4 flex flex-col  overflow-y-auto">

                {/* Agent Settings */}
                <div className="mb-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <div className="flex flex-row justify-between cursor-pointer" onClick={() => dispatch({ section: Section.SETTINGS })}>
                        <h2 className="text-xl font-semibold mb-2">Agent Settings</h2>
                        {section === Section.SETTINGS ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
                    </div>
                    <p className="text-sm text-gray-400">
                        Configure the basic settings for your agent
                    </p>
                    {section === Section.SETTINGS && (
                        <div className="grid grid-cols-2 mt-4 gap-6 ">

                            <div className="col-span-1">
                                <label htmlFor="name" className="block   text-sm font-medium text-gray-400">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    id="agent-name"
                                    name="agent-name"
                                    value={agentName}
                                    onChange={(e) => dispatch({ agentName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-white/10 py-2 px-3 shadow-sm  text-sm bg-white/5 focus:border-white/10 focus:ring-0"
                                    placeholder="e.g., DeFi Yield Optimizer"
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-400">
                                    Network
                                </label>
                                <div className="inline-flex space-x-2 py-2">
                                    <button onClick={() => dispatch({ isTestnet: false })} className={`cursor-pointer ${isTestnet ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Mainnet</button>
                                    <button onClick={() => dispatch({ isTestnet: true })} className={`cursor-pointer ${!isTestnet ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Testnet</button>
                                </div>
                            </div>

                            <div className="flex col-span-2   space-x-2">
                                <button onClick={onUpdate} className="bg-white cursor-pointer  px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                    Save
                                </button>

                                <button onClick={onUpdate} className="bg-white cursor-pointer  px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                    Delete Conversation
                                </button>

                            </div>


                        </div>
                    )

                    }
                </div>


                {/* Automation Configuration */}
                <div className="mb-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <div className="flex flex-row justify-between cursor-pointer" onClick={() => dispatch({ section: Section.CONFIG })}>
                        <h2 className="text-xl font-semibold mb-2">Automation Setup</h2>
                        {section === Section.CONFIG ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
                    </div>
                    <p className="text-sm text-gray-400">
                        Setup your agent to handle a specific task automatically
                    </p>

                    {section === Section.CONFIG && (
                        <div className="pt-4">

                            {/* Tabs */}
                            <div className="flex mb-4 space-x-4">
                                <button
                                    onClick={() => dispatch({ prompt: Prompt.INPUT })}
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md ${prompt === Prompt.INPUT
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Input Processing
                                </button>
                                <button
                                    onClick={() => dispatch({ prompt: Prompt.DECISION })}
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md ${prompt === Prompt.DECISION
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Decision Making
                                </button>
                                <button
                                    onClick={() => dispatch({ prompt: Prompt.EXECUTE })}
                                    className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md ${prompt === Prompt.EXECUTE
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Execution
                                </button>
                            </div>

                            {/* Prompt Editor */}
                            <div className="mt-4">
                                <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-400">
                                    {
                                        prompt === Prompt.INPUT && "Define the prompt to gather data from sources supported by the SDK (you may need to check)"
                                    }
                                    {
                                        prompt === Prompt.DECISION && "Define the prompt to make decisions between YES and NO"
                                    }
                                    {
                                        prompt === Prompt.EXECUTE && "Define the prompt to execute actions if the decision-making process has passed"
                                    }
                                </label>
                                {prompt === Prompt.INPUT && (
                                    <textarea
                                        disabled={isLoading}
                                        className="w-full h-32 p-3 text-sm border border-white/10 rounded-md  bg-white/5 focus:border-white/10 focus:ring-0"
                                        placeholder={`Enter your prompt...`}
                                        value={promptInput}
                                        onChange={(e) => dispatch({ promptInput: e.target.value })}
                                    ></textarea>
                                )}
                                {prompt === Prompt.DECISION && (
                                    <textarea
                                        disabled={isLoading}
                                        className="w-full h-32 p-3 text-sm border border-white/10 rounded-md  bg-white/5 focus:border-white/10 focus:ring-0"
                                        placeholder={`Enter your prompt...`}
                                        value={promptDecision}
                                        onChange={(e) => dispatch({ promptDecision: e.target.value })}
                                    ></textarea>
                                )}
                                {prompt === Prompt.EXECUTE && (
                                    <textarea
                                        disabled={isLoading}
                                        className="w-full h-32 p-3 text-sm border border-white/10 rounded-md  bg-white/5 focus:border-white/10 focus:ring-0"
                                        placeholder={`Enter your prompt...`}
                                        value={promptExecute}
                                        onChange={(e) => dispatch({ promptExecute: e.target.value })}
                                    ></textarea>
                                )}
                            </div>

                            <div className="py-1.5 flex flex-row">
                                <div className="text-sm my-auto text-gray-400">
                                    {prompt === Prompt.INPUT && `${promptInput.length} characters`}
                                    {prompt === Prompt.DECISION && `${promptDecision.length} characters`}
                                    {prompt === Prompt.EXECUTE && `${promptExecute.length} characters`}
                                </div>
                                <button
                                    disabled={isLoading}
                                    onClick={() => {
                                        onEnhance(prompt, promptInput, promptDecision, promptExecute)
                                    }}
                                    className="bg-gradient-to-r cursor-pointer my-auto ml-auto   from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg font-medium transition flex items-center">
                                    Enhance this prompt
                                </button>
                            </div>

                            {/* Schedule Settings */}
                            <div className="mt-2">
                                <h4 className="mb-2 text-sm font-medium text-gray-400">Schedule</h4>
                                <div className="flex items-center space-x-2">
                                    {/* <button onClick={() => dispatch({ schedule: 600 })} className={`cursor-pointer ${schedule !== 600 ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Every 10 minutes</button> */}
                                    <button onClick={() => dispatch({ schedule: 10800 })} className={`cursor-pointer ${schedule !== 10800 ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Every 3 hours</button>
                                    <button onClick={() => dispatch({ schedule: 21600 })} className={`cursor-pointer ${schedule !== 21600 ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Every 6 hours</button>
                                    <button onClick={() => dispatch({ schedule: 43200 })} className={`cursor-pointer ${schedule !== 43200 ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Every 12 hours</button>
                                    <button onClick={() => dispatch({ schedule: 86400 })} className={`cursor-pointer ${schedule !== 86400 ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Every 24 hours</button>
                                </div>
                            </div>

                            <div className="flex py-2 mt-4 space-x-2">
                                <button onClick={onSave} className="bg-white cursor-pointer  px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                    Save
                                </button>
                                <div className="flex px-1">
                                    {errorMessage && (
                                        <p className="text-sm text-center  my-auto  text-white">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                                {isActive
                                    ?
                                    <button onClick={onPause} className="bg-blue-600 ml-auto inline-flex  cursor-pointer px-4 py-2 rounded-lg font-medium  text-white transition">
                                        <Pause size={18} className="my-auto mr-1" />
                                        Pause
                                    </button>
                                    :
                                    <button onClick={onStart} className="bg-blue-600 ml-auto inline-flex  cursor-pointer px-4 py-2 rounded-lg font-medium  text-white transition">
                                        <Play size={18} className="my-auto mr-1" />
                                        Start
                                    </button>
                                }
                            </div>

                        </div>
                    )}

                </div>

                {/* Marketplace Listings */}
                <div className="mb-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6">
                    <div className="flex flex-row justify-between cursor-pointer" onClick={() => dispatch({ section: Section.LISTING })}>
                        <h2 className="text-xl font-semibold mb-2">Marketplace Listings</h2>
                        {section === Section.LISTING ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
                    </div>

                    <p className="text-sm text-gray-400">
                        Share your agent with the community or sell it to other users
                    </p>
                    {section === Section.LISTING && (
                        <div className="grid grid-cols-2 gap-6 ">
                            {/* Agent Name */}
                            <div className="col-span-2">
                                <label htmlFor="name" className="block mt-4 text-sm font-medium text-gray-400">
                                    Public Name
                                </label>
                                <input
                                    type="text"
                                    id="publicName"
                                    name="publicName"
                                    value={listing?.publicName}
                                    onChange={(e) => dispatch({
                                        listing: {
                                            ...listing,
                                            publicName: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border border-white/10 py-2 px-3 shadow-sm  text-sm bg-white/5 focus:border-white/10 focus:ring-0"
                                    placeholder="e.g., DeFi Yield Optimizer"
                                />
                            </div>
                            {/* Full Description */}
                            <div className="col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-400">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={listing?.description}
                                    onChange={(e) => dispatch({
                                        listing: {
                                            ...listing,
                                            description: e.target.value
                                        }
                                    })}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-white/10 py-2 px-3 shadow-sm  text-sm bg-white/5 focus:border-white/10 focus:ring-0"
                                    placeholder="Provide a detailed description of what your agent does and how it works"
                                />
                            </div>
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-400">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={listing?.category}
                                    onChange={(e) => dispatch({
                                        listing: {
                                            ...listing,
                                            category: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full rounded-md border border-white/10 py-2 px-3 shadow-sm text-sm bg-white/5 focus:border-white/10 focus:ring-0"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id} className="text-gray-900 active:text-white">
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pricing */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-400">
                                    Price
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={listing?.price}
                                        onChange={(e) => dispatch({
                                            listing: {
                                                ...listing,
                                                price: Number(e.target.value)
                                            }
                                        })}
                                        min="0"
                                        step="0.1"
                                        className="block w-full pl-10 pr-12 py-2 border border-white/10 rounded-md text-sm bg-white/5 focus:border-white/10 focus:ring-0"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 sm:text-sm">USD</span>
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-400">Set to 0 to make your agent free</p>
                            </div>

                            {isListing === true && (
                                <div className="col-span-2 ">
                                    <h4 className="mb-2 text-sm font-medium text-gray-400">Visibility</h4>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => dispatch({ listing: { ...listing, isHidden: false } })} className={`cursor-pointer ${listing.isHidden === true ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Public</button>
                                        <button onClick={() => dispatch({ listing: { ...listing, isHidden: true } })} className={`cursor-pointer ${listing.isHidden === false ? "bg-white/5 hover:bg-white/10" : " bg-blue-600/40  hover:bg-blue-600/60"} px-3 py-1 rounded text-sm transition`}>Hidden</button>
                                    </div>
                                </div>
                            )}

                            {/* Info Box */}
                            {isListing === false && (
                                <div className="bg-blue-50 p-4 rounded-md col-span-2">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Info className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-blue-800">Listing Information</h3>
                                            <div className="mt-2 text-sm text-blue-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>All agents submitted to the marketplace go through a review process</li>
                                                    <li>You'll be notified when your agent is approved or if changes are needed</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isListing === true && listing.isApproved === false && (
                                <div className="bg-red-50 p-4 rounded-md col-span-2">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <X className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Listing Not Approved</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Your agent listing was not approved yet.</li>


                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="flex col-span-2   space-x-2">
                                {isListing === false && (
                                    <button onClick={onSubmit} className="bg-white cursor-pointer  px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                        Submit
                                    </button>
                                )}

                                {isListing === true && (
                                    <button onClick={onSaveMarketplace} className="bg-white cursor-pointer  px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                        Save
                                    </button>
                                )}

                                <div className="flex px-1">
                                    {errorMessage && (
                                        <p className="text-sm text-center  my-auto  text-white">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>

                            </div>


                        </div>
                    )

                    }
                </div>
            </div>

        </>
    )
}

export default Configuration