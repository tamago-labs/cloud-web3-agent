

import { Providers } from "./providers";
import { Inter } from "next/font/google";

const InterFont = Inter({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
});

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <div className={`${InterFont.className} min-h-screen flex flex-col `}>
                {children}
            </div>
        </Providers>
    )
}
