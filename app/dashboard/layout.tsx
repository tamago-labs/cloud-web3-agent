
import Navbar from "@/components/Navbar";
import { Providers } from "../providers";
import { IBM_Plex_Mono } from "next/font/google";

import Layout from '@/components/Dashboard/Layout/DashboardLayout';
 
const MonoFont = IBM_Plex_Mono({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
});

// export default function DashboardLayout({
//     children
// }: {
//     children: React.ReactNode
// }) {
//     return (
//         <Providers> 
//             <div className={`${MulishFont.className} min-h-screen flex flex-row `}>
//                 <div className="w-[200px]">
//                     <Navbar/>
//                 </div>
//                 <div className="flex-grow">
//                     {children}
//                 </div> 
//             </div>
//         </Providers>
//     )
// }

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <div className={`${MonoFont.className} min-h-screen flex flex-row `}>
                <Layout>
                    {children}
                </Layout>
            </div>
        </Providers>
    )
}
