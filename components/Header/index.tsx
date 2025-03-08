'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "react-feather"
import LoginButton from "./LoginButton"

const Header = () => {

    const path = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className={`relative text-white  top-0 z-50  duration-300`}>
            <div className="mx-auto w-full max-w-6xl py-2 px-4 flex flex-row justify-between">

                <Link href="/" className="inline-flex">
                    <div className="relative px-4 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-md flex items-center shadow-lg shadow-purple-900/20">
                        <div className="absolute inset-0 bg-black opacity-20 rounded-md"></div>

                        <h1 className="font-bold text-white text-lg relative z-10">Tamago Labs</h1>
                    </div>
                </Link>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex justify-between space-x-[60px] my-auto ">
                    <Link href="#" className={` `}>
                        How It Works
                    </Link>
                    <Link href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className={`  `}>
                        Github
                    </Link>
                    <Link href="#contact" className={`   `}>
                        Contact
                    </Link>
                </nav>

                {/* Connect Wallet Button */}
                <div className='hidden md:flex w-[200px] '>
                    <div className='m-auto'>
                        <LoginButton />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 my-2 text-white py-4">
                    <nav className="flex flex-col items-center space-y-4">
                    <Link href="#" className={` `}>
                        How It Works
                    </Link>
                    <Link href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className={`  `}>
                        Github
                    </Link>
                    <Link href="#contact" className={`   `}>
                        Contact
                    </Link>
                        <LoginButton />
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header