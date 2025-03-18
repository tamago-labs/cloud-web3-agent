"use client"

import Link from "next/link"
import { Layout, Columns, LogOut, MessageSquare, Settings, Grid, Plus, Home, BarChart, PieChart, RefreshCcw, Database, List, User, DownloadCloud } from "react-feather"
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation";
import { CloudAgentContext } from "@/hooks/useCloudAgent";
import { useEffect, useContext, useState } from "react";
import { getCurrentUser } from 'aws-amplify/auth';

const Navbar = () => {

    const [user, setUser] = useState<any>(undefined)

    const { loadProfile } = useContext(CloudAgentContext)

    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                setUser({
                    username,
                    userId,
                    ...signInDetails
                })
            } catch (e) {
                setUser(undefined)
            }
        })()
    }, [])

    useEffect(() => {
        user && user.userId && loadProfile(user.userId)
    }, [user])

    return (
        <div className="w-full relative h-full p-6 px-0 space-y-4 text-white text-lg bg-gradient-to-br from-blue-900/20 to-indigo-900/20  border-r border-white/10 backdrop-blur-sm ">
            <Link href="/" className="inline-flex relative w-full">
                <div className="mx-auto px-4 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-md flex items-center shadow-lg  ">
                    <h1 className="font-bold text-white text-lg relative z-10">Tamago Labs</h1>
                </div>
            </Link>

            <div className="mt-[10px] flex flex-col">
                <Link href="/dashboard" className="border-b-2 flex flex-row border-t-2 px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <Layout className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Dashboard
                    </div>
                </Link>
                <Link href="/dashboard/new" className="border-b-2  flex flex-row px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <Plus className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        New Agent
                    </div>
                </Link>
                {/* <Link href="/dashboard/automation" className="border-b-2 flex flex-row  px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <RefreshCcw className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Automation
                    </div>
                </Link>  */}
                {/* <Link href="/dashboard/chat2" className="border-b-2 flex flex-row px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <MessageSquare className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Chat2
                    </div>
                </Link> */}
                {/* <Link href="/dashboard/automation2" className="border-b-2 flex flex-row  px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <RefreshCcw className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Automation2
                    </div>
                </Link> */}
                <Link href="/dashboard/marketplace" className="border-b-2  flex flex-row px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <DownloadCloud className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Marketplace
                    </div>
                </Link>
                <Link href="/dashboard/settings" className="border-b-2 flex flex-row px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <User className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Account
                    </div>
                </Link>
                <div onClick={handleSignOut} className="border-b-2 cursor-pointer flex flex-row px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <LogOut className="mr-2 my-auto" />
                    <div className="my-auto text-base">
                        Sign Out
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Navbar