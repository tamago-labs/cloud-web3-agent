"use client"

import React, { useState } from 'react';
import { Globe, Cpu, Zap, Code, Infinity, Boxes, X } from 'lucide-react';
import Hero from "./Hero2" 
import Features from "./Features"
import Contact from "./Contact"
import HowItWorks from "./HowItWorks"
import SupportList2 from "./SupportList2"
import Header from "@/components/Header"
import VideoDemo from "./VideoDemo"
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

const NewLandingContainer = () => {

    const router = useRouter()

    const [modal, setModal] = useState<boolean>(false)

    const onSignIn = () => {
        setModal(true)
    }

    return (
        <>

            {modal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-teal-800 rounded-xl border border-gray-700 p-6 max-w-lg w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl text-white font-bold">
                                Upgrade in Progress
                            </h3>
                            <button
                                className="text-teal-100/80  hover:text-white"
                                onClick={() => setModal(false)}
                            >
                                <X />
                            </button>
                        </div>
                        <div className="space-y-4"> 
                            <div className="text-sm md:text-base text-teal-100/80  text-center">
                                We're upgrading to support MCP. You're about to access an older version with reduced performance.
                            </div>

                            <div className="flex text-white space-x-3">
                                <button
                                    className={`flex-1 cursor-pointer px-4 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors`}
                                    onClick={() => {
                                        router.push("/dashboard")
                                    }}
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    </motion.div>
                </div>
            )

            }

            <Header signIn={onSignIn} />
            {/* Main Hero Content */}
            <div className="max-w-7lx mx-auto    z-10 px-0 md:px-4 relative">
                <Hero signIn={onSignIn} />

                {/* <div className=" relative grid text-blue-200 grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="bg-blue-800/40 hover:bg-blue-700/50 border border-blue-700/40 rounded-lg p-6">
                        <div className="text-3xl font-bold text-white mb-2">4+</div>
                        <div className="text-[#A5B4FC]">Blockchain Networks</div>
                    </div>
                    <div className="bg-blue-800/40 hover:bg-blue-700/50 border border-blue-700/40 rounded-lg p-6">
                        <div className="text-3xl font-bold text-white mb-2">60+</div>
                        <div className="text-[#A5B4FC]">Protocols Available</div>
                    </div>
                    <div className="bg-blue-800/40 hover:bg-blue-700/50 border border-blue-700/40 rounded-lg p-6">
                        <div className="text-3xl font-bold text-white mb-2">100+</div>
                        <div className="text-[#A5B4FC]">Agents Created</div>
                    </div>
                </div> */}
            </div>
            <Features />
            <HowItWorks />
            <SupportList2 />
            <VideoDemo/>
            {/* <SupportList /> */}
            <Contact />

        </>
    )
}

export default NewLandingContainer