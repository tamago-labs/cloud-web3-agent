
import Navbar from "@/components/Navbar";
import { Providers } from "../providers";

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Providers> 
            <div className="min-h-screen flex flex-row ">
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
