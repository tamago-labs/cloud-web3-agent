import ResultCard from "../Automation/ResultCard"
import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward } from "react-feather"
import { CopyToClipboard } from 'react-copy-to-clipboard'


const MessagesAptos = ({ agent, messages, loading  }: any) => {


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
                if (item.type === 'tool_result') {
                    let displayContent = item.content;
                    try {
                        const parsed = JSON.parse(item.content);
                        return <ResultCard data={displayContent} agent={agent} />
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

    return (
        <div className="flex-1  p-4 space-y-4 "  >
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
                                        <a
                                            href={`https://explorer.aptoslabs.com/account/${extractAddressFromMessage(message.content) || ""}?network=${agent.isTestnet ? "testnet" : "mainnet"}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-gray-600 hover:text-gray-800"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )}

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
    )
}

export default MessagesAptos