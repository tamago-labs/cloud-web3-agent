import type { Metadata } from "next";
import "./globals.css";
import Head from 'next/head'
import Footer from "@/components/Footer"
import {  Mulish } from "next/font/google";

const MulishFont = Mulish({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tamago Labs | Cloud for Web3 Agents",
  description: "Easily deploy and manage AI agents on multiple blockchains.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        {/* Favicon  */}
        <link rel="icon" type="icon" href="/assets/images/favicon.ico" /> 
      </Head>
      <body className={MulishFont.className}>
          <div className="flex min-h-screen flex-col bg-gray-950 text-base font-normal text-black w-full">
            <div className="relative overflow-hidden"> 
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              {/* Mesh gradient effect */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute top-32 -left-12 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
              <div className=" flex min-h-screen  flex-col">
                <div className="flex-grow text-white ">
                  {children}
                </div>
                <Footer />
              </div>
            </div>
          </div>
      </body>
    </html>
  );
}
