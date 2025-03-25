"use client";

import Hero from "@/components/Landing/Hero";
import Contact from "@/components/Landing/Contact"
import KeyBenefits from "@/components/Landing/Benefits";
import HowItWorks from "@/components/Landing/HowItWorks";
// import Applications from "@/components/Landing/Applications";
import PlatformIntegration from "@/components/Landing/PlatformIntegration";
import FAQSection from "@/components/Landing/Faq";

export default function App() {
  return (
    <main>
      <Hero/>
      <KeyBenefits/>
      <HowItWorks/> 
      <PlatformIntegration/> 
      <FAQSection/>
      <Contact/>

    </main>
  );
}
