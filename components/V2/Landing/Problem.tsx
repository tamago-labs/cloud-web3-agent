const Problem = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                            The Challenge
                        </h2>

                        <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">✕</span>
                                <span>Decentralized data makes analysis difficult</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">✕</span>
                                <span>Teams need engineers to extract insights</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">✕</span>
                                <span>Researching DeFi metrics is slow and inefficient</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">✕</span>
                                <span>No easy way to compare protocols or track portfolios</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                            Our Solution
                        </h2>
                        <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1">✓</span>
                                <span>Online MCP servers ready to access any kind of data instantly</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1">✓</span>
                                <span>Nodit MCP as a base tool for other MCPs for deep analysis</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1">✓</span>
                                <span>Secure AI using AWS Bedrock with various models available</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3 mt-1">✓</span>
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