import { PlayCircle, Copy, Download, Settings, Send, RefreshCw, FastForward } from "react-feather"
import { useRef, useEffect, useReducer, useCallback } from 'react'
import { shortAddress } from "@/helpers"
import { SpinningCircles } from 'react-loading-icons'
import useTest from "@/hooks/useTest"
import useDatabase from "@/hooks/useDatabase"


const AgentPanel = ({ agent }: any) => {

    const { saveMessages, getMessages } = useDatabase()

    const { query } = useTest()

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

            const result: any = await query([...messages, userPrompt])
            // Override old messages
            const updated = result.map((msg: any) => {
                const message = messages.find((i:any) => i.id === msg.id)
                if (message) {
                    msg = message
                }
                return msg
            })

            console.log("updated :", updated)

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

        // // Add user message
        // const newUserMessage = {
        //     id: messages.length + 1,
        //     sender: 'user',
        //     content: message,
        //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // };

        // setMessages([...messages, newUserMessage]);
        // setMessage('');

        // // Simulate agent response
        // setTimeout(() => {
        //     const newAgentMessage = {
        //         id: messages.length + 2,
        //         sender: 'agent',
        //         content: "I'll fetch that information for you. Let me check the blockchain data...",
        //         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        //         loading: true
        //     };

        //     setMessages(prev => [...prev, newAgentMessage]);

        //     // Simulate blockchain data retrieval
        //     setTimeout(() => {
        //         setMessages(prev => prev.map(msg =>
        //             msg.id === newAgentMessage.id ? {
        //                 ...msg,
        //                 content: "I've analyzed your request and here's what I found on-chain:\n\nThe Okay Bears collection has a floor price of 45.5 SOL, which is up 3.2% in the last 24 hours. There are currently 23 listings below 50 SOL.\n\nWould you like me to set up an alert for when the floor price drops below a certain threshold?",
        //                 loading: false,
        //                 hasBlockchainData: true,
        //                 blockchainSource: 'Solana RPC, Magic Eden API'
        //             } : msg
        //         ));
        //     }, 3000);
        // }, 1000);
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
                const parsed = JSON.parse(message.content);
                return parsed && typeof parsed === 'object' && parsed.status;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    // Format blockchain response
    const formatBlockchainResponse = (content: any) => {
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
                        {/* <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Settings size={18} />
                        </button> */}
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
                                        formatBlockchainResponse(msg.content) :
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

export default AgentPanel