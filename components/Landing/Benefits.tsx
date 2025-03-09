import { useState, useEffect } from 'react';
// import { CloudArrowUpIcon, BoltIcon, CpuChipIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const KeyBenefits = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    const benefits = [
        {
            title: "One-Click Deployment",
            description: "Deploy AI agents with a single click on managed infrastructure",
            icon: "🚀"
        },
        {
            title: "Web3-Ready No-Code",
            description: "Setup AI agents on-chain and off-chain without writing Move or Solidity.",
            icon: "🛠️"
        },
        {
            title: "Multi-Agent Coordination",
            description: "Enable AI-to-AI communication for complex orchestration and automation",
            icon: "📡"
        }
    ];

    const supportedChains = [
        {
            chain: "Aptos",
            sdk: "Move Agent Kit",
            logo: "/aptos-logo.svg", // You'll need to add these logo files to your project
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-600"
        },
        {
            chain: "Cronos",
            sdk: "Crypto.com AI Agent SDK",
            logo: "/cronos-logo.svg",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
            textColor: "text-indigo-600"
        }
    ];


    const applications: any = [
        {
            title: "DeFi Trading",
            description: "Create agents that monitor markets, execute trades, manage positions, and optimize yield across Aptos DeFi protocols."
        },
        {
            title: "NFT Management",
            description: "Deploy agents to track floor prices, automate purchases, list collections, and identify rare opportunities in NFT marketplaces."
        },
        {
            title: "DAO Governance",
            description: "Build agents that analyze proposals, vote according to strategies, and represent stakeholder interests in DAOs."
        },
        {
            title: "Social Engagement",
            description: "Design agents that interact with community members, distribute rewards, and manage token-gated content."
        }
    ]

    // Auto-rotate through applications
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setActiveIndex((current) => (current + 1) % applications.length);
    //     }, 3000);
    //     return () => clearInterval(interval);
    // }, [applications.length])

    return (
        <section className="py-16 relative ">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    {/* <h2 className="text-3xl font-bold   mb-4">Key Benefits</h2> */}
                    <p className="text-base sm:text-xl text-white max-w-2xl mx-auto">
                        Simplifies building, deploying and managing AI agents for Web3 workflows with support for multiple blockchains
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm cursor-default rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                        >
                            <div className="mb-4 text-3xl flex justify-center">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 text-center">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="relative w-full max-w-6xl mx-auto z-10">
                <div className="flex items-center mb-6"> 
                    <h3 className="text-2xl font-bold">Versatile Applications</h3>
                </div>

                <p className="text-lg text-indigo-100 mb-8">
                    Our platform adapts to any workflow, enabling AI agents to perform a wide range of tasks across the Aptos ecosystem.
                </p>

                <div className="mb-8 h-32">
                    {applications.map((app: any, index: number) => (
                        <div
                            key={index}
                            className={`transition-all duration-500 absolute ${index === activeIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                                }`}
                            style={{ display: index === activeIndex ? 'block' : 'none' }}
                        >
                            <h4 className="text-xl font-semibold text-white mb-2">{app.title}</h4>
                            <p className="text-indigo-100">{app.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {applications.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? "bg-white w-6" : "bg-white/40"
                                    }`}
                                aria-label={`Show application ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button className="flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-indigo-50">
                        Explore Use Cases
                      
                    </button>
                </div>
            </div> */}

            <div className="max-w-4xl mt-[60px] mx-auto">
                <div className="text-center mb-6">
                    <p className="text-base sm:text-xl text-white max-w-2xl mx-auto">
                        Supported blockchains and capabilities
                    </p>
                </div>

                {/* Mobile view: cards */}
                <div className="md:hidden space-y-4 mx-4">
                    {supportedChains.map((item, index) => (
                        <div
                            key={index}
                            className={`bg-white/80 rounded-xl p-6  border  `}
                        >
                            <div className="flex flex-col items-center mb-3">
                                <h3 className="text-xl mx-auto text-gray-900 font-bold">{item.chain}</h3>
                          <p className="text-gray-600 text-center">
                                With {item.sdk}
                            </p>
                            </div>
                            {/* <div className="flex items-center">
                                
                                <span className={`${item.textColor} font-medium`}>{item.sdk}</span>
                            </div> */}
                            

                            {index === 0 && (
                                <div className='  font-medium text-gray-600 overflow-y-auto h-[100px]  text-sm'>
                                    <p>Enables AI agents to interact with various DeFi protocols:</p>
                                    <p><b>Joule:</b> Lending & borrowing operations</p>
                                    <p><b>Amnis:</b> Staking operations</p>
                                    <p><b>Thala:</b> Staking & DEX operations</p>
                                    <p><b>Echelon:</b> Lending & borrowing operations</p>
                                    <p><b>LiquidSwap:</b> DEX operations</p>
                                    <p><b>Panora:</b> DEX aggregation operations</p>
                                    <p><b>Aries:</b> Lending & borrowing operations</p>
                                    <p><b>Echo:</b> Staking operations</p> 
                                </div>
                            )

                            }
                             {index === 1 && (
                                <div className='  font-medium text-gray-600 overflow-y-auto h-[100px]  text-sm'>
                                     <p>Supports <b>Cronos EVM</b> and <b>Cronos zkEVM</b></p>
                                                <p>Simple and intuitive API for interacting with Cronos blockchain networks</p>
                                                <p>Supports <b>token balances (native & CRC20), token transfers, wrapping, and swapping</b></p>
                                                <p>Transaction queries by address or hash, and fetching transaction statuses</p>
                                                <p>Smart contract ABI fetching by contract address
                                                    <p>Wallet creation and balance management</p></p>
                                </div>
                            ) }

                        </div>
                    ))}
                </div>

                {/* Desktop view: table */}
                <div className="hidden md:block overflow-hidden rounded-lg shadow-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/70 font-semibold text-gray-900  ">
                                <th className="py-4 px-6 text-left">Blockchain</th>
                                <th className="py-4 px-6 text-left">SDK</th>
                                <th className="py-4 px-6 text-center">Capabilities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supportedChains.map((item, index) => (
                                <tr key={index} className={`bg-white/80 border-b border-gray-200`}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">

                                            <span className="font-medium text-gray-900">{item.chain}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={` font-medium text-gray-600`}>{item.sdk}</span>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-600">
                                        {index === 0 && (
                                            <div className='line-clamp-4'>
                                                <p>Enables AI agents to interact with various DeFi protocols:</p>
                                                <p><b>Joule:</b> Lending & borrowing operations</p>
                                                <p><b>Amnis:</b> Staking operations</p>
                                                <p><b>Thala:</b> Staking & DEX operations</p>
                                                <p><b>Echelon:</b> Lending & borrowing operations</p>
                                                <p><b>LiquidSwap:</b> DEX operations</p>
                                                <p><b>Panora:</b> DEX aggregation operations</p>
                                                <p><b>Aries:</b> Lending & borrowing operations</p>
                                                <p><b>Echo:</b> Staking operations</p>

                                            </div>
                                        )

                                        }
                                        {index === 1 && (
                                            <div className='line-clamp-4'>
                                                <p>Supports <b>Cronos EVM</b> and <b>Cronos zkEVM</b></p>
                                                <p>Simple and intuitive API for interacting with Cronos blockchain networks</p>
                                                <p>Supports <b>token balances (native & CRC20), token transfers, wrapping, and swapping</b></p>
                                                <p>Transaction queries by address or hash, and fetching transaction statuses</p>
                                                <p>Smart contract ABI fetching by contract address
                                                    <p>Wallet creation and balance management</p></p>
                                            </div>
                                        )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 px-4 text-sm sm:text-base text-center text-white">
                    <p>More blockchain integrations coming soon. <a href="mailto:support@tamagolabs.com" className="text-white font-semibold underline hover:underline">Request a blockchain</a></p>
                </div>
            </div>

        </section>
    );
};

export default KeyBenefits;