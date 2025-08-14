"use client"

import { useEffect, useState } from "react"

const Applications = () => {

    const [activeIndex, setActiveIndex] = useState(0);

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
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % applications.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [applications.length])

    return (
        <section className="py-16 relative ">
            <div className="max-w-3xl mx-auto px-4">
                <div className="relative w-full max-w-6xl mx-auto z-10">
                    <div className="flex items-center mb-6">
                        <h3 className="text-3xl mx-auto text-center font-bold">Applications</h3>
                    </div>

                    <p className="text-base sm:text-lg text-white text-center max-w-2xl mx-auto mb-8">
                    Our platform adapts to any workflow, enabling AI agents to perform a wide range of tasks across on-chain and off-chain environments
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
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications