"use client"

import Link from "next/link"
import { Cast, LogOut, MessageSquare, Settings, Grid } from "react-feather"
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation";


const Navbar = () => {


    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push("/")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return (
        <div className="w-full relative h-full p-6 px-0 space-y-4 text-white text-lg bg-gradient-to-br from-blue-900/20 to-indigo-900/20  border-r border-white/10 backdrop-blur-sm ">
            <Link href="/" className="inline-flex relative w-full">
                <div className="mx-auto px-4 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-md flex items-center shadow-lg  ">
                    <h1 className="font-bold text-white text-lg relative z-10">Tamago Labs</h1>
                </div>
            </Link>

            <div className="mt-[10px] flex flex-col">
                <Link href="/dashboard" className="border-b-2  inline-flex border-t-2 px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <Grid className="mr-1.5" />
                    Agents
                </Link>
                <Link href="/dashboard/chat" className="border-b-2 inline-flex  px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <MessageSquare className="mr-1.5" />
                    Chat
                </Link>
                <Link href="/dashboard/settings" className="border-b-2 inline-flex px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <Settings className="mr-1.5" />
                    Settings
                </Link>
                <div onClick={handleSignOut} className="border-b-2 cursor-pointer inline-flex px-4 w-full py-4 font-medium  border-white/10 hover:bg-white/5">
                    <LogOut className="mr-1.5" />
                    Sign Out
                </div>
            </div>



        </div>
    )
}

export default Navbar