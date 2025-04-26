'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react" 
import LoginButton from "./LoginButton"
import { X, Menu, Globe, ExternalLink } from 'lucide-react'; 

const Header = ({ signIn } : any) => {
 

    const path = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)



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
                    <a
                        onClick={signIn}
                        className="whitespace-nowrap px-5 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-500 hover:bg-teal-600"
                    >
                        Sign In
                    </a>
                </div>
            </div>
        </div>

        {/* Mobile menu */}

    </header>
    )
}

// const HeaderOLD = () => {

//     const path = usePathname()
//     const [isOpen, setIsOpen] = useState(false)

//     return (
//         <header className={`relative text-white  top-0 z-50  duration-300`}>
//             <div className="mx-auto w-full max-w-6xl py-2 px-4 flex flex-row justify-between">

//                 <Link href="/" className="inline-flex">
//                     <div className="relative px-4 py-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-md flex items-center shadow-lg shadow-purple-900/20">
//                         <div className="absolute inset-0 bg-black opacity-20 rounded-md"></div>

//                         <h1 className="font-bold text-white text-lg relative z-10">Tamago Labs</h1>
//                     </div>
//                 </Link>
//                 {/* Desktop Navigation */}
//                 <nav className="hidden md:flex justify-between space-x-[60px] my-auto ">
//                     <Link href="#how-it-works" className={` `}>
//                         How It Works
//                     </Link>
//                     <Link href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className={`  `}>
//                         Github
//                     </Link>
//                     <Link href="#contact" className={`   `}>
//                         Contact
//                     </Link>
//                 </nav>

//                 {/* Connect Wallet Button */}
//                 <div className='hidden md:flex w-[200px] '>
//                     <div className='m-auto'>
//                         <LoginButton />
//                     </div>
//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
//                     {isOpen ? <X size={28} /> : <Menu size={28} />}
//                 </button>

//             </div>
//             {/* Mobile Menu */}
//             {isOpen && (
//                 <div className="md:hidden bg-gray-900 my-2 text-white py-4">
//                     <nav className="flex flex-col items-center space-y-4">
//                     <Link href="#" className={` `}>
//                         How It Works
//                     </Link>
//                     <Link href="https://github.com/tamago-labs/cloud-web3-agent" target="_blank" className={`  `}>
//                         Github
//                     </Link>
//                     <Link href="#contact" className={`   `}>
//                         Contact
//                     </Link>
//                         <LoginButton />
//                     </nav>
//                 </div>
//             )}
//         </header>
//     )
// }

export default Header