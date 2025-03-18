
import Navbar from "@/components/Navbar";
import { Providers } from "../providers";
import {  Mulish } from "next/font/google";

const MulishFont = Mulish({
    weight: ["400", "500", "700", "800"],
    subsets: ["latin"],
  });

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Providers> 
            <div className={`${MulishFont.className} min-h-screen flex flex-row `}>
                <div className="w-[200px]">
                    <Navbar/>
                </div>
                <div className="flex-grow">
                    {children}
                </div> 
            </div>
            
        </Providers>
    )
}
