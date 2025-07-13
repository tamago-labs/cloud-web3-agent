"use client"

import useDatabase from '@/hooks/useDatabase';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Search, Filter, Tag, Star, Download, MoreVertical, DollarSign, Award, TrendingUp } from 'react-feather'
import { generateClient } from "aws-amplify/api"
import type { Schema } from "../../amplify/data/resource"
import { CloudAgentContext } from '@/hooks/useCloudAgent';
import { useRouter } from "next/navigation";
import BaseModal from '@/modals/base';
import { SpinningCircles } from 'react-loading-icons'

const client = generateClient<Schema>()

const Marketplace = () => {

    const router = useRouter()

    const { profile } = useContext(CloudAgentContext)

    const { listMarketplace } = useDatabase()
    const [items, setItems] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)

    useEffect(() => {
        listMarketplace().then(setItems)
    }, [])

    const onDeploy = useCallback(async (item: any) => {

        if (!profile) {
            return
        }

        setLoading(true)
        setModal(true)

        try {

            const agentName = item.publicName
            const blockchain = item.blockchain
            const sdkType = item.sdkType
            const userId = profile.id

            const targetAgent: any = await item.agent()
 



        } catch (error: any) {
            console.log(error)
            alert("Unknow error. Please try again.")
        }

        setLoading(false)

    }, [profile])

    // Sample marketplace items
    const marketplaceItems = [
        {
            id: 1,
            name: "DeFi Yield Optimizer",
            creator: "Aptos Labs",
            rating: 4.8,
            downloads: 2340,
            verified: true,
            price: 0,
            category: "defi",
            tags: ["yield", "staking", "auto-compound"],
            description: "Automatically monitors and moves funds between Thala, Amnis, and Echo for the highest APY.",
            image: "/api/placeholder/400/200"
        },
        {
            id: 2,
            name: "NFT Floor Sweeper",
            creator: "SolFlare",
            rating: 4.5,
            downloads: 1430,
            verified: true,
            price: 15,
            category: "nft",
            tags: ["floor price", "auto-buy", "Topaz"],
            description: "Monitors NFT floor prices and automatically purchases when they drop below threshold.",
            image: "/api/placeholder/400/200"
        },
        {
            id: 3,
            name: "Liquidation Protector",
            creator: "DeFiSafety",
            rating: 4.9,
            downloads: 3120,
            verified: true,
            price: 20,
            category: "defi",
            tags: ["lending", "Joule", "Aries", "risk management"],
            description: "Prevents liquidations by monitoring health factors and automatically adding collateral.",
            image: "/api/placeholder/400/200"
        },
        {
            id: 4,
            name: "DEX Arbitrage Bot",
            creator: "CryptoTrader",
            rating: 4.3,
            downloads: 980,
            verified: false,
            price: 25,
            category: "trading",
            tags: ["arbitrage", "LiquidSwap", "Panora"],
            description: "Identifies and executes arbitrage opportunities across multiple DEXes.",
            image: "/api/placeholder/400/200"
        },
        {
            id: 5,
            name: "Gas Optimizer",
            creator: "BlockWorks",
            rating: 4.7,
            downloads: 2100,
            verified: true,
            price: 0,
            category: "utility",
            tags: ["gas", "transaction", "efficiency"],
            description: "Schedules transactions during optimal gas price periods to minimize fees.",
            image: "/api/placeholder/400/200"
        },
        {
            id: 6,
            name: "Portfolio Rebalancer",
            creator: "TokenFi",
            rating: 4.6,
            downloads: 1840,
            verified: true,
            price: 10,
            category: "portfolio",
            tags: ["rebalancing", "diversification", "asset allocation"],
            description: "Maintains desired portfolio allocation by automatically rebalancing assets.",
            image: "/api/placeholder/400/200"
        },
    ];

    const next = () => {
        setModal(false)
        router.push("/dashboard")
    }

    return (
        <div className="container mx-auto px-6 py-8">

            <BaseModal
                visible={modal}
            >
                <div className="px-2 sm:px-6 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl  font-semibold">
                            {loading ? "Deploying New Agent" : "Agent Created Successfully"}
                        </h3>
                        <button onClick={() => {
                            !loading && next()
                        }} className="text-gray-400 cursor-pointer hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {!loading && (
                        <div className="text-base sm:text-lg font-medium">
                            <p className="text-center">
                                Your AI agent has been deployed. You will be redirected to the Dashboard.
                            </p>
                            <div className="flex p-4">
                                <button onClick={next} className="bg-white cursor-pointer mx-auto px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-base sm:text-lg p-4 font-medium">
                            <SpinningCircles className='mx-auto' />
                        </div>
                    )}
                </div>
            </BaseModal>

            {/* Header */}
            {/* <div className="p-6  border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Marketplace</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search agents..."
                            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                    Discover and deploy pre-built Web3 agents for Aptos blockchain
                </p>
            </div> */}

            <div className="flex backdrop-blur-sm justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
                    <p className="text-gray-400">
                        Discover and deploy pre-built Web3 agents made by the community
                    </p>
                </div>

            </div>

            {/* Category Navigation */}
            {/* <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${activeCategory === category.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div> */}

            {/* Filters */}
            {/* <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Free
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Paid
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Verified
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        <select
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>
                </div>
            </div> */}

            {/* Marketplace Grid */}
            <div className="p-4 px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <div key={item.id} className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-lg shadow p-6    overflow-hidden hover:shadow-md transition-shadow">
                            <div className='flex flex-row justify-between' >
                                {item.isApproved && (
                                    <div className="  top-0 right-0 m-2 px-2 py-1 bg-blue-600 rounded text-xs font-medium text-white flex items-center">
                                        <Award className="h-3 w-3 mr-1" />
                                        Verified
                                    </div>
                                )}
                                {item.price > 0 ? (
                                    <div className=" not-last: top-0 left-0 m-2 px-2 py-1 bg-blue-600 rounded text-xs font-medium text-white flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {item.price}
                                    </div>
                                ) : (
                                    <div className="    top-0 left-0 m-2 px-2 py-1 bg-white rounded text-xs font-medium text-gray-900">
                                        Free
                                    </div>
                                )}
                            </div>
                            <div className="p-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-white">{item.publicName}</h3>
                                </div>
                                {/* <p className="mt-1 text-sm text-gray-200">By {item.creator}</p> */}
                                <p className="mt-2 text-sm text-gray-400 line-clamp-2">{item.description}</p>

                                {/* <div className="mt-3 flex flex-wrap gap-1">
                                    {item.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div> */}

                                <div className="mt-2 flex items-center justify-between">

                                    <div className="flex items-center text-sm text-gray-200">
                                        <Download className="h-4 w-4 mr-1" />
                                        {item.redeployCount || 0}
                                    </div>
                                </div>

                                <button disabled={loading} onClick={() => onDeploy(item)} className="mt-4 w-full py-2 px-3 bg-white cursor-pointer text-gray-900 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Deploy Agent
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {/* <div className="p-6 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                    <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 rounded bg-indigo-50 border border-indigo-500 text-sm text-indigo-700">
                        1
                    </button>
                    <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                        2
                    </button>
                    <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                        3
                    </button>
                    <span className="text-gray-500">...</span>
                    <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                        8
                    </button>
                    <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                        Next
                    </button>
                </nav>
            </div> */}
        </div>

    )
}

export default Marketplace