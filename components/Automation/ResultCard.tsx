import { CopyToClipboard } from 'react-copy-to-clipboard'

const ResultCard = ({ data }: any) => {
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

        // Balance response
        if ('balance' in responseData) {
            const { balance } = responseData;
            const tokenName = token?.name || 'APT';
            const formattedBalance = Number(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
            });

            const iconColor = balance > 0 ? 'text-green-500' : 'text-gray-400';

            return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 rounded-full p-2 ${balance > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                <h3 className="text-lg font-semibold text-gray-900">{formattedBalance} {tokenName}</h3>
                            </div>
                        </div>

                    </div>
                    {token && (
                        <div className="mt-3 border-t border-gray-100 pt-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Token</span>
                                <span className="font-medium text-gray-900">{token.name}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-500">Decimals</span>
                                <span className="font-medium text-gray-900">{token.decimals}</span>
                            </div>
                        </div>
                    )}
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
                                    href={`https://explorer.aptoslabs.com/txn/${transferTokenTransactionHash}`}
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
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Success</p>
                        <pre className="mt-1 text-sm overflow-auto max-w-xs">
                            {JSON.stringify(responseData, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        );
    };

    return renderCard();
};

export default ResultCard