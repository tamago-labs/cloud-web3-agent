import type { Metadata } from "next";
import "./globals.css";
import Head from 'next/head' 
import { Inter } from "next/font/google";
import { Providers } from "./providers"

const InterFont = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // title: "Dune Analytics via Chat – No SQL Needed | Bodhi Tree Analytics",
  // title: "Dune Analytics via Chat – No SQL Needed",
  title: "The MCP Hub for Web3",
  description: "Ask questions like 'Show Aave TVL' or 'Track Vitalik’s wallet' and get real-time blockchain charts instantly—no SQL, no setup, just chat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" type="icon" href="/assets/images/favicon.ico" />
      </Head>
      <body className={InterFont.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
            <div className="flex flex-col min-h-screen w-full ">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
