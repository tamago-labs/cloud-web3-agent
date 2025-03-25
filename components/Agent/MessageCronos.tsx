import { PlayCircle, Copy, Download, Settings, Tool, Send, RefreshCw, FastForward } from "react-feather"
import { CopyToClipboard } from 'react-copy-to-clipboard'

const MessagesCronos = ({ agent, messages, loading }: any) => {

    const renderMessageContent = (content: any, additional_kwargs?: any) => {
        if (typeof content === 'string') {
            if (content === "" && additional_kwargs && additional_kwargs["tool_calls"]) {
                return <div className="bg-blue-50 p-3 rounded-md my-2 border border-blue-200">
                    <div className="flex items-center">
                        <span className="inline-block h-4 w-4 bg-blue-500 rounded-full mr-2"></span>
                        <span className="font-semibold text-blue-700">Using tool: {additional_kwargs?.tool_calls[0]?.function.name}</span>
                    </div>
                    {additional_kwargs && (additional_kwargs?.tool_calls[0]?.function?.arguments !== '' && additional_kwargs?.tool_calls[0]?.function?.arguments !== "{}") && (
                        <pre className="bg-blue-100 p-2 mt-2 rounded overflow-x-auto text-sm">
                            {JSON.stringify(additional_kwargs?.tool_calls[0]?.function?.arguments, null, 2)}
                        </pre>
                    )}
                </div>
            } else {
                return <p className="whitespace-pre-wrap">{content}</p>
            }
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

    return (
        <div className="flex-1  p-4 space-y-4 ">

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
                            {renderMessageContent(message.content, message.additional_kwargs)}
                        </div>
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


const ResultCard = ({ data, agent }: any) => {
    // Check if the data is a string that needs to be parsed
    const responseData = typeof data === 'string' ? JSON.parse(data) : data;

    // Extract common properties
    const { status, token } = responseData;

    // Function to render the appropriate card based on the data
    const renderCard = () => {
        // Error state
        if (status === 'error') {
            return (
                <div className="bg-red-50 p-3 rounded-md my-2 border border-red-200">
                    <div className="font-semibold text-red-700">Error</div>
                    <div className="text-red-600 mt-1">{responseData.message}</div>
                </div>
            );
        }
 



        // Transaction response
        if ('transferTokenTransactionHash' in responseData) {
            const { transferTokenTransactionHash } = responseData;
            const shortHash = `${transferTokenTransactionHash.substring(0, 10)}...${transferTokenTransactionHash.substring(transferTokenTransactionHash.length - 8)}`;

            return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Transaction Complete</p>
                            <h3 className="text-lg font-semibold text-gray-900">{token?.name || 'Token'} Transfer</h3>
                        </div>
                    </div>
                    <div className="mt-3 border-t border-gray-100 pt-3">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Transaction Hash</span>
                            <div className="flex items-center mt-1">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">{shortHash}</code>
                                <CopyToClipboard text={transferTokenTransactionHash || ""}>
                                    <button
                                        className="ml-2 text-gray-600 cursor-pointer hover:text-gray-800"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </CopyToClipboard>

                                <a
                                    href={`https://explorer.aptoslabs.com/txn/${transferTokenTransactionHash}?network=${agent.isTestnet ? "testnet" : "mainnet"}`}
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
                    </div>
                </div>
            );
        }



        // Generic success response
        return (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md my-2  ">
                <div className="flex flex-col ">
                    <div className="flex items-center">
                        <span className="inline-block h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                        <span className="font-semibold text-gray-700">Result</span>
                    </div>
                    <pre className="bg-blue-100 rounded p-2 mt-2   overflow-x-auto text-sm">
                        {typeof responseData === 'string'
                            ? responseData
                            : JSON.stringify(responseData, null, 2)}
                    </pre>
                </div>
            </div>
        );
    };

    return renderCard();
};


export default MessagesCronos