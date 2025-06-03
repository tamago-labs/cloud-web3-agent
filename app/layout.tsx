import type { Metadata } from "next";
import "./globals.css";
import Head from 'next/head'
import Footer from "@/components/Footer"
import Header from "@/components/Header";
import { Sora } from "next/font/google";

const SoraFont = Sora({
  weight: ["400", "500", "700"],
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
      <body className={SoraFont.className}>
        <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-teal-800 relative overflow-hidden">
          {/* Background Elements */}
          {/* <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-900 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900 rounded-full filter blur-3xl"></div>
          </div>  */}
          <div className="flex flex-col min-h-screen w-full ">
            {/* <Header/> */}
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
