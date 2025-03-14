import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward } from "react-feather"
import { useRef, useEffect, useReducer, useCallback, useContext } from 'react'
import { shortAddress } from "@/helpers"
import { SpinningCircles } from 'react-loading-icons'
import useTest from "@/hooks/useTest"
import useDatabase from "@/hooks/useDatabase"
import { CloudAgentContext } from "@/hooks/useCloudAgent"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ResultCard from "./ResultCard"

const AgentPanelOLD = ({ agent }: any) => {

    const { query } = useContext(CloudAgentContext)

    const { saveMessages, getMessages } = useDatabase()

    // const { query } = useTest()

    const chatContainerRef: any = useRef(null)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            loading: false,
            message: "",
            messages: []
        }
    )

    const { message, loading, messages } = values

    useEffect(() => {
        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        scrollToBottom();

        // Observe changes to the chat container's content (e.g., new messages)
        const observer = new MutationObserver(scrollToBottom);
        if (chatContainerRef.current) {
            observer.observe(chatContainerRef.current, { childList: true, subtree: true });
        }

    }, []);

    useEffect(() => {
        agent && prepareMessages(agent)
    }, [agent])

    const handleSendMessage = useCallback(async () => {
        if (!message || message.length < 2) {
            return
        }

        if (!agent) {
            return
        }

        const userPrompt = {
            role: 'user',
            content: message
        }

        dispatch({
            loading: true,
            messages: [...messages, userPrompt],
            message: ""
        })

        try {

            const result: any = await query(agent.id, [...messages, userPrompt])
            console.log("result:", result)
            // Override old messages
            const updated = result.map((msg: any) => {
                const message = messages.find((i: any) => i.id === msg.id)
                if (message) {
                    msg = message
                }
                return msg
            })

            await saveMessages(agent.id, updated)
            dispatch({ messages: updated })

            // if (result.content) {
            //     dispatch({
            //         messages: [...messages, userPrompt, {
            //             role: "assistant",
            //             content: result.content
            //         }]
            //     })
            // } else if (result.tool_calls) {

            //     const outcomes = result.tool_calls.filter((tool: any) => tool.function.name === "create_outcome").map((tool: any) => {
            //         return JSON.parse(tool.function.arguments)
            //     })

            //     if (outcomes.length > 0) {
            //         dispatch({
            //             outcomes: [...outcomes],
            //             messages: [...messages, userPrompt, {
            //                 role: "assistant",
            //                 content: "A confirmation popup will appear."
            //             }]
            //         })
            //     }

            //     const bets = result.tool_calls.filter((tool: any) => tool.function.name === "place_bet").map((tool: any) => {
            //         return JSON.parse(tool.function.arguments)
            //     })

            //     if (bets.length > 0) {
            //         dispatch({
            //             messages: [...messages, userPrompt, {
            //                 role: "assistant",
            //                 content: "A confirmation popup will appear."
            //             }]
            //         })
            //         const currentBet = bets[0]
            //         openBetModal({
            //             marketId: marketData.id,
            //             roundId: currentBet.roundId,
            //             outcomeId: currentBet.outcomeId,
            //         })
            //     }

            // }

        } catch (e) {
            console.log(e)
        }

        dispatch({
            loading: false
        })

    }, [message, messages, agent])

    const prepareMessages = useCallback(async (agent: any) => {

        // TODO: Add resource

        const messages = await getMessages(agent.id)

        console.log("messages: ", messages)

        // TODO: Add system prompts

        dispatch({
            messages
        })

    }, [])

    // Determine if a message is a blockchain response
    const isBlockchainResponse = (message: any) => {

        if (message.role === "user") {
            try {
                return Array.isArray(message.content)
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    // Format blockchain response
    const formatBlockchainResponse = (input: any) => {
        const { content } = input
        try {
            const parsed = JSON.parse(content);
            return (
                <div className="bg-gray-100 text-gray-800 rounded p-3 text-sm font-mono">
                    <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="font-semibold text-green-700">{parsed.status}</span>
                    </div>
                    {parsed.token && (
                        <div className="flex justify-between mb-1">
                            <span>Token:</span>
                            <span className="font-semibold">{parsed.token.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="font-semibold">
                            {parsed.balance !== undefined ?
                                `${parsed.balance / Math.pow(10, parsed.token?.decimals || 0)} ${parsed.token?.name || ''}` :
                                'Unknown'}
                        </span>
                    </div>
                </div>
            );
        } catch (e) {
            return <div>{content}</div>;
        }
    };



    // Function to render message content based on type
    const renderMessageContent = (content: any, isUser: boolean) => {
        // Handle string content (simple messages)
        if (typeof content === 'string') {
            return <div className={`whitespace-pre-wrap ${!isUser && "text-gray-800"}`}>{content}</div>;
        }

        // Handle array of content blocks
        if (Array.isArray(content)) {
            return (
                <div className="space-y-2  ">
                    {content.map((block, index) => {
                        if (block.type === "text") {
                            return <div key={index} className="whitespace-pre-wrap text-gray-800">{block.text}</div>;
                        }

                        // if (block.type === "tool_use") {
                        //     let toolDisplay = "";
                        //     switch (block.name) {
                        //         case "aptos_get_wallet_address":
                        //             toolDisplay = "Checking wallet address...";
                        //             break;
                        //         case "aptos_balance":
                        //             toolDisplay = "Fetching balance information...";
                        //             break;
                        //         default:
                        //             toolDisplay = `Using ${block.name}...`;
                        //     }

                        //     return (
                        //         <div key={index} className="flex   items-center bg-gray-100 rounded p-2 text-sm text-gray-800">
                        //             <FastForward size={14} className="mr-2  text-blue-500" />
                        //             <span>{toolDisplay}</span>
                        //         </div>
                        //     );
                        // }

                        // Handle other block types if needed
                        return null;
                    })}
                </div>
            );
        }

        // Default case - just stringify the content
        return <div>{JSON.stringify(content)}</div>;
    };

    return (
        <div className="grid grid-cols-5 h-full">
            <div className="col-span-3 flex flex-col  overflow-y-scroll" ref={chatContainerRef} >

                {/* Header */}
                <div className="  p-4 border-b border-white/10 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="   mr-3">
                            <img src={"/assets/images/aptos-icon.png"} className='w-10 h-10 rounded-full ' />
                        </div>
                        <div>
                            <h2 className="font-medium">
                                {agent.name}
                            </h2>
                            <div className="flex items-center">
                                {/* <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                               <span className="text-xs text-gray-400 mr-1">Online • Move Agent Kit •</span> */}
                                <span className="text-xs text-gray-400 mr-1">Move Agent Kit •</span>
                                <span className="text-xs text-gray-400">{shortAddress(agent.walletAddresses[0], 10, -8)} </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {/* <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Copy size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Download size={18} />
                        </button> */}
                        <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                            <Tool size={18} />
                        </button>
                        <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4  ">
                    <div className="max-w-4xl mx-auto     space-y-4">
                        {messages.map((msg: any) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3xl p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-200'
                                        }`}
                                >

                                    {msg.role === 'user' && isBlockchainResponse(msg) ?
                                        msg.content.map((item: any) => formatBlockchainResponse(item)) :
                                        renderMessageContent(msg.content, msg.role === 'user')}

                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex text-lg justify-start max-w-3xl ">
                                <div className=" font-normal  flex flex-row  bg-white rounded-lg  p-2 py-3 text-sm text-gray-800">
                                    <RefreshCw size={14} className="mr-2 my-auto animate-spin text-blue-500" />
                                    <span className="my-auto mr-2">Please wait while your request is being processed...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="  border-t border-white/10  bg-gradient-to-br from-blue-900/30 to-indigo-900/30  p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={message}
                                disabled={loading}
                                onChange={(e) => dispatch({ message: e.target.value })}
                                className="  py-3 pl-4 pr-16  rounded-lg bg-black/30 border-none flex-1 focus:outline-none"
                                placeholder="Ask your agent something..."
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading}
                                className={`absolute right-2  inline-flex text-white px-4 py-2 bg-blue-600 cursor-pointer    hover:bg-blue-700 p-2 rounded-md`}
                            >
                                <Send size={18} className="my-auto mr-2" />
                                {` Send`}
                            </button>
                        </div>

                        {/* Agent Capabilities */}
                        {/* <div className="mt-4">
                            <div className="flex items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Agent Capabilities</h3>
                                <ChevronDown size={16} className="ml-1 text-gray-500" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {agentCapabilities.map((capability, index) => (
                                    <button
                                        key={index}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                                        onClick={() => setMessage(capability)}
                                    >
                                        {capability}
                                    </button>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>

            </div>
            <div className="col-span-2  border-l border-white/10">
                right 123
            </div>
        </div>
    )
}

const AgentPanel = ({ agent }: any) => {

    const { query } = useTest()

    // const { query } = useContext(CloudAgentContext)

    const { saveMessages, getMessages } = useDatabase()

    const chatContainerRef: any = useRef(null)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            loading: false,
            message: "",
            messages: []
        }
    )

    const { message, messages, loading } = values

    useEffect(() => {
        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        scrollToBottom();

        // Observe changes to the chat container's content (e.g., new messages)
        const observer = new MutationObserver(scrollToBottom);
        if (chatContainerRef.current) {
            observer.observe(chatContainerRef.current, { childList: true, subtree: true });
        }

    }, []);

    useEffect(() => {
        agent && prepareMessages(agent)
    }, [agent])

    const prepareMessages = useCallback(async (agent: any) => {

        // TODO: Add resource

        const messages = await getMessages(agent.id)

        console.log("messages: ", messages)

        // TODO: Add system prompts

        dispatch({
            messages
        })

    }, [])

    const renderMessageContent = (content: any) => {
        if (typeof content === 'string') {
            return <p className="whitespace-pre-wrap">{content}</p>;
        }

        if (Array.isArray(content)) {
            return content.map((item, index) => {
                if (item.type === 'text') {
                    return <p key={index} className="whitespace-pre-wrap">{item.text}</p>;
                }

                if (item.type === 'tool_use') {
                    return (
                        <div key={index} className="bg-blue-50 p-3 rounded-md my-2 border border-blue-200">
                            <div className="flex items-center">
                                <span className="inline-block h-4 w-4 bg-blue-500 rounded-full mr-2"></span>
                                <span className="font-semibold text-blue-700">Using tool: {item.name}</span>
                            </div>
                            {item.input && (item.input.input !== '' && item.input.input !== "{}") && (
                                <pre className="bg-blue-100 p-2 mt-2 rounded overflow-x-auto text-sm">
                                    {JSON.stringify(item.input, null, 2)}
                                </pre>
                            )}
                        </div>
                    );
                }

                // if (item.type === 'tool_result') {
                //     let displayContent = item.content;
                //     try {
                //         if (typeof item.content === 'string' && item.content.startsWith('{')) {
                //             const parsed = JSON.parse(item.content);
                //             if (parsed.status === 'error') {
                //                 return (
                //                     <div key={index} className="bg-red-50 p-3 rounded-md my-2 border border-red-200">
                //                         <div className="font-semibold text-red-700">Error</div>
                //                         <div className="text-red-600 mt-1">{parsed.message}</div>
                //                     </div>
                //                 );
                //             }
                //             displayContent = JSON.stringify(parsed, null, 2);
                //         }
                //     } catch (e) {
                //         // Use original content if parsing fails
                //     }

                //     return (
                //         <div key={index} className="bg-gray-50 p-3 rounded-md my-2 border border-gray-200">
                //             <div className="flex items-center">
                //                 <span className="inline-block h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                //                 <span className="font-semibold text-gray-700">Result</span>
                //             </div>
                //             <pre className="bg-gray-100 p-2 mt-2 rounded overflow-x-auto text-sm">
                //                 {typeof displayContent === 'string'
                //                     ? displayContent
                //                     : JSON.stringify(displayContent, null, 2)}
                //             </pre>
                //         </div>
                //     );
                // }
                if (item.type === 'tool_result') {
                    let displayContent = item.content;
                    try {
                        const parsed = JSON.parse(item.content);
                        return <ResultCard data={displayContent}/>
                    } catch (e) {

                    }
                    return <div key={index} className="bg-gray-50 p-3 rounded-md my-2 border border-gray-200">
                        <div className="flex items-center">
                            <span className="inline-block h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                            <span className="font-semibold text-gray-700">Result</span>
                        </div>
                        <pre className="bg-gray-100 p-2 mt-2 rounded overflow-x-auto text-sm">
                            {typeof displayContent === 'string'
                                ? displayContent
                                : JSON.stringify(displayContent, null, 2)}
                        </pre>
                    </div>
                }

                return null;
            });
        }

        return null;
    };

    const formatWalletAddress = (address: any) => {
        if (!address || typeof address !== 'string' || address.length < 10) return address;
        return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
    };

    const extractAddressFromMessage = (content: any) => {
        if (typeof content === 'string') {
            const match = content.match(/0x[a-fA-F0-9]{64}/);
            return match ? match[0] : null;
        }
        return null;
    }



    const handleSendMessage = useCallback(async () => {
        if (!message || message.length < 2) {
            return
        }

        if (!agent) {
            return
        }

        const userPrompt = {
            role: 'user',
            content: message
        }

        dispatch({
            loading: true,
            messages: [...messages, userPrompt],
            message: ""
        })

        try {

            // const result: any = await query(agent.id, [...messages, userPrompt])
            const result: any = await query([...messages, userPrompt])
            console.log("result:", result)
            // Override old messages
            const updated = result.map((msg: any) => {
                const message = messages.find((i: any) => i.id === msg.id)
                if (message) {
                    msg = message
                }
                return msg
            })

            await saveMessages(agent.id, updated)
            dispatch({ messages: updated })

        } catch (e) {
            console.log(e)
        }

        dispatch({
            loading: false
        })

    }, [message, messages, agent])


    return (
        <div className="grid grid-cols-7 h-full">
            <div className="col-span-5 flex flex-col  overflow-y-scroll" ref={chatContainerRef} >
                {/* Header */}
                <div className="  p-4 border-b border-white/10 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="   mr-3">
                            <img src={"/assets/images/aptos-icon.png"} className='w-10 h-10 rounded-full ' />
                        </div>
                        <div>
                            <h2 className="font-medium">
                                {agent.name}
                            </h2>
                            <div className="flex items-center">
                                {/* <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                               <span className="text-xs text-gray-400 mr-1">Online • Move Agent Kit •</span> */}
                                <span className="text-xs text-gray-400 mr-1">Move Agent Kit •</span>
                                <span className="text-xs text-gray-400">{shortAddress(agent.walletAddresses[0], 10, -8)} </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                            <Tool size={18} />
                        </button>
                        <button className="bg-white/5 cursor-pointer hover:bg-white/10 px-2 py-2 rounded text-sm transition">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages container */}
                <div className="flex-1  p-4 space-y-4"  >
                    {messages.map((message: any) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' && !message.content[0]?.type ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3/4 md:max-w-2/3 rounded-lg p-4 ${message.role === 'user' && !message.content[0]?.type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                    }`}
                            >
                                <div className="message-content overflow-hidden">
                                    {renderMessageContent(message.content)}
                                </div>

                                {/* Show wallet info if present */}
                                {message.content && typeof message.content === 'string' &&
                                    extractAddressFromMessage(message.content) && (
                                        <div className="mt-2 p-2 bg-gray-100 rounded-md text-gray-800">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="font-semibold">Wallet:</span>
                                                <span className="font-mono">
                                                    {formatWalletAddress(extractAddressFromMessage(message.content))}
                                                </span>
                                                <CopyToClipboard text={extractAddressFromMessage(message.content) || ""}>
                                                    <button className="p-1 cursor-pointer  text-gray-600 hover:text-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </div>
                                    )}

                                {/* Show transaction link if present */}
                                {/* {message.content && typeof message.content === 'string' && extractTransactionHash(message.content) && (
                                    <div className="mt-2 p-2 bg-green-50 rounded-md text-green-800">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <span className="font-semibold">Transaction:</span>
                                            <a
                                                href={`https://explorer.aptoslabs.com/txn/${message.transactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-blue-600 hover:underline"
                                            >
                                                {formatWalletAddress(message.transactionHash)}
                                            </a>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex space-x-2">
                                    <RefreshCw size={24} className="mr-2 my-auto animate-spin text-blue-600" />
                                    <span className="my-auto mr-2">Please wait...</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Input Area */}
                <div className="  border-t border-white/10  bg-gradient-to-br from-blue-900/30 to-indigo-900/30  p-4">
                    <div className="  mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={message}
                                disabled={loading}
                                onChange={(e) => dispatch({ message: e.target.value })}
                                className="  py-3 pl-4 pr-16  rounded-lg bg-black/30 border-none flex-1 focus:outline-none"
                                placeholder="Ask your agent something..."
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading}
                                className={`absolute right-2  inline-flex text-white px-4 py-2 bg-blue-600 cursor-pointer    hover:bg-blue-700 p-2 rounded-md`}
                            >
                                <Send size={18} className="my-auto mr-2" />
                                {` Send`}
                            </button>
                        </div>

                        {/* Agent Capabilities */}
                        {/* <div className="mt-4">
                            <div className="flex items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Agent Capabilities</h3>
                                <ChevronDown size={16} className="ml-1 text-gray-500" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {agentCapabilities.map((capability, index) => (
                                    <button
                                        key={index}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                                        onClick={() => setMessage(capability)}
                                    >
                                        {capability}
                                    </button>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AgentPanel