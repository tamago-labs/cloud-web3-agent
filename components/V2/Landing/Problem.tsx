const Problem = () => {
    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-2 md:px-0">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* The Challenge Card */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            The Challenge
                        </h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                <span>Decentralized data makes analysis difficult</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                <span>Teams need engineers to extract insights</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                <span>Researching DeFi metrics is slow and inefficient</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1 flex-shrink-0">✕</span>
                                <span>No easy way to compare protocols or track portfolios</span>
                            </li>
                        </ul>
                    </div>

                    {/* Our Solution Card */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            Our Solution
                        </h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Online MCP servers ready to access any kind of data instantly</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Nodit MCP as a base tool for other MCPs for deep analysis</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Secure AI using AWS Bedrock with various models available</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Interactive charts and insights generated through chat</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

 
export default Problem