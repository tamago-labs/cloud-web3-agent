
"use client"

import Link from "next/link"
import { useEffect, useContext, useState } from "react";
import Footer from "@/components/Footer"
import LandingBohdiTree from "@/components/V3/LandingBohdiTree";
import LandingTamagoLabs from "@/components/V3/LandingTamagoLabs";

export default function App() {

  const [currentDomain, setCurrentDomain] = useState<any>(undefined);

  useEffect(() => {
    const currentDomain = window.location.origin
    setCurrentDomain(currentDomain.includes("tamagolabs.com") ? "tamago_labs" : "bodhi_tree"); // or window.location.hostname
  }, []);

  return (
    <>
      {currentDomain === "tamago_labs" && <LandingTamagoLabs />}
      {currentDomain === "bodhi_tree" && <LandingBohdiTree />}
      <Footer />
    </>
  );
}
