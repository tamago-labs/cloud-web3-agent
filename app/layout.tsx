import type { Metadata } from "next";
import "./globals.css";
import Head from 'next/head'
import Footer from "@/components/Footer"
import Header from "@/components/Header";
import { Inter } from "next/font/google";

const InterFont = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Tamago Labs | The MCP Hub for Web3",
  description: "Run, test, and deploy decentralized AI agents with MCP servers and multi-chain Web3 integration—no setup required.",
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
        <div className="flex flex-col min-h-screen w-full ">
          {children}
          <Footer />
        </div>
      </div>
      </body>
    </html>
  );
}
