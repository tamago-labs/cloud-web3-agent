import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward } from "react-feather"
import { useRef, useEffect, useReducer, useCallback, useContext } from 'react'
import { shortAddress } from "@/helpers"
import { SpinningCircles } from 'react-loading-icons'
import useTest from "@/hooks/useTest"
import useDatabase from "@/hooks/useDatabase"
import { CloudAgentContext } from "@/hooks/useCloudAgent"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ResultCard from "../Automation/ResultCard"
import MessagesAptos from "./MessagesAptos"
import { getSdkName } from "@/helpers/getter"
import BaseModal from "@/modals/base"


const ChatPanel = ({ agent, increaseTick }: any) => {

    // const { query } = useTest()
    const { query } = useContext(CloudAgentContext)

    const { getMessages, clearMessages } = useDatabase()

    const chatContainerRef: any = useRef(null)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            loading: false,
            message: "",
            messages: [],
            tick: 1,
            tokenCount: 0,
            modal: undefined
        }
    )

    const { modal, message, messages, loading, tick, tokenCount } = values

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

    }, [])

    useEffect(() => {
        agent && prepareMessages(agent)
    }, [agent, tick])

    const prepareMessages = useCallback(async (agent: any) => {

        // TODO: Add resource
        const messages = await getMessages(agent.id)
        console.log("messages: ", messages)
        // TODO: Add system prompts

        dispatch({
            messages
        })

    }, [])

    useEffect(() => {
        if (messages) {
            let tokenCount = 0
            console.log(messages)
            messages.map((item: any) => {
                if (item.content) {
                    tokenCount = tokenCount + (item.content.length * 1.3)
                }
            })
            dispatch({ tokenCount })
        }
    }, [messages])

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


            if (agent.blockchain === "aptos") {
                const result: any = await query(agent.id, [...messages, userPrompt])
                console.log("result:", result)
                if (result) {
                    dispatch({ messages: result })
                } else {
                    alert("Connection timeout: Reload the page if you do not see new messages within 15 seconds")
                    // wait for 10 sec and load message again
                    setTimeout(() => {
                        dispatch({
                            tick: tick + 1
                        })
                    }, 10000)
                }
            }


        } catch (e) {
            console.log(e)
        }

        dispatch({
            loading: false
        })

    }, [message, messages, agent, tick])

    const onClear = useCallback(async () => {
        await clearMessages(agent.id)
        increaseTick()
        dispatch({ modal: "Deleted successfully" })
    },[agent, increaseTick])

    return (
        <div className="grid grid-cols-7 h-full">

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

            <div className="col-span-7 flex flex-col  overflow-y-scroll" ref={chatContainerRef} >

                <div className="border-b border-white/10 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="ml-auto flex space-x-2">
                                <span className="flex items-center h-[28px] my-auto bg-indigo-900  border text-gray-200 border-indigo-700 px-3 rounded-md text-xs shadow-sm  ">
                                    {getSdkName(agent.blockchain, agent.sdkType)}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">
                            Limit: 5,000 tokens per conversation
                        </p>
                        <div className="flex items-center space-x-3">

                            {/* Token Count */}
                            <div className="flex items-center bg-black/30 px-3 py-1.5 rounded-lg">
                                <span className="text-sm text-gray-200 font-medium">{(tokenCount).toLocaleString()} tokens</span>
                            </div>

                            {/* Delete Conversation Button */}
                            <button
                                onClick={onClear}
                                className="flex items-center bg-red-500/20 cursor-pointer hover:bg-red-600/30 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-colors duration-200"
                            >
                                <div className="w-4 h-4 mr-2">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">Clear Chat</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages container */}
                {agent.blockchain === "aptos" && <MessagesAptos messages={messages} agent={agent} loading={loading} />}


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
                                placeholder="Chat with your agent..."
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

export default ChatPanel