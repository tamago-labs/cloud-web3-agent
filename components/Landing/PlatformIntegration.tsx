


const PlatformIntegration = () => {

    const platforms = [
        { name: "X/Twitter", icon: "🐦", description: "AI-agents engage in automated discussions and on-chain transactions" },
        { name: "Telegram", icon: "💬", description: "Seamless integration for bot-based interactions for your Web3 project" },
        { name: "Discord", icon: "🎮", description: "Automate community management and support with fully flexible" },
    ];

    return (
        <section className="py-20 relative ">
            <div className="max-w-6xl text-center mx-auto px-4">
                <div className="text-center mb-6 sm:mb-12">
                    <p className="text-base sm:text-xl text-white max-w-2xl mx-auto">
                        Connect Web3 agents with social platforms for real-time interactions and community engagement
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {platforms.map((platform, index) => (
                        <div
                            key={index}
                            className="bg-white backdrop-blur-sm cursor-default rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                        >
                            <div className="text-5xl">{platform.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4 text-center">{platform.name}</h3>
                            <p className="text-gray-600 text-center">{platform.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mx-auto mt-8   flex">
                    <div className="flex mx-auto text-center items-center bg-gradient-to-r  from-blue-600 to-purple-600   text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Coming Soon
                    </div>
                </div>


            </div>

        </section>
    )
}

export default PlatformIntegration