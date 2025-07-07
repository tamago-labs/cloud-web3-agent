"use client"


import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { getCurrentUser, signIn } from 'aws-amplify/auth';
import { useInterval } from 'usehooks-ts';
import { userProfileAPI } from "@/lib/api";
import { useContext, useState } from "react";
import { AccountContext } from "@/contexts/account";
import { ServerContext } from "@/contexts/server";


const Header = ({ bgColor }: any) => {

    const { profile, saveProfile } = useContext(AccountContext)
    const [interval, setInterval] = useState(3000)

    useInterval(
        () => {
            (async () => {
                try {
                    const { username, userId, signInDetails } = await getCurrentUser();
                    const profile = await userProfileAPI.getProfile(username)
                    saveProfile(profile)
                    setInterval(60000)
                } catch (e) {
                    console.log(e)
                    setInterval(3000)
                }

            })()
        },
        interval
    )


    return (
        <header className={`relative z-30 ${bgColor}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
                    {/* Logo */}
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/" className="flex items-center">
                            <span className="text-gray-900 text-xl font-bold font-mono">
                                [tamago_labs]
                            </span>
                        </Link>
                    </div>


                    {/* Desktop navigation */}
                    <nav className="hidden md:flex space-x-2 md:space-x-8">
                        <Link href="/browse" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Browse All
                        </Link>
                        <Link href="/client" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Online Client
                        </Link>
                        {/*<Link href="/mcp-client" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            MCP Client
                        </Link> */}
                        <a href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center">
                            Docs
                            <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="flex items-center justify-end space-x-4 md:flex-1 lg:w-0">
                        <Link
                            href="/submit"
                            className="whitespace-nowrap hidden md:block px-4 py-2 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                            Submit Server
                        </Link>
                        <Link
                            href="/dashboard"
                            className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                        >
                            {profile ? "Dashboard" : "Sign In"}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header