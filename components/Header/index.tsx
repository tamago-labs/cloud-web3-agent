'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import LoginButton from "./LoginButton"
import { X, Menu, Globe, ExternalLink } from 'lucide-react';

const Header = ({ signIn }: any) => {

    const path = usePathname()
    // const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="relative z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
                    {/* Logo */}
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/" className="flex  ">
                            <div className="ml-3  flex my-auto flex-col">
                                <span className="text-white text-xl font-bold">Tamago Labs</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className=" hidden md:flex space-x-2 md:space-x-16">
                        {/* <Link href="/dashboard" className="text-teal-100 hover:text-white font-medium">
                        Dashboard
                    </Link>  */}
                        <Link href="/#how-it-works" className="text-teal-100   hover:text-white font-medium">
                            How It Works
                        </Link>
                        <a href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className="text-teal-100  hover:text-white font-medium transition-colors flex items-center">
                            GitHub
                            <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                        <a href="/#contact" className="text-teal-100   hover:text-white font-medium">
                            Contact
                        </a>
                    </nav>
                    <div className=" flex items-center justify-end md:flex-1 lg:w-0">
                        {/* <a
                        onClick={signIn}
                        className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-500 hover:bg-teal-600"
                    >
                        Sign In
                    </a> */}
                        <LoginButton />
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Header