"use client"

import { useEffect, useContext, useState } from "react";
import Link from 'next/link';

const Footer = () => {

    const [brand, setBrand] = useState('Bohdi Tree');

    useEffect(() => {
        const currentDomain = window.location.origin
        setBrand(currentDomain.includes("tamagolabs.com") ? "Tamago Labs" : "Bohdi Tree"); // or window.location.hostname
    }, []);

    return (
        <footer className="mt-auto  ">
            <div className={`${ brand === "Tamago Labs" ? "bg-white" : "bg-orange-50"} py-8 border-t border-gray-200`}>
                <div className="mx-auto relative px-4 max-w-6xl">
                    {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center mb-3">
                                <span className="text-gray-900 text-base md:text-lg font-bold">Tamago Blockchain Labs Co., Ltd.</span>
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    Since 2022
                                </span>
                            </div>
                            <div className="text-gray-900 transition mb-2 font-medium">
                                Tamago Blockchain Labs Co., Ltd.
                            </div>
                            <p className="text-gray-600 mb-3 text-sm max-w-md">
                                Co-Working Q, 1-1, JR Hakata City B1F, Hakata<br /> Fukuoka, Japan 812-0012
                            </p>
                            <div className="grid text-gray-600 text-sm grid-cols-1  md:grid-cols-2 max-w-md gap-0 md:gap-3">
                                <div>
                                    Phone: (81) 80-4894-2495
                                </div>
                                <div>
                                    Email: support@tamagolabs.com
                                </div>
                            </div>
                        </div>

                        <div className="flex  flex-row gap-6 md:gap-8">
                            <div>
                                <h4 className="text-gray-900 font-medium mb-3">Platform</h4>
                                <div className="space-y-2">
                                    <Link href="/discover" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Community Analytics
                                    </Link>
                                    <Link href="/browse" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Browse Servers
                                    </Link>
                                    <Link href="/client" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Online Client
                                    </Link> 
                                </div>
                            </div> 
                            <div>
                                <h4 className="text-gray-900 font-medium mb-3">Resources</h4>
                                <div className="space-y-2">
                                    <Link href="https://docs.tamagolabs.com" target="_blank" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Documentation
                                    </Link> 
                                    <Link href="/server-status" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Server Status
                                    </Link>
                                    <Link href="/submit" className="block text-gray-600 hover:text-gray-900 text-sm transition">
                                        Submit Server
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Bottom section - Copyright and legal */}
                    <div className=" ">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                © {new Date().getFullYear()}{' '}
                                <Link href="/" className="text-gray-900 hover:text-blue-600 transition font-medium">
                                    {brand}
                                </Link>
                                . All rights reserved.
                            </div>

                            <div className="flex flex-row gap-6">
                                <Link href="https://docs.tamagolabs.com/privacy-policy" target="_blank" className="text-gray-600 hover:text-gray-900 text-sm transition">
                                    Privacy Policy
                                </Link>
                                <Link href="https://docs.tamagolabs.com/terms-of-service" target="_blank" className="text-gray-600 hover:text-gray-900 text-sm transition">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
